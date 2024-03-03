import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { userService } from "~/services/user";
import { restaurantService } from "~/services/restaurant";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminHome = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const loadRestaurants = async () => {
            let res = await restaurantService.getInactiveRestaurants();

            setRestaurants(res.data);
        };

        loadRestaurants();
    }, []);

    const handleChangStatus = async (restaurant) => {
        let accessToken = await AsyncStorage.getItem("accessToken");
        let res = await restaurantService.activeRestaurants(
            accessToken,
            restaurant.id
        );

        setRestaurants((currentState) =>
            currentState.filter((item) => item.id !== res.data.id)
        );
    };

    return (
        <ScrollView>
            {restaurants.length > 0 ? (
                <View style={GlobalStyles.container}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginVertical: 20,
                        }}
                    >
                        Nhà hàng đang chờ kích hoạt
                    </Text>
                    {restaurants.map((restaurant) => {
                        return (
                            <View
                                key={restaurant.id}
                                style={styles.invoiceItem}
                            >
                                <Text>{restaurant.id}</Text>
                                <Text>{restaurant.name}</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        handleChangStatus(restaurant)
                                    }
                                >
                                    <Text>Kích hoạt</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            ) : (
                <View style={[GlobalStyles.container]}>
                    <Text style={{ fontSize: 16 }}>
                        Không có nhà hàng nào cần kích hoạt
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default AdminHome;

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
