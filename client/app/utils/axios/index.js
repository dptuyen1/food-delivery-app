import axios from "axios";

const SERVER_URL = "http://10.0.2.2:8000";

const ENDPOINTS = {
    login: `/o/token/`,
    register: `/users/`,
    "current-user": `/users/current-user/`,
    restaurant: `/restaurants/`,
    "restaurant-details": (id) => `/restaurants/${id}/`,
    category: `/categories/`,
    product: `/products/`,
    payment: `/payments/`,
    invoice: `/invoices/`,
    "details-invoice": (id) => `/invoices/${id}/`,
    details: `/details/`,
    pay: `/pay/`,
    comment: (restaurantId) => `/restaurants/${restaurantId}/comments/`,
    rating: (restaurantId) => `/restaurants/${restaurantId}/rating/`,
    "rating-list": `/rating/`,
    follow: `/follows/`,
    "is-follow": `/users/is-follow/`,
    stats: (id) => `/restaurant-stats/${id}`,
};

const createInstance = (baseURL, headers = {}) => {
    return axios.create({
        baseURL: baseURL,
        headers: headers,
    });
};

const ANONYMOUS_REQUEST = createInstance(SERVER_URL);

const AUTH_REQUEST = (accessToken) => {
    const headers = {
        Authorization: `bearer ${accessToken}`,
    };

    return createInstance(SERVER_URL, headers);
};

const get = (instance, url, config = {}) => {
    return instance.get(url, config);
};

const post = (instance, url, data = {}, config = {}) => {
    return instance.post(url, data, config);
};

const put = (instance, url, data = {}, config = {}) => {
    return instance.put(url, data, config);
};

const patch = (instance, url, data = {}, config = {}) => {
    return instance.patch(url, data, config);
};

const destroy = (instance, url, config = {}) => {
    return instance.delete(url, config);
};

export {
    ANONYMOUS_REQUEST,
    AUTH_REQUEST,
    ENDPOINTS,
    get,
    patch,
    post,
    put,
    destroy,
};
