import axios from "axios";

const TOMTOM_API_KEY = "gR4ve3Rlp4f8mGrliwNnegrb7I2WYGRy";

const getRegion = async (address) => {
    try {
        address = encodeURIComponent(address);
        const URL = `https://api.tomtom.com/search/2/geocode/{${address}}.json`;

        let res = await axios.get(URL, {
            params: {
                key: TOMTOM_API_KEY,
                limit: 1,
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

const getDistance = async (from, to) => {
    try {
        let f = {
            latFrom: from.lat,
            lonFrom: from.lon,
        };
        let t = {
            latTo: to.lat,
            lonTo: to.lon,
        };

        const { latFrom, lonFrom } = f;
        const { latTo, lonTo } = t;

        const URL = `https://api.tomtom.com/routing/1/calculateRoute/${latFrom},${lonFrom}:${latTo},${lonTo}/json`;

        let res = await axios.get(URL, {
            params: {
                key: TOMTOM_API_KEY,
                travelMode: "motorcycle",
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { getRegion, getDistance };
