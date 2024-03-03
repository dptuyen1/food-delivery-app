import AsyncStorage from "@react-native-async-storage/async-storage";

const reducer = (currentState, action) => {
    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "UPDATE":
            return {
                ...currentState,
                restaurant: action.payload,
            };
        case "LOGOUT":
            AsyncStorage.removeItem("access-token");
            AsyncStorage.removeItem("user");
            return null;
        default:
    }
    return currentState;
};

export default reducer;
