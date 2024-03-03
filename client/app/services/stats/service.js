import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    post,
} from "~/utils/axios";

const getStats = async (id) => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["stats"](id));

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { getStats };
