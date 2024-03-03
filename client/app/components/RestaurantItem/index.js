import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const RestaurantItem = ({ data, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{ uri: data.image }} width={100} height={100} />
            <Text style={styles.title}>{data.name}</Text>
        </TouchableOpacity>
    );
};

export default RestaurantItem;

const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
        backgroundColor: "white",
        padding: 10,
        marginVertical: 10,
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
});
