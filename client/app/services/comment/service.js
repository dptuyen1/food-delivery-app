import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    post,
} from "~/utils/axios";

const getComments = async (restaurantId) => {
    try {
        let res = await get(
            ANONYMOUS_REQUEST,
            ENDPOINTS["comment"](restaurantId)
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

const add = async (accessToken, restaurantId, data) => {
    try {
        let res = await post(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["comment"](restaurantId),
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

export { getComments, add };
