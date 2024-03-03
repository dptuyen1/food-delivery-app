import {
    ActivityIndicator,
    Button,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    Touchable,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import React, { useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import { useUserContext } from "~/hooks";
import { userService } from "~/services/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
    const [, dispatch] = useUserContext();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorShow, setErrorShow] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);

    const handleLogin = async () => {
        setLoadingShow((currentState) => !currentState);
        let res = await userService.login(username, password);

        if (res?.status === 200) {
            let accessToken = res.data.access_token;
            await AsyncStorage.setItem("accessToken", accessToken);

            let { data } = await userService.details(accessToken);
            await AsyncStorage.setItem("user", JSON.stringify(data));

            dispatch({
                type: "LOGIN",
                payload: data,
            });

            setLoadingShow((currentState) => !currentState);

            navigation.navigate("home");
        } else {
            setErrorShow((currentState) => !currentState);
            setLoadingShow((currentState) => !currentState);
        }
    };

    return (
        <View style={[GlobalStyles.container, styles.container]}>
            {errorShow && (
                <Text style={GlobalStyles.errorText}>
                    Tài khoản hoặc mật khẩu không đúng!
                </Text>
            )}

            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Tài khoản</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={(val) => setUsername(val)}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Mật khẩu</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(val) => setPassword(val)}
                    secureTextEntry
                />
            </View>

            {loadingShow ? (
                <ActivityIndicator size="large" />
            ) : (
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleLogin()}
                    >
                        <Text style={styles.buttonText}>Đăng nhập</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.registerButton]}
                            onPress={() =>
                                navigation.navigate(
                                    "customer-register",
                                    "customer"
                                )
                            }
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    styles.registerButtonText,
                                ]}
                            >
                                Chưa có tài khoản? Đăng ký
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                navigation.navigate(
                                    "customer-register",
                                    "restaurant"
                                )
                            }
                        >
                            <Text style={styles.buttonText}>
                                Hợp tác với chúng tôi? Đăng ký cửa hàng
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 20,
    },
    inputTitle: {
        fontSize: 16,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#bfbfbf",
        padding: 10,
        fontSize: 16,
    },
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
    buttonContainer: {
        gap: 16,
        marginVertical: 20,
    },
    registerButton: {
        borderWidth: 1,
        borderColor: "#bfbfbf",
        backgroundColor: "transparent",
        alignSelf: "flex-end",
    },
    registerButtonText: {
        color: "blue",
        fontWeight: "500",
    },
});
