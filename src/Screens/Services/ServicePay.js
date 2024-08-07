import React, { useState, useEffect } from 'react';
import imgMercado from '../../Image/mercadopago.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { useAuth } from '../../Componentes/Context/AuthContext';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const URLConnection = ApiConnection();

// Función para formatear la fecha
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return `${day} de ${months[month]} del ${year}`;
};

function ServicesPay({ onBack, data }) {
    const navigation = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [codigo, setCodigo] = useState('');
    const [paymentOption, setPaymentOption] = useState('payNow');
    const [loading, setLoading] = useState(false);
    const fecha = formatDate(data.selectedDate);
    const hora = data.selectedTime.split('-')[0];
    const service = data.preSelectedService.name;
    const price = data.preSelectedService.price;
    const totalExtrasPrice = data.selectedServices.reduce((total, service) => total + service.price, 0);
    const totalEnd = totalExtrasPrice + price;
    const auth = useAuth();
    let idUser;
    const [formValue, setFormValue] = useState({
        nombre: '',
        apellido: '',
        apellidoMat: '',
        email: '',
        telefono: ''
    });
    const [error, setError] = useState({});

    useEffect(() => {
        if (auth && auth.token) {
            const usuario = jwtDecode( auth.token);
            idUser = usuario.user.idUser;

            // Obtener información del usuario
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`${URLConnection}/users/${idUser}`);
                    const userData = response.data;
                    setFormValue({
                        nombre: userData.name,
                        apellido: userData.last_name1,
                        apellidoMat: userData.last_name2,
                        email: userData.email,
                        telefono: userData.phone,
                    });
                } catch (error) {
                    console.error('Error al obtener la información del usuario:', error);
                }
            };
            fetchUserData();
        }
    }, [auth]);

    const handleChange = e => {
        const { id, value } = e.target;
        setFormValue({ ...formValue, [id]: value });
    };

    const validationsRules = {
        nombre: {
            required: true,
            minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
            },
            maxLength: {
                value: 50,
                message: 'El nombre no debe superar los 50 caracteres'
            }
        },
        apellido: {
            required: true,
            minLength: {
                value: 2,
                message: 'El apellido debe tener al menos 2 caracteres'
            },
            maxLength: {
                value: 50,
                message: 'El apellido no debe superar los 50 caracteres'
            }
        },
        apellidoMat: {
            required: true,
            minLength: {
                value: 2,
                message: 'El apellido debe tener al menos 2 caracteres'
            },
            maxLength: {
                value: 50,
                message: 'El apellido no debe superar los 50 caracteres'
            }
        },
        telefono: {
            required: true,
            pattern: {
                value: /^\d{10}$/,
                message: 'El teléfono debe tener 10 dígitos'
            }
        }
    };

    const validate = () => {
        const error = {};

        Object.keys(validationsRules).forEach(field => {
            const value = formValue[field];
            const rules = validationsRules[field];

            if (rules.required && !value.trim()) {
                error[field] = 'Campo requerido';
                return;
            }
            if (rules.minLength && value.length < rules.minLength.value) {
                error[field] = rules.minLength.message;
                return;
            }

            if (rules.maxLength && value.length > rules.maxLength.value) {
                error[field] = rules.maxLength.message;
                return;
            }

            if (rules.pattern && !rules.pattern.value.test(value)) {
                error[field] = rules.pattern.message;
            }
        });

        return error;
    };

    const handleSumbit = (e) => {
        e.preventDefault();
        const validationError = validate();
        if (Object.keys(validationError).length === 0) {
            axios.post(`${URLConnection}/users/confirmation-email`, {
                email: formValue.email
            })
                .then(response => {
                    if (response.data.success) {
                        toast.success(response.data.message, {
                            position: 'top-right',
                            className: 'mt-5'
                        });
                        setShowModal(true);
                    } else {
                        const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                        toast.error('Ingreso fallido. ' + errorMessage, {
                            position: 'top-center',
                            className: 'mt-5'
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Error al enviar el correo:', error);
                });

        } else {
            setError(validationError);
        }
    };

    const RealizarPago = async () => {
        setLoading(true);
        const info = {
            customer: {
                nombre: formValue.nombre,
                apellido: formValue.apellido,
                apellidoMat: formValue.apellidoMat,
                email: formValue.email,
                telefono: formValue.telefono,
            },
            data: {
                time: data.selectedTime,
                date: data.selectedDate,
                service: [data.preSelectedService, ...data.selectedServices],
            },
            total: totalEnd,
        };
        try {
            if(paymentOption === 'payNow'){
            const response = await axios.post(`${URLConnection}/dates/createAppointment`, info);
            const init_point = response.data.data.body.init_point;
            window.location.href = init_point;
            setLoading(false);
            } else {
            const response = await axios.post(`${URLConnection}/dates/create-sinpay`, info);
                if(response.status){
                    setLoading(false);
                    toast.success('La cita se ha realizado con éxito. Revise la bandeja de su correo para mayor información.!');
                    navigation('/servicios')
                }else{
                    setLoading(false);
                    toast.error('La reservación no pudo completarse, intente de nuevo!')
                }
            }
        } catch (error) {
            setLoading(false);
            throw new Error('Error al procesar el pago', error);
        }
    };

    const handleVerification = async () => {

        try {
            const response = await axios.post(`${URLConnection}/users/verification-password`, {
                email: formValue.email,
                resetCode: parseInt(codigo)
            });

            if (response.data.success) {
                toast.success('Código de verificación correcto');
                setShowModal(false);
                await RealizarPago();
            } else {
                toast.warn('Código de verificación incorrecto. Revise su correo!');
            }
        } catch (error) {
            console.error('Error al verificar el código:', error);
            toast.warn('Error al verificar el código. Revise su correo!');
        }
    };

    return (
        <div className='container mt-4 mb-4'>
            <div className='row d-flex cart align-items-center justify-content-center'>
                <div className='col-md-12'>
                    <div className='card'>
                        <div className='col-12 text-left mt-2'>
                            <i className='fa-solid fa-arrow-left'></i>
                            <Link
                                className='btn btn-link text-decoration-none text-reset'
                                onClick={onBack}
                            >
                                Regresar
                            </Link>
                        </div>
                        <div className='d-flex justify-content-center border-bottom title'>
                            <div className='p-3 w-100'>
                                <div className='row'>
                                    <div className='col-md-4 d-flex justify-content-center align-items-center'>
                                        <span>Fecha : {fecha}</span>
                                    </div>
                                    <div className='col-md-4 d-flex justify-content-center align-items-center'>
                                        <span>Hora: {hora}</span>
                                    </div>
                                    <div className='col-md-4 d-flex justify-content-center align-items-center'>
                                        <span>Servicio: {service}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row g-0'>
                            <div className='col-md-6 border-right p-5'>
                                <span className='mb-2 fw-bold mt-2'>Informacion Personal</span>
                                <form onSubmit={handleSumbit}>
                                    <div className=''>
                                        <span htmlFor='nombre' className='form-label'>Nombre :</span>
                                        <input type='text' className='form-control' id='nombre' value={formValue.nombre} onChange={handleChange} />
                                        {error.nombre && <span className='text-danger'>{error.nombre}</span>}

                                        <span htmlFor='apellido' className='form-label'>Apellido Paterno :</span>
                                        <input type='text' className='form-control' id='apellido' value={formValue.apellido} onChange={handleChange} />
                                        {error.apellido && <span className='text-danger'>{error.apellido}</span>}

                                        <span htmlFor='apellidoMat' className='form-label'>Apellido Materno :</span>
                                        <input type='text' className='form-control' id='apellidoMat' value={formValue.apellidoMat} onChange={handleChange} />
                                        {error.apellidoMat && <span className='text-danger'>{error.apellidoMat}</span>}

                                        <span htmlFor='telefono' className='form-label'>Télefono :</span>
                                        <input type='text' className='form-control' id='telefono' value={formValue.telefono} onChange={handleChange} />
                                        {error.telefono && <span className='text-danger'>{error.telefono}</span>}

                                        <span htmlFor='email' className='form-label'>Email :</span>
                                        <input type='text' className='form-control' id='email' value={formValue.email} onChange={handleChange} />
                                        {error.email && <span className='text-danger'>{error.email}</span>}
                                    </div>
                                </form>
                            </div>
                            <div className='col-md-6 background-muted '>
                                <div className='p-3 border-bottom'>
                                    <div className='d-flex justify-content-end align-items'>
                                        <span><i className='fa-brands fa-cc-visa fs-3'></i> <i className='fa-brands fa-cc-mastercard fs-3'></i> Pago por Mercado Pago</span>
                                    </div>
                                    <div className='mt-4'>
                                        <h6 className='mb-0 fw-bold'>Resumen de Pago</h6>
                                    </div>
                                </div>
                                <div className='row g-0'>
                                    <div className='col-md-6 border-right'>
                                        <div className='p-3 d-flex justify-content-center align-items-center'><span>{service} :</span></div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='p-3 d-flex justify-content-center align-items-center'><span>${price.toFixed(2)}</span></div>
                                    </div>
                                </div>
                                {/* Mostrar servicios extra */}
                                <div className='row g-0 border-bottom'>
                                    <div className='col-md-6 border-right'>
                                        <div className='d-flex justify-content-center align-items-center'><span>Servicio extra :</span></div>
                                        <div className='d-flex justify-content-center align-items-center flex-column'>
                                            {data.selectedServices.map((extraService, index) => (
                                                <span key={index} className='text-sm text-muted'>{extraService.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='d-flex justify-content-center align-items-center flex-column'>
                                            <span className='p-2'>${totalExtrasPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* TOTAL, SUBTOTAL, IVA, RESTANTE */}
                                <div className='row g-0 border-bottom'>
                                    <div className='col-md-6 border-right'>
                                        <div className='p-3 d-flex justify-content-center align-items-center'><span>Descuento :</span></div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='p-3 d-flex justify-content-center align-items-center'><input className='form-control' placeholder='Ingresa tu código' /></div>
                                    </div>
                                </div>
                                <div className='row g-0 border-bottom'>
                                    <div className='col-md-6 border-right'>
                                        <div className='p-3 d-flex justify-content-center align-items-center'><span>IVA 16% (incluido) :</span></div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='p-3 d-flex justify-content-center align-items-center'><span>${(totalEnd * 0.16).toFixed(2)}</span></div>
                                    </div>
                                </div>
                                <div className='row g-0 border-bottom'>
                                    <div className='col-md-6 border-right'>
                                        <div className='p-3 d-flex justify-content-center align-items-center fw-bold'><span>Total :</span></div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='p-3 d-flex justify-content-center align-items-center'><span>${totalEnd.toFixed(2)}</span></div>
                                    </div>
                                </div>
                                <div className='row g-0 border-bottom fw-bold'>
                                    <div className='col-md-6 border-right'>
                                        <div className='p-3 d-flex justify-content-center align-items-center fw-bold'><span>Pago Requerido :</span></div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='p-3 d-flex justify-content-center align-items-center'><span>${(totalEnd / 2).toFixed(2)}</span></div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <label className='form-control-label fw-bold'>Método de Pago</label>
                                        <div className='form-check'>
                                            <input
                                                className='form-check-input'
                                                type='radio'
                                                name='paymentOption'
                                                id='payNow'
                                                value='payNow'
                                                checked={paymentOption === 'payNow'}
                                                onChange={(e) => setPaymentOption(e.target.value)}

                                            />
                                            <label className='form-check-label' htmlFor='payNow'>
                                                Pagar ahora
                                            </label>
                                        </div>
                                        <div className='form-check'>
                                            <input
                                                className='form-check-input'
                                                type='radio'
                                                name='paymentOption'
                                                id='payLater'
                                                value='payLater'
                                                checked={paymentOption === 'payLater'}
                                                onChange={(e) => setPaymentOption(e.target.value)}
                                            />
                                            <label className='form-check-label' htmlFor='payLater'>
                                                Pagar al recibir el servicio
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button
                                        type='submit'
                                        className={`btn mt-2 text-white bg-success ${loading ? 'loading' : ''}`}
                                        disabled={loading}
                                        onClick={RealizarPago}
                                        style={{ position: 'relative', overflow: 'hidden' }}
                                    >
                                        {loading ? (
                                            <div className="progress-container">
                                            <i className="fa-solid fa-spinner"></i>  Agendando...
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
                                          </div>
                                        ) : (
                                            <>
                                                <i className="fa-regular fa-circle-check me-3"></i>
                                                Confirmar Cita
                                            </>
                                        )}
                                    </button>
                                {/* <div className='d-flex justify-content-center align-items-center'>
                                <button type='submit' onClick={RealizarPago} className='btn mt-2 text-white bg-primary'>
                                    <img src={imgMercado} className='text-white' alt='Mercado Pago' />
                                    Pagar con Mercado Pago
                                </button>
                            </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal para ingresar el código de verificación */}
                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    dialogClassName="modal-90w" // Ajusta el ancho del modal si es necesario
                    aria-labelledby="example-custom-modal-styling-title"
                    centered // Centra el modal verticalmente
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Verificar Código
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='auth-box card'>
                            <div className='card-block'>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <h3 className='text-center'>
                                            <i className='fa fa-lock text-primary f-80'></i>
                                        </h3>
                                    </div>
                                </div>
                                <div className='form-group form-primary'>
                                    <input
                                        type='text'
                                        id='verificationCode'
                                        className='form-control text-center'
                                        placeholder='Enter passcode'
                                        value={codigo}
                                        onChange={e => setCodigo(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <Button
                                            type='button'
                                            className='btn btn-primary btn-md btn-block waves-effect text-center m-b-20'
                                            onClick={handleVerification}
                                        >
                                            <i className='fa fa-lock'></i> Verify Code
                                        </Button>
                                    </div>
                                </div>
                                <p className='text-inverse text-center'>
                                    Back to <a href="#" data-abc="true">Login</a>
                                </p>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setShowModal(false)}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >
    );
}

export default ServicesPay;
