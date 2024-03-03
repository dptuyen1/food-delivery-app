import { useContext } from "react";
import { CartContext } from "~/contexts/cart";
import { UserContext } from "~/contexts/user";

const useUserContext = () => {
    const [state, dispatch] = useContext(UserContext);

    return [state, dispatch];
};

const useCartContext = () => {
    const [state, dispatch] = useContext(CartContext);

    return [state, dispatch];
};

export { useUserContext, useCartContext };
