import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { useUserContext } from "~/hooks";

const Logout = () => {
    const [, dispatch] = useUserContext();

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
    };

    return (
        <View style={GlobalStyles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => handleLogout()}
            >
                <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Logout;

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: "coral",
        borderRadius: 6,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
