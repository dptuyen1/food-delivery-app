import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { formatMoneyUnit } from "~/utils/helper";

const Cart = ({ onPress, cartQuantity, sum }) => {
    return (
        <View style={styles.cart}>
            <View style={styles.cartQuantity}>
                <AntDesign name="shoppingcart" size={24} color="black" />
                <Text style={styles.cartQuantityText}>{cartQuantity}</Text>
            </View>

            <View style={styles.cartCheckout}>
                <Text style={styles.cartPrice}>{formatMoneyUnit(sum)}</Text>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={onPress}
                >
                    <Text style={styles.checkoutButtonText}>Giao hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({
    cart: {
        backgroundColor: "white",
        padding: 10,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cartQuantity: {
        position: "relative",
    },
    cartQuantityText: {
        position: "absolute",
        top: -10,
        right: -20,
        color: "coral",
        fontWeight: "bold",
    },
    cartCheckout: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
    },
    cartPrice: {
        color: "coral",
        fontWeight: "700",
    },
    checkoutButton: {
        padding: 10,
        backgroundColor: "coral",
    },
    checkoutButtonText: {
        color: "white",
    },
});
