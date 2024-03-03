import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "~/navigators/MainNavigator";
import { UserProvider } from "~/contexts/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartProvider } from "~/contexts/cart";

const App = () => {
    useEffect(() => {
        const deleteOldData = async () => {
            let data = await AsyncStorage.getAllKeys();
            if (data.length > 0) {
                await AsyncStorage.multiRemove(data);
                console.log("old async storage data deleting...");
            }
        };

        deleteOldData();
    }, []);

    return (
        <UserProvider>
            <CartProvider>
                <NavigationContainer>
                    <MainNavigator />
                </NavigationContainer>
            </CartProvider>
        </UserProvider>
    );
};

export default App;
