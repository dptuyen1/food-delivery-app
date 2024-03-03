const reducer = (currentState, action) => {
    switch (action.type) {
        case "INCREASE":
            return currentState + action.payload;
        case "DECREASE":
            return currentState - action.payload;
        case "UPDATE":
            return action.payload;
        default:
    }
    return currentState;
};

export default reducer;
