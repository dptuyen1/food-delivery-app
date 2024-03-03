import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { categoryService } from "~/services/category";
import CategoryItem from "~/components/CategoryItem";
import { productService } from "~/services/product";
import ProductItem from "~/components/ProductItem";
import Cart from "~/components/Cart";
import { useCartContext, useUserContext } from "~/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Map from "~/components/Map";
import { getRegion } from "~/services/map";
import { commentService } from "~/services/comment";
import RatingBar from "~/components/RatingBar";
import { ratingService } from "~/services/rating";
import { AntDesign } from "@expo/vector-icons";
import { followService } from "~/services/follow";

const Details = ({ navigation, route }) => {
    const restaurant = route.params;

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [comments, setComments] = useState([]);
    const [starRate, setStarRate] = useState(0);

    const [query, setQuery] = useState();

    const [cartQuantity] = useCartContext();

    const [cart, setCart] = useState({});
    const [sum, setSum] = useState(0);

    const [user] = useUserContext();

    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.007,
        longitudeDelta: 0.0355,
    });

    const [isFollow, setIsFollow] = useState(false);

    const handleSomeThing = () => {
        if (user) {
            navigation.navigate("checkout", {
                cart,
                sum,
                cartQuantity,
                restaurant,
            });
        } else {
            navigation.navigate("login");
        }
    };

    useEffect(() => {
        const loadCategories = async () => {
            let res = await categoryService.getCategories(restaurant.id);

            setCategories(res.data);
        };

        const loadProducts = async () => {
            let res;
            if (query) {
                res = await productService.getProducts(restaurant.id, query);
            } else {
                res = await productService.getProducts(restaurant.id);
            }

            setProducts(res.data);
        };

        const loadComments = async () => {
            let res = await commentService.getComments(restaurant.id);

            setComments(res.data);
        };

        const loadCart = async () => {
            let cartData = await AsyncStorage.getItem("cart");
            let cart = cartData ? JSON.parse(cartData) : {};

            setCart(cart);

            if (Object.keys(cart).length) {
                setSum(
                    Object.values(cart).reduce(
                        (init, item) =>
                            init + item["unit_price"] * item["quantity"],
                        0
                    )
                );
            }
        };

        const loadRegion = async () => {
            let res = await getRegion(restaurant.address);
            let { data } = res;
            let results = data.results[0];
            let { position } = results;
            let { lat, lon } = position;

            setRegion((prev) => {
                return {
                    ...prev,
                    latitude: lat,
                    longitude: lon,
                };
            });
        };

        const loadRatingList = async () => {
            let res = await ratingService.getRatingList(restaurant.id);

            let rate = Object.values(res.data).reduce(
                (init, current) => init + current["rate"],
                0
            );

            setStarRate(rate / res.data.length);
        };

        const checkIsFollow = async () => {
            let accessToken = await AsyncStorage.getItem("accessToken");
            let res = await followService.checkFollow(
                accessToken,
                restaurant.id
            );

            setIsFollow(res.data);
        };

        if (user) checkIsFollow();
        loadCategories();
        loadProducts();
        loadComments();
        loadCart();
        loadRegion();
        loadRatingList();
    }, [query, cartQuantity, restaurant]);

    const handleFollow = async () => {
        let accessToken = await AsyncStorage.getItem("accessToken");
        let data = {
            restaurant: restaurant.id,
        };
        let res = await followService.add(accessToken, data);

        setIsFollow(res.data.is_active);
    };

    return (
        <View style={[GlobalStyles.container]}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.heading}>{restaurant.name}</Text>
                        {user && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleFollow()}
                            >
                                {!isFollow ? (
                                    <Text style={styles.buttonText}>
                                        Theo dõi
                                    </Text>
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Hủy theo dõi
                                    </Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                    {!!starRate && (
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {starRate}{" "}
                            <AntDesign name="staro" size={20} color="black" />
                        </Text>
                    )}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("comment", {
                                restaurant,
                            })
                        }
                    >
                        <View style={styles.commentContainer}>
                            <Text style={styles.viewCommentButtonText}>
                                Xem bình luận ({comments.length})
                            </Text>
                            <MaterialIcons
                                name="navigate-next"
                                size={24}
                                color="black"
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {user && <RatingBar restaurant={restaurant} />}

                <View style={styles.content}>
                    {categories.length > 0 && (
                        <View style={styles.categoryContainer}>
                            <CategoryItem
                                data={{ id: 0, name: "Tất cả" }}
                                onPress={() => setQuery()}
                            />
                            {categories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    data={category}
                                    onPress={() => setQuery(category.id)}
                                />
                            ))}
                        </View>
                    )}
                    {products.length > 0 && (
                        <View style={styles.productContainer}>
                            {products.map((product) => {
                                return (
                                    <ProductItem
                                        key={product.id}
                                        data={product}
                                        restaurant={restaurant.id}
                                    />
                                );
                            })}
                        </View>
                    )}

                    <Map region={region} />
                </View>
            </ScrollView>

            {!!Object.keys(cart).length && (
                <Cart
                    cartQuantity={cartQuantity}
                    sum={sum}
                    onPress={handleSomeThing}
                />
            )}
        </View>
    );
};

export default Details;

const styles = StyleSheet.create({
    container: {
        gap: 20,
        position: "relative",
    },
    header: {
        backgroundColor: "white",
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
        gap: 10,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    heading: {
        fontSize: 26,
        fontWeight: "500",
    },
    button: {
        padding: 10,
        backgroundColor: "#007fff",
        borderRadius: 6,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    commentContainer: {
        flexDirection: "row",
    },
    viewCommentButtonText: {
        fontSize: 16,
    },
    content: {
        gap: 10,
    },
    categoryContainer: {
        backgroundColor: "white",
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
    },
    productContainer: {
        backgroundColor: "white",
        borderRadius: 6,
        gap: 10,
        padding: 10,
    },
});
