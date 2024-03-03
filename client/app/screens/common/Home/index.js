import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { useUserContext } from "~/hooks";
import { restaurantService } from "~/services/restaurant";
import RestaurantItem from "~/components/RestaurantItem";
import { Feather } from "@expo/vector-icons";

const Home = ({ navigation }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const loadRestaurants = async () => {
            let res = await restaurantService.getRestaurants();

            setRestaurants(res.data);
        };

        loadRestaurants();
    }, []);

    const handleNavigate = (restaurant) => {
        navigation.navigate("restaurant", restaurant);
    };

    const handleSearch = async () => {
        if (query) {
            let res = await restaurantService.getRestaurants(query);
            setRestaurants(res.data);
        }
        setQuery("");
    };

    const handleShowAll = async () => {
        setQuery(query);
        let res = await restaurantService.getRestaurants();
        setRestaurants(res.data);
    };

    return (
        <ScrollView style={GlobalStyles.container}>
            {restaurants.length > 0 ? (
                <View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm kiếm"
                            value={query}
                            onChangeText={(val) => setQuery(val)}
                        />
                        <TouchableOpacity
                            style={styles.inputButton}
                            onPress={() => handleSearch()}
                        >
                            <Feather name="search" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.showButton}
                        onPress={() => handleShowAll()}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            Tất cả
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text style={GlobalStyles.errorText}>
                    Không có nhà hàng nào hoạt động
                </Text>
            )}

            {restaurants.length > 0 &&
                restaurants.map((restaurant) => {
                    return (
                        <RestaurantItem
                            key={restaurant.id}
                            data={restaurant}
                            onPress={() => handleNavigate(restaurant)}
                        />
                    );
                })}
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#999",
        flex: 1,
        padding: 10,
        fontSize: 16,
    },
    showButton: {
        padding: 10,
        backgroundColor: "coral",
        alignSelf: "flex-start",
    },
});
