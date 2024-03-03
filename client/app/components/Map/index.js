import { View, Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { GlobalStyles } from "~/styles/GlobalStyles";

const Map = ({ region }) => {
    return (
        <View style={GlobalStyles.container}>
            <Text
                style={{ marginVertical: 10, fontSize: 16, fontWeight: "bold" }}
            >
                Vị trí
            </Text>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsTraffic
                showsBuildings
                region={region}
            >
                <Marker title="Us" coordinate={region} />
            </MapView>
        </View>
    );
};

export default Map;
const styles = StyleSheet.create({
    map: {
        width: Dimensions.get("screen").width * 0.9,
        height: Dimensions.get("screen").height * 0.3,
        alignSelf: "center",
    },
});
