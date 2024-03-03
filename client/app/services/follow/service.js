import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    post,
} from "~/utils/axios";

const add = async (accessToken, data) => {
    try {
        let res = await post(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["follow"],
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

const checkFollow = async (accessToken, restaurantId) => {
    try {
        let res = await get(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["is-follow"],
            {
                params: {
                    restaurant: restaurantId,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { add, checkFollow };
