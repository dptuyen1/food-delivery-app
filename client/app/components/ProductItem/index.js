import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { formatMoneyUnit } from "~/utils/helper";
import { useCartContext } from "~/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductItem = ({ data, restaurant }) => {
    const [, dispatch] = useCartContext();

    const isSameRestaurant = (cart) => {
        //cart = {
        //1: {
        //name: name,
        //price: price,
        //},
        //2: {
        //name: name,
        //price: price,
        //},
        //}

        //tao mang cartKeys = [1, 2]
        const cartKeysArray = Object.keys(cart);
        //kiem tra key dau tien cua cart, cart[0].restaurant_id === restaurant
        return cart[cartKeysArray[0]].restaurant_id === restaurant;
    };

    const handleAddToCart = async (event, product) => {
        event.stopPropagation();

        let cart = await AsyncStorage.getItem("cart");

        if (!cart) {
            cart = {};
        } else {
            cart = JSON.parse(cart);
        }

        if (Object.keys(cart).length) {
            if (!isSameRestaurant(cart)) {
                alert(
                    "Có vẻ bạn đã chọn 2 sản phẩm của 2 cửa hàng khác nhau, sản phẩm ở cửa hàng trước sẽ bị xóa!"
                );

                dispatch({
                    type: "UPDATE",
                    payload: 0,
                });

                await AsyncStorage.removeItem("cart");
                return;
            }
        }

        if (product.id in cart) {
            cart[product.id]["quantity"] += 1;
        } else {
            cart[product.id] = {
                product_id: product.id,
                name: product.name,
                image: product.img,
                unit_price: product.price,
                quantity: 1,
                restaurant_id: restaurant,
            };
        }

        console.log(cart);

        dispatch({
            type: "INCREASE",
            payload: 1,
        });

        await AsyncStorage.setItem("cart", JSON.stringify(cart));
    };

    return (
        <TouchableOpacity style={styles.container}>
            <Image source={{ uri: data.img }} width={100} height={100} />
            <View>
                <Text style={styles.title}>{data.name}</Text>
                <Text style={styles.price}>{formatMoneyUnit(data.price)}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={(event) => handleAddToCart(event, data)}
                >
                    <AntDesign name="plus" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default ProductItem;

const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
        backgroundColor: "white",
        padding: 10,
        elevation: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowColor: "#333",
        shadowOpacity: 0.8,
        shadowRadius: 2,
        flexDirection: "row",
        gap: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    price: {
        fontSize: 16,
        color: "coral",
    },
    buttonContainer: {
        // borderWidth: 1,
        // borderColor: "black",
        flex: 1,
        position: "relative",
    },
    button: {
        padding: 10,
        backgroundColor: "coral",
        borderRadius: 6,
        position: "absolute",
        bottom: 0,
        right: 0,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
