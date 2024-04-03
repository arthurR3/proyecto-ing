import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddressScreen = ({ handleAddressSelection, onBackToCart, totalQuantity, subTotal, address, deliveryOption, setDeliveryOption }) => {
    const handleOptionChange = (e) => {
        setDeliveryOption(e.target.value);
    };

    return (
        <div className='row'>
            <div className='col-md-8 cart'>
                <div className='col-12 text-left mt-2'>
                    <i className='fa-solid fa-arrow-left'></i>
                    <Link
                        className='btn btn-link text-decoration-none text-reset'
                        onClick={onBackToCart}
                    >
                        Volver al carrito
                    </Link>
                </div>
                <div className='title'>
                    <div className='row'>
                        <div className='col'>
                            <h4><b>Elige la forma de entrega</b></h4>
                            <div className='col align-self-center text-right text-muted'></div>
                        </div>
                    </div>
                </div>
                <div className='row border-top border-bottom'>
                    <div className='row main align-items-center'>
                        <div className='col-1'>
                            <input
                                type='radio'
                                value='home'
                                checked={deliveryOption === 'home'}
                                onChange={(e) => setDeliveryOption(e.target.value)} // Actualizar la opción seleccionada
                            />
                        </div>
                        <div className='col-8'>
                            <div className='row fw-bold fs-5'>
                                <label>
                                    Enviar a mi domicilio :
                                </label>
                            </div>
                            <div className='row text-muted'>{address}</div>
                        </div>
                        <div className='col-3'>
                            <div className="col pt-4"> $ 35.00 </div>
                        </div>
                        <div className='col-1'>
                            <input
                                type='radio'
                                value='store'
                                checked={deliveryOption === 'store'}
                                onChange={(e) => setDeliveryOption(e.target.value)} // Actualizar la opción seleccionada
                            />
                        </div>
                        <div className='col-8'>
                            <div className='row fw-bold fs-5'>
                                <label>
                                    Recoger en tienda física :
                                </label>
                            </div>
                            <div className='row text-muted'>{ }</div>
                        </div>
                        <div className='col-3'>
                            <div class="col pt-4"> GRATIS </div>

                        </div>
                        <div class="col">
                            <a className='btn btn-link text-decoration-none fw-bold btn-hover'>Editar o elegir otra direccion de entrega</a>
                        </div>
                    </div>
                </div>
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
                    <select><option className='text-muted'> {deliveryOption === 'home' ? 'Envio Estandár -  $ 35.00' : ' G R A T I S '}</option></select>
                </form>
                <div className='row' style={{ borderTop: '1px solid rgba(0, 0, 0, .1)', padding: '2vh 0' }}>
                    <div className='col fw-bold'>PRECIO TOTAL</div>
                    <div className='col text-right fw-bold'>$ {subTotal.toFixed(2)}</div>
                </div>
                <button
                    className='btnPay'
                    onClick={handleAddressSelection}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}

export default AddressScreen;
