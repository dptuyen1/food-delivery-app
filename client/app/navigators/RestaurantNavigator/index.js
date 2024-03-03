import { View, Text } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import RestaurantHome from "~/screens/restaurant/RestaurantHome";
import Category from "~/screens/restaurant/Category";
import Product from "~/screens/restaurant/Product";

const RestaurantNavigator = () => {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name="restaurant-home"
                component={RestaurantHome}
                options={{ headerTitle: "Cửa hàng", drawerLabel: "Cửa hàng" }}
            />
            <Drawer.Screen
                name="restaurant-category"
                component={Category}
                options={{ headerTitle: "Danh mục", drawerLabel: "Danh mục" }}
            />
            <Drawer.Screen
                name="restaurant-product"
                component={Product}
                options={{ headerTitle: "Sản phẩm", drawerLabel: "Sản phẩm" }}
            />
        </Drawer.Navigator>
    );
};

export default RestaurantNavigator;
