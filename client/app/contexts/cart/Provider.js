import { useReducer } from "react";
import Context from "./Context";
import reducer from "~/contexts/cart/reducer";
import { logger } from "../logger";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, 0);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    );
};

export default Provider;
