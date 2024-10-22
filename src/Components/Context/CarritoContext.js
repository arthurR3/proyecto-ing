import React, { createContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { jwtDecode } from 'jwt-decode'
import ApiConnection from '../Api/ApiConfig'
import axios from 'axios'
const URLConnection = ApiConnection()
export const CartContext = createContext()

const CarritoContext = (props) => {
    const [cart, setCart] = useState([])
    const {token } = useAuth()
    const [decodeToken, setDecodeToken] = useState(null)
    useEffect(() =>{
        if(token){
            const decoded = jwtDecode(token)
            setDecodeToken(decoded.user);
            updateCartAPi(decoded.idUser)
        }
    }, [token])

    useEffect(()=>{
        if(decodeToken && decodeToken.idUser){
            updateCartAPi(decodeToken.idUser)
        }
    }, [decodeToken])

    const updateCartAPi = async (idUser) =>{
        try {
            const response = await axios.get(`${URLConnection}/carts/${idUser}`);
            const data = response.data.data;
            const cartData = data.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                description: item.description,
                quantity: item.quantity,
                amount : item.amout,
                image: item.image,
                total: item.quantity * item.price,
            }));
            if(cartData.length > 0){
                setCart(cartData);
                localStorage.setItem('Cart', JSON.stringify(cartData));
            }else{
                setCart([]);
                localStorage.removeItem('Cart');
            }
        } catch (error) {
            console.log('Error fetching Cart', error);
        }
    }

    useEffect(()=>{
        localStorage.setItem('Cart', JSON.stringify(cart))
    },[cart])

    const addToCart = async (product, quantity)=>{
        try {
            const existingProduct = cart.find((item) => product.id === item.id)
            if(existingProduct){
                const newQuantity = existingProduct.quantity + quantity
                if(newQuantity <= product.amount){
                    const updateCart = cart.map((item) => 
                    item.id === product.id? {...item, quantity : newQuantity} : item)
                    setCart(updateCart)
                    await updateToCart(product.id, decodeToken.idUser, newQuantity)
                }else{
                    console.log('No se puede agregar más productos al carrito')
                }
            }else{
                if(quantity<= product.amount){
                     const newProduct = {...product, quantity: quantity}
                     const newCart = [...cart, newProduct]
                     setCart(newCart)
                     await addCartProduct(newProduct)
                }else{
                    console.log('No se puede agregar más productos al carrito')
                }
            }
        } catch (error) {
            console.log('Error adding product to cart: ' + error)
        }
    }

    const addCartProduct = async (newProduct) =>{
        try {
            const newCartItem = {
                id_user: decodeToken.idUser,
                id: newProduct.id,
                name: newProduct.name,
                price: newProduct.price,
                description: newProduct.description,
                quantity: newProduct.quantity,
                amount : newProduct.amount,
                image: newProduct.image,
                total: newProduct.quantity * newProduct.price,
            }
            await axios.post(`${URLConnection}/carts/add/`,newCartItem)
        } catch (error) {
            console.log("Error adding item to Cart", error)
        }
    }

    const updateToCart = async (product, idUser, quantity)=>{
        try {
           await axios.put(`${URLConnection}/carts/${idUser}/${product}`,{
            quantity
           }) 
        } catch (error) {
         console.log('Error updating product in cart', error)   
        }
    }

    const removeCart = async(productId) =>{
        try {
            const updatedCart = cart.filter((item) => item.id !== productId)
            setCart(updatedCart)
            await deleteCart(productId)
        } catch (error) {
            console.log('Error deleting product in cart', error)
        }
    }

    const deleteCart  = async (productId) =>{
        try {
            const cartDelete = {
                productId: productId,
                id_user : decodeToken.idUser
            }
            await axios.delete(`${URLConnection}/carts/removeProduct`,{data:cartDelete})
        } catch (error) {
            console.log('Error deleting item from cart' , error)   
        }
    }

    const clearCart = async () =>{
        try {
            await axios.delete(`${URLConnection}/carts/${decodeToken.idUser}`)
            setCart([])
        } catch (error) {
            console.log('Error clearing cart: ' + error)   
        }
    }

  return (
    <CartContext.Provider value={{cart, addToCart, removeCart, clearCart}}>
        {props.children}
    </CartContext.Provider>
  )

}

export default CarritoContext