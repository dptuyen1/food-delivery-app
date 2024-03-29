import { useReducer } from "react";
import Context from "./Context";
import reducer from "~/contexts/user/reducer";
import { logger } from "../logger";

const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, null);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    );
};

export default Provider;
