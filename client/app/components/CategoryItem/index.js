import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const CategoryItem = ({ data, onPress }) => {
    return (
        <TouchableOpacity key={data.id} onPress={onPress}>
            <Text style={styles.title}>{data.name}</Text>
        </TouchableOpacity>
    );
};

export default CategoryItem;

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: "500",
    },
});
