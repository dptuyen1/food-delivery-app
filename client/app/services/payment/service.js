import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    post,
} from "~/utils/axios";

const getPayments = async () => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["payment"], {});

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { getPayments };
