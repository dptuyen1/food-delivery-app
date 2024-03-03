import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Image,
    ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import * as ImagePicker from "expo-image-picker";
import { userService } from "~/services/user";

const Register = ({ navigation, route }) => {
    const param = route.params;

    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        username: "",
        password: "",
        confirm: "",
        avatar: "",
        role: param === "customer" ? 3 : 2,
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [errorShow, setErrorShow] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);

    const handleChange = (val, field) => {
        setUser({
            ...user,
            [field]: val,
        });
    };

    const handleChooseImage = async () => {
        let { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Permission Denied!");
        } else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                handleChange(res.assets[0], "avatar");
            }
        }
    };

    const isValidInformation = () => {
        for (let field in user) {
            if (user[field] === "") {
                return false;
            }
        }
        return true;
    };

    const handleRegister = async () => {
        const isValid = isValidInformation();

        if (!isValid) {
            setErrorShow(true);
            setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (user.password !== user.confirm) {
            setErrorShow(true);
            setErrorMessage("Mật khẩu không khớp!");
            return;
        }

        const form = new FormData();

        for (let field in user) {
            if (field === "avatar") {
                form.append(field, {
                    uri: user[field].uri,
                    name: user[field].fileName,
                    type: user[field].mimeType,
                });
            } else if (field !== "confirm") {
                form.append(field, user[field]);
            }
        }

        setLoadingShow((currentState) => !currentState);
        let res = await userService.register(form);

        if (res.status === 201) {
            if (param === "customer") {
                setLoadingShow((currentState) => !currentState);
                navigation.navigate("login");
            } else {
                let { data } = await userService.login(
                    user.username,
                    user.password
                );
                let { access_token } = data;
                navigation.navigate("restaurant-register", access_token);
            }
        } else {
            setErrorShow(true);
            setErrorMessage("Có lỗi xảy ra, vui lòng thử lại...");
            setLoadingShow((currentState) => !currentState);
        }
    };

    return (
        <ScrollView style={[GlobalStyles.container]}>
            {errorShow && (
                <Text style={GlobalStyles.errorText}>{errorMessage}</Text>
            )}

            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Họ..."
                    value={user.last_name}
                    onChangeText={(val) => handleChange(val, "last_name")}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tên..."
                    value={user.first_name}
                    onChangeText={(val) => handleChange(val, "first_name")}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email..."
                    value={user.email}
                    onChangeText={(val) => handleChange(val, "email")}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại..."
                    value={user.phone_number}
                    onChangeText={(val) => handleChange(val, "phone_number")}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ..."
                    value={user.address}
                    onChangeText={(val) => handleChange(val, "address")}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Tài khoản..."
                    value={user.username}
                    onChangeText={(val) => handleChange(val, "username")}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu..."
                    value={user.password}
                    onChangeText={(val) => handleChange(val, "password")}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Xác nhận mật khẩu..."
                    value={user.confirm}
                    onChangeText={(val) => handleChange(val, "confirm")}
                    secureTextEntry
                />
                {loadingShow ? (
                    <></>
                ) : (
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#93E9BE",
                            borderRadius: 6,
                            padding: 10,
                        }}
                        onPress={() => handleChooseImage()}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 16,
                            }}
                        >
                            Chọn ảnh đại diện
                        </Text>
                    </TouchableOpacity>
                )}
                {user.avatar && (
                    <Image
                        source={{ uri: user.avatar.uri }}
                        width={100}
                        height={100}
                        style={{
                            alignSelf: "center",
                        }}
                    />
                )}
                {loadingShow ? (
                    <ActivityIndicator size="large" />
                ) : param === "customer" ? (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleRegister()}
                    >
                        <Text style={styles.buttonText}>Đăng ký</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleRegister()}
                    >
                        <Text style={styles.buttonText}>Bước tiếp theo</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        gap: 20,
        paddingVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#bfbfbf",
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
        textAlign: "center",
    },
});
