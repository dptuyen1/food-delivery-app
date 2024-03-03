import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { formatMoneyUnit } from "~/utils/helper";

const CartItem = ({ item }) => {
    return (
        <View style={styles.item}>
            <View style={styles.itemInform}>
                <Image source={{ uri: item.image }} width={50} height={50} />
                {item.quantity && (
                    <Text style={{ fontSize: 16 }}>{item.quantity} x</Text>
                )}
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
            </View>
            <Text style={{ fontSize: 16 }}>
                {formatMoneyUnit(item.unit_price)}
            </Text>
        </View>
    );
};

export default CartItem;

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemInform: {
        flexDirection: "row",
        gap: 10,
    },
});
