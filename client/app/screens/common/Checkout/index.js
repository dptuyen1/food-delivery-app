import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { formatMoneyUnit } from "~/utils/helper";
import CartItem from "~/components/CartItem";
import { Picker } from "@react-native-picker/picker";
import { paymentService } from "~/services/payment";
import { invoiceService } from "~/services/invoice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCartContext, useUserContext } from "~/hooks";
import { getDistance, getRegion } from "~/services/map";

const Checkout = ({ navigation, route }) => {
    const { cart, cartQuantity, sum, restaurant } = route.params;

    const [user] = useUserContext();
    const [, dispatch] = useCartContext();

    const [payments, setPayments] = useState([]);
    const [payment, setPayment] = useState(1);
    const paymentLabel = {
        PAYMENT_CASH: "Tiền mặt",
        PAYMENT_MOMO: "Ví MoMo",
    };

    const [deliveryPrice, setDeliveryPrice] = useState(0);

    useEffect(() => {
        const loadPayments = async () => {
            let res = await paymentService.getPayments();

            setPayments(res.data);
        };

        const calculateDistance = async () => {
            let userCoords = await getRegion(user.address);
            let from = userCoords.data.results[0].position;

            let restaurantCoords = await getRegion(restaurant.address);
            let to = restaurantCoords.data.results[0].position;

            let res = await getDistance(from, to);

            let distance = res.data.routes[0].summary.lengthInMeters;
            let km = distance / 1000;

            let price = km >= 5 ? 10000 * km : 0;
            setDeliveryPrice(price);
        };

        loadPayments();
        calculateDistance();
    }, []);

    const handlePay = async () => {
        //bo field image voi name ra khoi object
        let details = Object.values(cart).map((item) => {
            const { image, name, restaurant_id, ...rest } = item;
            return rest;
        });

        let invoice = {
            total_price: sum + deliveryPrice,
            delivery_price: sum >= 500000 ? 0 : deliveryPrice,
            total_quantity: cartQuantity,
            payment: payment,
            status: 1,
            restaurant: restaurant.id,
            details: details,
        };

        let accessToken = await AsyncStorage.getItem("accessToken");
        let res = await invoiceService.add(accessToken, invoice);

        if (payment === 2) {
            const form = new FormData();
            form.append("amount", sum + deliveryPrice);
            let url = await invoiceService.pay(form);

            let { deeplink } = url.data;
            Linking.openURL(deeplink);
        }

        if (res.status === 201) {
            dispatch({
                type: "UPDATE",
                payload: 0,
            });

            await AsyncStorage.removeItem("cart");
            navigation.navigate("invoice");
        }
    };

    return (
        <ScrollView>
            <View style={[GlobalStyles.container, styles.container]}>
                <View style={styles.topContent}>
                    <MaterialIcons name="place" size={24} color="black" />
                    <View style={styles.right}>
                        <Text style={styles.text}>Địa chỉ giao hàng</Text>
                        <Text style={styles.text}>
                            {user.first_name} {user.last_name}
                        </Text>
                        <Text style={styles.text} numberOfLines={2}>
                            {user.address}
                        </Text>
                    </View>
                </View>

                {!!Object.keys(cart).length && (
                    <View style={[styles.topContent, styles.cartDetails]}>
                        {Object.values(cart).map((item) => {
                            return (
                                <CartItem key={item.product_id} item={item} />
                            );
                        })}
                    </View>
                )}

                <View style={[styles.topContent, styles.checkout]}>
                    <View style={styles.content}>
                        <Text style={styles.text}>
                            Tổng cộng ({cartQuantity} món)
                        </Text>
                        <Text style={styles.text}>{formatMoneyUnit(sum)}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.text}>Phí giao hàng</Text>
                        <Text style={styles.text}>
                            {formatMoneyUnit(deliveryPrice)}
                        </Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.text}>Tổng tiền</Text>
                        <Text style={styles.text}>
                            {formatMoneyUnit(sum + deliveryPrice)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.topContent, styles.checkout]}>
                    <View>
                        <Text style={styles.text}>Phương thức thanh toán</Text>
                        <Picker
                            selectedValue={payment}
                            onValueChange={(itemValue, itemIndex) =>
                                setPayment(itemValue)
                            }
                        >
                            {payments.map((payment) => {
                                return (
                                    <Picker.Item
                                        key={payment.id}
                                        label={paymentLabel[payment.name]}
                                        value={payment.id}
                                    />
                                );
                            })}
                        </Picker>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handlePay()}
                    >
                        <Text style={styles.buttonText}>Đặt đơn</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default Checkout;

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    topContent: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 10,
    },
    right: {
        gap: 10,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 16,
    },
    cartDetails: {
        flexDirection: "column",
        gap: 10,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemInform: {
        flexDirection: "row",
        gap: 10,
    },
    checkout: {
        flexDirection: "column",
        gap: 10,
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        padding: 10,
        backgroundColor: "coral",
        borderRadius: 6,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
