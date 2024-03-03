import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "~/screens/common/Home";
import Details from "~/screens/restaurant/Details";
import Checkout from "~/screens/common/Checkout";
import Login from "~/screens/common/Login";
import Comment from "~/screens/restaurant/Comment";
import Invoice from "~/screens/customer/Invoice";

const HomeNavigator = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="home"
                component={Home}
                options={{ headerTitle: "Trang chủ" }}
            />
            <Stack.Screen
                name="restaurant"
                component={Details}
                options={{ headerTitle: "Cửa hàng" }}
            />
            <Stack.Screen
                name="checkout"
                component={Checkout}
                options={{ headerTitle: "Thanh toán" }}
            />
            <Stack.Screen
                name="login"
                component={Login}
                options={{ headerTitle: "Đăng nhập" }}
            />
            <Stack.Screen
                name="comment"
                component={Comment}
                options={{ headerTitle: "Bình luận" }}
            />
            <Stack.Screen
                name="invoice"
                component={Invoice}
                options={{ headerTitle: "Lịch sử mua hàng" }}
            />
        </Stack.Navigator>
    );
};

export default HomeNavigator;
