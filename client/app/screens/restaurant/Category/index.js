import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { useUserContext } from "~/hooks";
import { categoryService } from "~/services/category";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [user] = useUserContext();
    const [name, setName] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            let res = await categoryService.getCategories(user.restaurant.id);

            setCategories(res.data);
        };
        loadCategories();
    }, []);

    const handleAdd = async () => {
        let data = {
            name: name,
            restaurant: user.restaurant.id,
        };
        let accessToken = await AsyncStorage.getItem("accessToken");
        let res = await categoryService.add(accessToken, data);

        setCategories((currentState) => [...currentState, res.data]);
        setName("");
    };

    return (
        <View style={GlobalStyles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Tên danh mục"
                    value={name}
                    onChangeText={(val) => setName(val)}
                />
                <Button title="Thêm danh mục" onPress={() => handleAdd()} />
            </View>
            {categories.length > 0 && (
                <View style={styles.categoryContainer}>
                    {categories.map((category) => {
                        return (
                            <View key={category.id} style={styles.category}>
                                <Text>{category.name}</Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default Category;

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 10,
        gap: 10,
    },
    input: {
        padding: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#999",
    },
    categoryContainer: {
        backgroundColor: "white",
        padding: 10,
        gap: 10,
    },
});
