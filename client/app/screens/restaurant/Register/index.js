import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    TextInput,
} from "react-native";
import React, { useState } from "react";
import { GlobalStyles } from "~/styles/GlobalStyles";
import * as ImagePicker from "expo-image-picker";
import { restaurantService } from "~/services/restaurant";

const Register = ({ navigation, route }) => {
    const accessToken = route.params;

    const [restaurant, setRestaurant] = useState({
        name: "",
        address: "",
        logo: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [errorShow, setErrorShow] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);

    const handleChange = (val, field) => {
        setRestaurant({
            ...restaurant,
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
                handleChange(res.assets[0], "logo");
            }
        }
    };

    const isValidInformation = () => {
        for (let field in restaurant) {
            if (restaurant[field] === "") {
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

        const form = new FormData();

        for (let field in restaurant) {
            if (field === "logo") {
                form.append(field, {
                    uri: restaurant[field].uri,
                    name: restaurant[field].fileName,
                    type: restaurant[field].mimeType,
                });
            } else {
                form.append(field, restaurant[field]);
            }
        }

        setLoadingShow((currentState) => !currentState);
        let res = await restaurantService.register(accessToken, form);

        if (res.status === 201) {
            setLoadingShow((currentState) => !currentState);
            navigation.navigate("login");
        } else {
            setErrorShow(true);
            setErrorMessage("Có lỗi xảy ra, vui lòng thử lại...");
            setLoadingShow((currentState) => !currentState);
        }
    };
    return (
        <View style={[GlobalStyles.container]}>
            {errorShow && (
                <Text style={GlobalStyles.errorText}>{errorMessage}</Text>
            )}

            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Tên cửa hàng..."
                    value={restaurant.name}
                    onChangeText={(val) => handleChange(val, "name")}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Địa chỉ..."
                    value={restaurant.address}
                    onChangeText={(val) => handleChange(val, "address")}
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
                {restaurant.logo && (
                    <Image
                        source={{ uri: restaurant.logo.uri }}
                        width={100}
                        height={100}
                        style={{
                            alignSelf: "center",
                        }}
                    />
                )}
                {loadingShow ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleRegister()}
                    >
                        <Text style={styles.buttonText}>Đăng ký</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
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
