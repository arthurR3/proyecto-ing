import React, { useEffect, useReducer, useState } from 'react';
import '../../../CSS/cart.css';
import ApiConnection from '../../../Componentes/Api/ApiConfig';
import AddressScreen from './AddressScreen';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useAuth } from '../../../Componentes/Context/AuthContext';
import { useCart } from '../../../Componentes/useCart';
import { cartReducer, CART_ACTION_TYPES, cartInitialState } from '../../../Componentes/Context/Reducers/Cart';
import { updateCart } from '../../../Componentes/Api/apiCart';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const URLConnection = ApiConnection();

function CartItem({ image, price, name, categoria, quantify, addToCart, removeFromCart }) {
    const total = (price * quantify).toFixed(2);

    return (
        <div className='row border-top border-bottom'>
            <div className='row main align-items-center'>
                <div className='col-2'>
                    <img className='img-fluid' src={image} alt={name} />
                </div>
                <div className='col'>
                    <div className='row text-muted'>{name}</div>
                    <div className='row'>{categoria}</div>
                </div>
                <div className='col'>
                    <button className='btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={removeFromCart}>-</button>
                    <span className='border text-decoration-none'>{quantify}</span>
                    <button className='btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={addToCart}>+</button>
                </div>
                <div className='col'>
                    $ {total} 
                    <button className='close m-2 btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={removeFromCart}>&#10005;</button>
                </div>
            </div>
        </div>
    );
}

const Carrito = () => {
    const { token } = useAuth();
    const data = jwtDecode(token);
    const idUser = data.user.idUser;
    const [state, dispatch] = useReducer(cartReducer, cartInitialState);
    const { cart, addToCart, removeFromCart } = useCart();
    const [step, setStep] = useState('cart');
    const [deliveryOption, setDeliveryOption] = useState('store');
    const [userAddress, setUserAddress] = useState(null);
    const totalQuantity = cart.reduce((acc, product) => acc + product.quantify, 0);
    const subTotal = cart.reduce((acc, product) => acc + (product.price * product.quantify), 0);
    const shippingCost = deliveryOption === 'home' ? 35 : 0;
    const total = subTotal + shippingCost;

    const getDetailsCart = async () => {
        try {
            const response = await axios.get(`${URLConnection}/carts/${idUser}`);
            const data = response.data.data;

            if (Array.isArray(data) && data.length > 0) {
                dispatch({
                    type: CART_ACTION_TYPES.SET_CART,
                    payload: data,
                });
            }
        } catch (error) {
            throw new Error('Error while getting details for cart', error);
        }
    };

    const getUserAddress = async () => {
        try {
            const response = await axios.get(`${URLConnection}/address/${idUser}`);
            const addressData = response.data;
            //console.log(response.data)
            if (addressData) {
                setUserAddress(addressData);
                setDeliveryOption('home');
            } else {
                setUserAddress(null);
                setDeliveryOption('store');
            }
        } catch (error) {
            console.error('Error fetching user address:', error);
            setUserAddress(null);
            setDeliveryOption('store');
        }
    };

    useEffect(() => {
        getDetailsCart();
        getUserAddress();
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            try {
                updateCart(cart, idUser);
            } catch (error) {
                toast.warn(error.message);
            }
        }
    }, [cart, idUser]);

    const pedido = {
        UserId: idUser,
        productos: cart.map(producto => ({
            id: producto.id,
            nombre: producto.name,
            quantity: producto.quantify,
            unit_amount:Math.round(producto.price * 100), 

        })),
        direccionEnvio: userAddress,
        total: total,
    };

    const confirmarPedido = async () => {
        try {
            const response = await axios.post(`${URLConnection}/sales/createOrder`, pedido);
            const init_point = response.data.url;
            window.location.href = init_point;
        } catch (error) {
            console.error('Error al confirmar pedido:', error);
        }
    };

    return (
        <div className='shopping-cart dark py-5 mt-5'>
            <div className='card'>
                {step === 'cart' && (
                    <div className='row'>
                        <div className='col-md-8 cart'>
                            <div className='title'>
                                <div className='row'>
                                    <div className='col'>
                                        <h4><b>Mi Carrito de compras</b></h4>
                                        <div className='col align-self-center text-right text-muted'></div>
                                    </div>
                                </div>
                            </div>
                            {cart.length === 0 && (
                                <div className='row'>
                                    <div className='row border-top border-center'>
                                        <div className='row main align-items-center'>
                                            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                                                <h5 className='dark-text'>Tu carrito está vacío<br />Agrega productos para poder realizar la compra!</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {cart.map(product => (
                                <CartItem
                                    key={product.id}
                                    image={product.image}
                                    price={product.price}
                                    name={product.name}
                                    categoria={product.categoria}
                                    quantify={product.quantify}
                                    addToCart={() => addToCart(product)}
                                    removeFromCart={() => removeFromCart(product)}
                                    discount={product.promotion ? product.promotion.discount : 0} // Pasar el descuento
                                />
                            ))}
                        </div>
                        <div className='col-md-4 summary'>
                            <div>
                                <h5><b>Finalizar Compra</b></h5>
                            </div>
                            <div className='row'>
                                <div className='col'>{totalQuantity} Productos</div>
                                <div className='col text-right'>$ {subTotal.toFixed(2)}</div>
                            </div>
                            <form>
                                <p>ENVÍO</p>
                                <select value={deliveryOption} onChange={(e) => setDeliveryOption(e.target.value)}>
                                    <option value='home' disabled={!userAddress}>Envio Estandár - $ 35.00</option>
                                </select>
                            </form>
                            <div className='row' style={{ borderTop: '1px solid rgba(0, 0, 0, .1)', padding: '2vh 0' }}>
                                <div className='col fw-bold'>PRECIO TOTAL</div>
                                <div className='col text-right fw-bold'>{cart.length > 0 ? '$ ' + total.toFixed(2) : '$ 0.00'}</div>
                            </div>
                            <button
                                className='btnPay'
                                onClick={() => setStep('address')}
                                disabled={cart.length === 0}
                            >
                                PAGAR
                            </button>
                        </div>
                        <div>
                            <Link to='/productos' className='fw-bold p-4 text-decoration-none'>Seguir Comprando</Link>
                        </div>
                    </div>
                )}
                {step === 'address' && (
                    <AddressScreen
                        totalQuantity={totalQuantity}
                        subTotal={subTotal}
                        total={total}
                        address={userAddress}
                        deliveryOption={deliveryOption}
                        setDeliveryOption={setDeliveryOption}
                        handleAddressSelection={() => confirmarPedido()}
                        onBackToCart={() => setStep('cart')}
                    />
                )}
            </div>
        </div>
    );
};

export default Carrito;
