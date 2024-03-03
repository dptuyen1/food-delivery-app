import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import UserNavigator from "../UserNavigator";
import { useUserContext } from "~/hooks";
import Logout from "~/screens/common/Logout";
import HomeNavigator from "../HomeNavigator";
import AdminHome from "~/screens/admin/AdminHome";
import RestaurantNavigator from "../RestaurantNavigator";
import Invoice from "~/screens/customer/Invoice";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const MainNavigator = () => {
    const Tab = createBottomTabNavigator();

    const [user] = useUserContext();

    return (
        <Tab.Navigator>
            {user && user.role === 1 ? (
                <Tab.Screen
                    name="admin-home"
                    component={AdminHome}
                    options={{
                        headerTitle: "Trang chủ",
                        tabBarLabel: "Trang chủ",
                        tabBarIcon: () => (
                            <AntDesign name="home" size={24} color="black" />
                        ),
                    }}
                />
            ) : user && user.role === 2 ? (
                <Tab.Screen
                    name="restaurant-navigator"
                    component={RestaurantNavigator}
                    options={{
                        tabBarLabel: "Trang chủ",
                        tabBarIcon: () => (
                            <AntDesign name="home" size={24} color="black" />
                        ),
                        headerShown: false,
                    }}
                />
            ) : (
                <Tab.Screen
                    name="home-navigator"
                    component={HomeNavigator}
                    options={{
                        tabBarLabel: "Trang chủ",
                        tabBarIcon: () => (
                            <AntDesign name="home" size={24} color="black" />
                        ),
                        headerShown: false,
                    }}
                />
            )}
            {user && user.role === 3 && (
                <Tab.Screen
                    name="invoice"
                    component={Invoice}
                    options={{
                        headerTitle: "Lịch sử mua hàng",
                        tabBarLabel: "Lịch sử",
                        tabBarIcon: () => (
                            <Ionicons
                                name="receipt-outline"
                                size={24}
                                color="black"
                            />
                        ),
                    }}
                />
            )}
            {user ? (
                <Tab.Screen
                    name="logout"
                    component={Logout}
                    options={{
                        headerTitle: "Đăng xuất",
                        tabBarLabel: "Đăng xuất",
                        tabBarIcon: () => (
                            <AntDesign name="login" size={24} color="black" />
                        ),
                    }}
                />
            ) : (
                <Tab.Screen
                    name="user-navigator"
                    component={UserNavigator}
                    options={{
                        tabBarLabel: "Đăng nhập",
                        tabBarIcon: () => (
                            <AntDesign name="login" size={24} color="black" />
                        ),
                        headerShown: false,
                    }}
                />
            )}
        </Tab.Navigator>
    );
};

export default MainNavigator;
