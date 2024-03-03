import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "~/screens/common/Login";
import { CustomerRegister } from "~/screens/customer/Register/export";
import { RestaurantRegister } from "~/screens/restaurant/Register/export";

const UserNavigator = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="login"
                component={Login}
                options={{
                    headerTitle: "Đăng nhập",
                }}
            />
            <Stack.Screen
                name="customer-register"
                component={CustomerRegister}
                options={{
                    headerTitle: "Đăng ký",
                }}
            />
            <Stack.Screen
                name="restaurant-register"
                component={RestaurantRegister}
                options={{
                    headerTitle: "Đăng ký",
                }}
            />
        </Stack.Navigator>
    );
};

export default UserNavigator;
