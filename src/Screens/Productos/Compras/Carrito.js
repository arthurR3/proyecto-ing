import React, { useEffect, useReducer, useState } from 'react'
import '../../../CSS/cart.css'
import ApiConnection from '../../../Componentes/Api/ApiConfig'
import AddressScreen from './AddressScreen'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../../../Componentes/Context/AuthContext'
import CustomModal from '../../../Componentes/Modal'
import { useCart } from '../../../Componentes/useCart'

import { cartReducer, CART_ACTION_TYPES, cartInitialState } from '../../../Componentes/Context/Reducers/Cart'
import { updateCart } from '../../../Componentes/Api/apiCart'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const URLConnection = ApiConnection();
function CartItem({ image, price, name, categoria, quantify, addToCart, removeFromCart }) {
    const total = (price * quantify)

    return (
        <div className='row border-top border-bottom'>
            <div className='row main align-items-center'>
                <div className='col-2'>
                    <img className='img-fluid' src={image} alt='' />
                </div>
                <div className='col'>
                    <div className='row text-muted'>{name}</div>
                    <div className='row'>{categoria}</div>
                </div>
                <div class="col">
                    <a href='#' className='btn btn-link text-reset text-decoration-none fw-bold btn-hover'>-</a><a class="border text-decoration-none" href='#'>{quantify}</a><a className='btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={addToCart} href='#'>+</a>
                </div>
                <div class="col"> $ {total.toFixed(2)} <span class="close m-2 btn btn-link text-reset text-decoration-none fw-bold btn-hover" onClick={removeFromCart}>&#10005;</span></div>
            </div>
        </div>
    );
}

const Carrito = () => {
    // Obtener el usuario por el token guardado en el AuthContext 
    const { token, isAuthenticed } = useAuth();
    const data = jwtDecode(token);
    const idUser = data.user.idUser
    const [state, dispatch] = useReducer(cartReducer, cartInitialState)
    const { cart, addToCart, removeFromCart } = useCart();
    const [modalContent, setModalContent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState('cart'); // 'cart', 'address', 'confirm'
    const [deliveryOption, setDeliveryOption] = useState('home'); // Estado para almacenar la opción seleccionada

    // Obtengo las funciones de Context Carrtito
    const totalQuantity = cart.reduce((acc, product) => acc + product.quantify, 0);
    const subTotal = cart.reduce((acc, product) => acc + (product.price * product.quantify), 0);
    const shippingCost = deliveryOption === 'home' ? 35 : 0; // Costo de envío según la opción seleccionada
    const total = subTotal + shippingCost;

    const getDetailsCart = async (idUser) => {
        try {
            const response = await axios.get(`${URLConnection}/carts/${idUser}`);
            const data = response.data.data;

            // Verificar si data es un array vacío
            if (Array.isArray(data) && data.length > 0) {
                dispatch({
                    type: CART_ACTION_TYPES.SET_CART,
                    payload: data
                });
            }
        } catch (error) {
            throw new Error('Error while getting details for cart', error);
        }
    };

    useEffect(() => {
        getDetailsCart(idUser);
    })

    useEffect(() => {
        if (cart.length > 0) {
            try {
                updateCart(cart, idUser);
            } catch (error) {
                // Mostrar el mensaje de error como una alerta
                toast.warn(error.message);
            }
        }
    }, [cart]);
    const handleAddressSelection = () => {
        setStep('confirm');
        setShowModal(true);
        setModalContent('preparing');
        setTimeout(() => {
            setModalContent('user');
        }, 2000);
    };

    const pedido = {
        UserId: data.user.idUser,
        productos: cart.map(producto => ({
            id: producto.id,
            nombre: producto.name,
        })),
        direccionEnvio: data.user.direccion,
        total: total
    };

    const confirmarPedido = async (pedido) => {
        try {
            const response = await axios.post(`${URLConnection}/sales/createOrder`, pedido);
            const init_point = response.data.data.body.init_point;
            window.location.href = init_point;
            localStorage.removeItem('Cart')
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
                                    {...product}
                                />
                            ))}
                        </div>
                        <div className='col-md-4 summary'>
                            <div>
  
                                <h5><b>Finalizar Compra</b></h5>
                            </div>
                            <div className='row'>
                                <div className='col' >{totalQuantity} Productos</div>
                                <div className='col text-rigth'>$ {subTotal.toFixed(2)}</div>
                            </div>
                            <form>
                                <p>ENVÍO</p>
                                <select><option className='text-muted'>Envio Estandár -  $ 35.00</option></select>
                                {/* <p>GIVE CODE</p>
                                <input type='text' className='form-control' placeholder='Enter code' /> */}
                            </form>
                            <div className='row' style={{ borderTop: '1px solid rgba(0, 0, 0, .1)', padding: '2vh 0' }}>
                                <div className='col fw-bold'>PRECIO TOTAL</div>
                                <div className='col text-right fw-bold'>{cart.length > 0 ? '$ ' + total.toFixed(2) : '$ ' + 0.00}</div>
                            </div>

                            <button
                                className='btnPay'
                                onClick={() => {
                                    setStep('address');
                                }}
                                disabled={cart.length === 0}
                            >
                                PAGAR
                            </button>
                        </div>
                        <div>
                                <Link to='/productos' className='fw-bold p-4 text-decoration-none'> Seguir Comprando</Link>

                            </div>
                    </div>
                )}
                {/* asas */}
                {step === 'address' && (
                    <AddressScreen
                        totalQuantity={totalQuantity}
                        subTotal={subTotal}
                        total={total}
                        address={data.user.address}
                        deliveryOption={deliveryOption}
                        setDeliveryOption={setDeliveryOption}
                        handleAddressSelection={handleAddressSelection}
                        onBackToCart={() => setStep('cart')}
                    />
                )}
                {step === 'confirm' && (
                    <CustomModal
                        show={showModal}
                        centered
                        onHide={() => setStep('address')}
                        title={modalContent === 'preparing' ? 'Preparando la compra' : 'Realizar la Compra'}
                    >
                        {modalContent === 'preparing' ? (
                            <p>Por favor, espera un momento mientras preparamos tu compra...</p>
                        ) : (
                            <>
                                <div className="px-4 ">
                                    <h5 className="text-uppercase text-center fs-5">{data.user.nombre} {data.user.lastName} {data.user.lastName2} </h5>
                                    <div className='d-flex'>
                                        <label className='form-label title fw-bold'> Email :</label>
                                        <span className="theme-color">{data.user.email}</span>
                                    </div>
                                    <div className='d-flex'>
                                        <span className="theme-color"> No. Celular: {data.user.telefono} </span>
                                    </div>
                                    <h4 className="mt-2 theme-color mb-5">Thanks for your order</h4>
                                    <div className="mb-3">
                                        <hr className="new1"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="font-weight-bold">Productos ({totalQuantity}) : </span>
                                        <span className="text-muted">$ {subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <small>{deliveryOption === 'home' ? 'Envio a domicilio :' : 'Recoger en tienda física :'}</small>
                                        <small>{deliveryOption === 'home' ? '$ 35.00' : 'GRATIS'}</small>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <small>IVA : </small>
                                        <small>00%</small>
                                    </div>
                                    <div className="mb-3">
                                        <hr className="new1"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between mt-3">
                                        <span className="font-weight-bold">Total</span>
                                        <span className="font-weight-bold theme-color">$ {total.toFixed(2)}</span>
                                    </div>
                                    <div className="text-center mt-5">
                                        <button className="btn btn-primary" onClick={() => confirmarPedido(pedido)}>Confirmar pedido</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CustomModal>
                )}

            </div>
        </div>
    )

}

export default Carrito