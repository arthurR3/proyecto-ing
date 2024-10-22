import { useContext } from "react";
import { CartContext } from "./Context/CarritoContext.js";

export const useCart = () =>{
    const context = useContext(CartContext)
    if(context === undefined)
        throw new Error("useCart must be defined within a CartProvider");
    return context;
}