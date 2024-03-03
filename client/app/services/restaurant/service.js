import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    patch,
    post,
} from "~/utils/axios";

const register = async (accessToken, form) => {
    try {
        let res = await post(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["restaurant"],
            form,
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

const getRestaurants = async (product_name) => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["restaurant"], {
            params: {
                product_name,
                is_active: 1,
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

const getInactiveRestaurants = async () => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["restaurant"], {
            params: {
                is_active: 0,
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

const activeRestaurants = async (accessToken, id) => {
    try {
        let res = await patch(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["restaurant-details"](id),
            {
                is_active: 1,
            }
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { register, getRestaurants, getInactiveRestaurants, activeRestaurants };
