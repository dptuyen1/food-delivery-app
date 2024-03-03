import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    post,
} from "~/utils/axios";

const getCategories = async (restaurantId) => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["category"], {
            params: {
                restaurant_id: restaurantId,
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

const add = async (accessToken, data) => {
    try {
        let res = await post(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["category"],
            data
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { getCategories, add };
