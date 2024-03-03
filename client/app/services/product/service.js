import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    post,
} from "~/utils/axios";

const getProducts = async (restaurantId, categoryId) => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["product"], {
            params: {
                restaurant_id: restaurantId,
                category_id: categoryId,
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
            ENDPOINTS["product"],
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { getProducts, add };
