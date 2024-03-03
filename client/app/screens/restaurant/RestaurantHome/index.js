import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { invoiceService } from "~/services/invoice";
import { formatMoneyUnit } from "~/utils/helper";
import { useUserContext } from "~/hooks";
import { statsService } from "~/services/stats";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RestaurantHome = () => {
    const [invoices, setInvoices] = useState([]);
    const [user] = useUserContext();
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const loadInvoices = async () => {
            let res = await invoiceService.getPendingInvoices(
                user.restaurant.id
            );

            setInvoices(res.data);
        };

        const loadStats = async () => {
            let res = await statsService.getStats(user.restaurant.id);

            setStats(res.data);
        };

        loadStats();
        loadInvoices();
    }, []);

    const handleChangStatus = async (invoice) => {
        let accessToken = await AsyncStorage.getItem("accessToken");
        let res = await invoiceService.confirmInvoice(accessToken, invoice.id);

        setInvoices((currentState) => {
            return currentState.filter((invoice) => invoice.id !== res.data.id);
        });
    };

    return (
        <ScrollView>
            {user.restaurant.is_active ? (
                <View style={GlobalStyles.container}>
                    {invoices.length > 0 ? (
                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    marginVertical: 20,
                                }}
                            >
                                Hóa đơn đang chờ xác nhận
                            </Text>
                            {invoices.map((invoice) => (
                                <View
                                    key={invoice.id}
                                    style={styles.invoiceItem}
                                >
                                    <Text>{invoice.id}</Text>
                                    <Text>
                                        {formatMoneyUnit(invoice.total_price)}
                                    </Text>
                                    <Text>{invoice.total_quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleChangStatus(invoice)
                                        }
                                    >
                                        <Text>Xác nhận hóa đơn</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={GlobalStyles.container}>
                            <Text style={{ fontSize: 16 }}>
                                Không có hóa đơn
                            </Text>
                        </View>
                    )}

                    {stats.length > 0 ? (
                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    marginVertical: 20,
                                }}
                            >
                                Thống kê sản phẩm
                            </Text>
                            {stats.map((stat, index) => (
                                <View key={index} style={styles.invoiceItem}>
                                    <Text>{stat.name}</Text>
                                    <Text>{formatMoneyUnit(stat.revenue)}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={GlobalStyles.container}>
                            <Text style={{ fontSize: 16 }}>
                                Không có thống kê
                            </Text>
                        </View>
                    )}
                </View>
            ) : (
                <View style={GlobalStyles.container}>
                    <Text style={GlobalStyles.errorText}>
                        Nhà hàng của bạn chưa được kích hoạt, vui lòng liên hệ
                        quản trị viên
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default RestaurantHome;

const styles = StyleSheet.create({
    invoiceItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#999",
    },
});
