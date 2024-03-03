import {
    Button,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { useUserContext } from "~/hooks";
import { categoryService } from "~/services/category";
import { productService } from "~/services/product";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatMoneyUnit } from "~/utils/helper";

const Product = () => {
    const [user] = useUserContext();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(1);
    const [loadingShow, setLoadingShow] = useState(false);

    const [product, setProduct] = useState({
        name: "",
        price: "",
        image: "",
        restaurant: user.restaurant.id,
        category: selectedCategory,
    });

    const handleChange = (val, field) => {
        setProduct({
            ...product,
            [field]: val,
        });
    };

    const handleChooseImage = async () => {
        let { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Permission Denied!");
        } else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                handleChange(res.assets[0], "image");
            }
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
            let res = await productService.getProducts(user.restaurant.id);

            setProducts(res.data);
        };

        const loadCategories = async () => {
            let res = await categoryService.getCategories(user.restaurant.id);

            setCategories(res.data);
        };

        loadProducts();
        loadCategories();
    }, []);

    const handleAdd = async () => {
        setLoadingShow(true);
        const form = new FormData();

        for (let field in product) {
            if (field === "image") {
                form.append(field, {
                    uri: product[field].uri,
                    name: product[field].fileName,
                    type: product[field].mimeType,
                });
            } else {
                form.append(field, product[field]);
            }
        }
        let accessToken = await AsyncStorage.getItem("accessToken");
        let res = await productService.add(accessToken, form);

        setLoadingShow(false);
        setProducts((currentState) => [...currentState, res.data]);
        setProduct((currentState) => {
            return {
                ...currentState,
                name: "",
                price: "",
                image: "",
            };
        });
    };

    return (
        <ScrollView>
            <View style={GlobalStyles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Tên danh mục"
                        value={product.name}
                        onChangeText={(val) => handleChange(val, "name")}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Giá"
                        value={product.price}
                        onChangeText={(val) => handleChange(val, "price")}
                        keyboardType="numeric"
                    />
                    {!loadingShow && (
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#93E9BE",
                                borderRadius: 6,
                                padding: 10,
                            }}
                            onPress={() => handleChooseImage()}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontSize: 16,
                                }}
                            >
                                Chọn logo
                            </Text>
                        </TouchableOpacity>
                    )}
                    {product.image && (
                        <Image
                            source={{ uri: product.image.uri }}
                            width={100}
                            height={100}
                            style={{
                                alignSelf: "center",
                            }}
                        />
                    )}
                    {categories.length > 0 ? (
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedCategory(itemValue)
                            }
                        >
                            {categories.map((category) => {
                                return (
                                    <Picker.Item
                                        key={category.id}
                                        label={category.name}
                                        value={category.id}
                                    />
                                );
                            })}
                        </Picker>
                    ) : (
                        <Text>Chưa có danh mục, vui lòng thêm mới</Text>
                    )}

                    {loadingShow ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Button
                            title="Thêm sản phẩm"
                            onPress={() => handleAdd()}
                        />
                    )}
                </View>
                {products.length > 0 && (
                    <View style={styles.categoryContainer}>
                        {products.map((product) => {
                            return (
                                <View key={product.id} style={styles.category}>
                                    <Text>{product.name}</Text>
                                    <Text>
                                        {formatMoneyUnit(product.price)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Product;

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
    category: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
