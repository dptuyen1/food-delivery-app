import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { useUserContext } from "~/hooks";
import { invoiceService } from "~/services/invoice";
import { formatMoneyUnit } from "~/utils/helper";

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [user] = useUserContext();

    useEffect(() => {
        const loadInvoices = async () => {
            let res = await invoiceService.getInvoices(user.id);

            setInvoices(res.data);
        };

        loadInvoices();
    }, []);

    return (
        <ScrollView>
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
                            Hóa đơn của bạn
                        </Text>
                        {invoices.map((invoice) => (
                            <View key={invoice.id} style={styles.invoiceItem}>
                                <Text>
                                    {formatMoneyUnit(invoice.total_price)}
                                </Text>
                                <Text>
                                    {formatMoneyUnit(invoice.delivery_price)}
                                </Text>
                                <Text>{invoice.total_quantity}</Text>
                                {(() => {
                                    switch (invoice.status) {
                                        case 1:
                                            return <Text>Chờ xác nhận</Text>;
                                        case 2:
                                            return <Text>Đang giao</Text>;
                                        case 3:
                                            return <Text>Hoàn thành</Text>;
                                        default:
                                    }
                                })()}
                                {(() => {
                                    switch (invoice.payment) {
                                        case 1:
                                            return <Text>Tiền mặt</Text>;
                                        case 2:
                                            return <Text>Ví MOMO</Text>;
                                        default:
                                    }
                                })()}
                            </View>
                        ))}
                    </View>
                ) : (
                    <View style={GlobalStyles.container}>
                        <Text style={{ fontSize: 16 }}>
                            Không có hóa đơn nào
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Invoice;

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
