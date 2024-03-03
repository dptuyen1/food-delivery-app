import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    post,
} from "~/utils/axios";

const add = async (accessToken, restaurantId, data) => {
    try {
        let res = await post(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["rating"](restaurantId),
            data
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

const getRating = async (accessToken, restaurantId) => {
    try {
        let res = await get(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["rating"](restaurantId)
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

const getRatingList = async (restaurantId) => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["rating-list"], {
            params: {
                restaurant_id: restaurantId,
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { add, getRating, getRatingList };
