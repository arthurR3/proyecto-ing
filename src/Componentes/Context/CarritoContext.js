import { createContext, useEffect, useReducer, useState } from "react";
import { cartReducer, cartInitialState } from "./Reducers/Cart.js";
import ApiConnection from "../Api/ApiConfig.js";
import { useAuth } from "./AuthContext.js";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const CartContext = createContext();
function useCartReducer(){
    const [state, dispatch] = useReducer(cartReducer, cartInitialState)

    const addToCart = product => dispatch({
        type: "ADD_TO_CART",
        payload: product
    })

    const removeFromCart = product => dispatch({
        type: "REMOVE_FROM_CART",
        payload: product
    })
    const clearCart = () => dispatch({ type: "CLEAR_CART" })
    
    return { state, addToCart, removeFromCart, clearCart }
}
export function CartProvider({ children }) {
    const { state, addToCart, removeFromCart, clearCart } = useCartReducer();
    return (
        <CartContext.Provider value={{ cart: state, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}


/* const CartProvider = (props) => {
    const URLConnection = ApiConnection()
    const [cart, setCart] = useState([])
    const { token } = useAuth()
    const [decodeToken, setDecodeToken] = useState()

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setDecodeToken(decoded.user);
            fetchCartAPI(decoded.user.idUser);
        }
    }, [token])

    useEffect(()=>{
        if(decodeToken && decodeToken.idUser){
            fetchCartAPI(decodeToken.idUser)
        }
    }, [decodeToken])

    const fetchCartAPI = async (idUser) => {
        try {
            const response = await fetch(`https://api.example.com/carts/${idUser}`)
            const cartData = response.data.map((item) => ({
                id_producto: item.id,
                nombre: item.name,
                price: item.price,
                quatity: item.quantify,
                image: item.image
            }));

            if (cartData.length > 0) {
                setCart(cartData)
                localStorage.setItem('Cart', JSON.stringify(cartData))
            } else {
                setCart([])
                localStorage.removeItem('Cart')
            }
        } catch (error) {
            console.error('Error fetching Cart from Api', error);
        }
    };

    useEffect(()=>{
        localStorage.setItem('Cart', JSON.stringify(cart))
    },[cart]);

    const addToCart = async (product, quantity) =>{
        try {
            const existingProduct = cart.find((item) => item.id_producto === product.id);
            if(existingProduct){
                const newQuantity = existingProduct.quatity + quantity;
                if(newQuantity <= product.amount){
                    const updateCart = cart.map((item) =>
                        item.id_producto === product.id ? {...item, amount : newQuantity} : item
                    )
                    setCart(updateCart)
                    await updateCartItem(decodeToken.idUser, updateCart)
                }else{
                    console.log("La cantidad no esta disponible aún")
                }
            }else{
                if(quantity <= product.amount){
                    const newProduct = {...product, quantity}
                    setCart([...cart, newProduct])
                    await addToCartItem(newProduct)
                }else{
                    console.log("No se puede agregar más cantidad. La existencia máxima es alcanzada.")
                }
            }
        } catch (error) {
            console.log('Error adding item to cart', error)
        }
    }

    const addToCartItem = async (newProduct)=>{
        try {
            const product = {
                id: newProduct.id,
                price: newProduct.price,
                quatify: newProduct.quantify,
            }
            await axios.post(`${URLConnection}/updateCart/${decodeToken.idUser}`,{
                product
            })
        } catch (error) {
            console.log('Error updating item to cart', error)
        }
    }

    const updateCartItem = async (idUser, updateCart) => {
        try {
          await axios.put(`${URLConnection}/updateCart/${idUser}`, {
            updateCart
          });
        } catch (error) {
          console.error("Error updating item in cart:", error);
        }
      };

    const removeFromCart = async (productoId) => {
        try {
            const updatedCart = cart.filter((item) => item.productoId !== productoId);
            setCart(updatedCart);
            await deleteCartItem(productoId);
          } catch (error) {
            console.error("Error removing item from cart:", error);
          }
    }

    const deleteCartItem = async (productId) => {
        try {
          const cartDelete = {
            productoId: productId,
            customerId: decodeToken.customerId,
          };
          await axios.delete("https://backend-c-r-production.up.railway.app/cart/", { data: cartDelete });
        } catch (error) {
          console.error("Error removing item from cart:", error);
        }
      };
} */