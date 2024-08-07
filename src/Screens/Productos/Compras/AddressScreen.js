import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddressScreen = ({ handleAddressSelection, onBackToCart, totalQuantity, subTotal, address, deliveryOption, setDeliveryOption }) => {
    const [selectionMade, setSelectionMade] = useState(false);

    const handleOptionChange = (e) => {
        setDeliveryOption(e.target.value);
        setSelectionMade(true);
    };

    return (
        <div className='row'>
            <div className='col-md-8 cart'>
                <div className='col-12 text-left mt-2'>
                    <i className='fa-solid fa-arrow-left' />
                    <button className='btn btn-link text-reset text-decoration-none fw-bold btn-hover' onClick={onBackToCart}>Volver al carrito</button>
                </div>
                <div className='title'>
                    <div className='row'>
                        <div className='col'>
                            <h4><b>Detalles de Envío</b></h4>
                        </div>
                    </div>
                </div>
                <div className='row border-top border-bottom'>
                    <div className='row main align-items-center'>
                        <div className='col-10'>
                        <span>Dirección: {address ? `${address.cologne}, ${address.street}, ${address.municipality}, ${address.cp}` : 'Dirección no agregada'}</span>
                        </div>
                        <div className='col-2'>
                            <Link to='/profile' className='btn btn-link text-reset text-decoration-none fw-bold btn-hover'>Actualizar Dirección</Link>
                        </div>
                    </div>
                </div>
                {!selectionMade ? (
                    <div className='row border-top border-bottom'>
                        <div className='row main align-items-center'>
                            <div className='col-12'>
                                <form>
                                    {address && (
                                        <div className='form-check'>
                                            <input
                                                type='radio'
                                                id='home'
                                                className='form-check-input'
                                                name='deliveryOption'
                                                value='home'
                                                checked={deliveryOption === 'home'}
                                                onChange={handleOptionChange}
                                            />
                                            <label htmlFor='home' className='form-check-label'>
                                                Envío Estándar - $35.00
                                            </label>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='row border-top border-bottom'>
                        <div className='row main align-items-center'>
                            <div className='col-12'>
                                <form>
                                    <p>ENVÍO</p>
                                    <select value={deliveryOption} onChange={(e) => setDeliveryOption(e.target.value)} disabled>
                                        <option value='home' disabled={!address}>Envio Estandár - $ 35.00</option>
                                        <option value='store'>Recoger en tienda física - GRATIS</option>
                                    </select>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className='col-md-4 summary'>
                <div>
                    <h5><b>Finalizar Compra</b></h5>
                </div>
                <div className='row'>
                    <div className='col'>{totalQuantity} Productos</div>
                    <div className='col text-right'>$ {subTotal.toFixed(2)}</div>
                </div>
                <div className='row' style={{ borderTop: '1px solid rgba(0, 0, 0, .1)', padding: '2vh 0' }}>
                    <div className='col fw-bold'>PRECIO TOTAL</div>
                    <div className='col text-right fw-bold'>$ {(subTotal + (deliveryOption === 'home' ? 35 : 0)).toFixed(2)}</div>
                </div>
                <button className='btnPay' onClick={handleAddressSelection}>Confirmar</button>
            </div>
        </div>
    );
};

export default AddressScreen;
