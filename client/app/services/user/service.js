import {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    post,
} from "~/utils/axios";

const login = async (username, password) => {
    try {
        let res = await post(ANONYMOUS_REQUEST, ENDPOINTS["login"], {
            username: username,
            password: password,
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

const register = async (form) => {
    try {
        let res = await post(ANONYMOUS_REQUEST, ENDPOINTS["register"], form, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res;
    } catch (error) {
        console.log(error);
    }
};

const details = async (accessToken) => {
    try {
        let res = await get(
            AUTH_REQUEST(accessToken),
            ENDPOINTS["current-user"]
        );

        return res;
    } catch (error) {
        console.log(error);
    }
};

const getUsers = async () => {
    try {
        let res = await get(ANONYMOUS_REQUEST, ENDPOINTS["register"], {});

        return res;
    } catch (error) {
        console.log(error);
    }
};

export { login, register, details, getUsers };
