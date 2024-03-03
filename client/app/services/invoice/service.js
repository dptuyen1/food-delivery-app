import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    patch,
    post,
} from "~/utils/axios";

const add = async (accessToken, data) => {
    try {
        let res = await post(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["invoice"],
            data
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

const pay = async (form) => {
    try {
        let res = await post(ANONYMOUS_REQUEST, ENDPOINTS["pay"], form, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

const getPendingInvoices = async (restaurantId) => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["invoice"], {
            params: {
                status_id: 1,
                restaurant_id: restaurantId,
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

const confirmInvoice = async (accessToken, id) => {
    try {
        let res = await patch(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["details-invoice"](id),
            {
                status: 2,
            }
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

const getInvoices = async (userId) => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["invoice"], {
            params: {
                user_id: userId,
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { add, pay, getPendingInvoices, confirmInvoice, getInvoices };
