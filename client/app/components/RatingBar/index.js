import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ratingService } from "~/services/rating";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RatingBar = ({ restaurant }) => {
    const [defaultValue, setDefaultValue] = useState(0);
    const [maxRating] = useState([1, 2, 3, 4, 5]);

    const starImgFilled =
        "https://res.cloudinary.com/db5yvdd9t/image/upload/v1709199720/food-delivery-app/assets/qov8ulejrb5ubn65rvkw.png";
    const starImgCorner =
        "https://res.cloudinary.com/db5yvdd9t/image/upload/v1709199720/food-delivery-app/assets/ckw70eqsn5ft1zrkhod5.png";

    const handleAddRating = async (rate) => {
        let rating = {
            rate: rate,
        };

        let accessToken = await AsyncStorage.getItem("accessToken");
        let res = await ratingService.add(accessToken, restaurant.id, rating);

        setDefaultValue(res.data.rate);
    };

    useEffect(() => {
        const loadRating = async () => {
            let accessToken = await AsyncStorage.getItem("accessToken");
            let res = await ratingService.getRating(accessToken, restaurant.id);

            setDefaultValue(res.data.rate);
        };

        loadRating();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => setDefaultValue(0)}>
            <View style={styles.bar}>
                {maxRating.map((rate) => {
                    return (
                        <TouchableOpacity
                            key={rate}
                            onPress={() => handleAddRating(rate)}
                        >
                            <Image
                                style={styles.starImg}
                                source={
                                    rate <= defaultValue
                                        ? { uri: starImgFilled }
                                        : { uri: starImgCorner }
                                }
                                //touchable[1, 2, 3, 4, 5]
                                //default value = 2
                                //rate = 1, value = 2, 1 < 2 (true)
                                //touchable: value[filled]
                                //rate = 2, value = 2, 2 = 2 (true)
                                //touchable: value[filled, filled]
                                //rate = 3, value = 3, 3 <= 2 (false)
                                //touchable: value[filled, filled, corner]
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default RatingBar;

const styles = StyleSheet.create({
    outside: {
        backgroundColor: "red",
    },
    bar: {
        flexDirection: "row",
        justifyContent: "center",
    },
    starImg: {
        width: 40,
        height: 40,
    },
});
