// 1. React imports
import React, { useState, useEffect, useRef } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import axios from 'axios';

import { emailRegexp } from '../../hooks/useLoginForm.js';
import ApiConnetion from '../../Components/Api/ApiConfig.js';
import ConfirmateEmail from './ConfirmateEmail.js';
import { useAuth } from '../../Components/Context/AuthContext.js';
import { jwtDecode } from 'jwt-decode';

const URLConnetion = ApiConnetion()
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
    const toast = useRef(null)
    const {token} = useAuth()
    const [userToken, setUserToken] = useState([])
    const [loading, setLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [paymentOption, setPaymentOption] = useState('full'); 
    const fecha = formatDate(data.selectedDate);
    const hora = data.selectedTime.split('-')[0];
    const service = data.preSelectedService.name;
    const price = data.preSelectedService.price;
    const descuento = 0;
    const totalExtrasPrice = data.selectedServices.reduce((total, service) => total + service.price, 0);
    const totalEnd = totalExtrasPrice + price;
    
    const [formValue, setFormValue] = useState({
        nombre: '',
        apellido: '',
        apellidoMat: '',
        email: '',
        telefono: ''
    });
    const [error, setError] = useState({});

    useEffect(()=>{
        if(token){
            const decoded = jwtDecode(token)
            setUserToken(decoded.user)
        }
    },[token])

    useEffect(()=>{
        if(token && userToken.idUser){
            const id_user = userToken.idUser

            const fetchUserData = async ()=>{
                try {
                    const response = await axios.get(`${URLConnetion}/users/${id_user}`)
                    const userData = response.data;
                    setFormValue({
                        nombre: userData.name,
                        apellido: userData.last_name1,
                        apellidoMat: userData.last_name2,
                        email: userData.email,
                        telefono: userData.phone
                    })
                } catch (error) {
                    console.error('Error al obtener la información del usuario:', error);
                }
            };
            fetchUserData();
        }
    },[userToken])

    useEffect(() => {
        const validationError = validate();
        if (JSON.stringify(validationError) !== JSON.stringify(error)) {
            setError(validationError);
        }
    }, [formValue]);


    const handleChange = (e) => {   
        const { id, value } = e.target;
        if (id === 'telefono') {
            const numericValue = value.replace(/\D/g, '');
            setFormValue({ ...formValue, [id]: numericValue });
        }
        else if (['nombre', 'apellido', 'apellidoMat'].includes(id)) {
            const textValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            setFormValue({ ...formValue, [id]: textValue });
        }
        else {
            setFormValue({ ...formValue, [id]: value });
        }

        if (error[id]) {
            setError({
                ...error,
                [id]: ''
            });
        }
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
            },
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'El nombre solo debe contener letras'
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
            },
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'El apellido solo debe contener letras'
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
            },
            pattern: {
                value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                message: 'El apellido materno solo debe contener letras'
            }
        },
        telefono: {
            required: true,
            pattern: {
                value: /^\d{10}$/,
                message: 'El teléfono debe tener 10 dígitos'
            },
            maxLength: {
                value: 10,
                message: 'El número de teléfono no debe superar los 10 dígitos'
            }
        },
        email: {
            required: true,
            pattern: {
                value: emailRegexp,
                message: 'El formato del correo electrónico no es válido'
            }
        }
    };
    const validate = () => {
        const error = {};

        Object.keys(validationsRules).forEach(field => {
            const value = formValue[field].trim();
            const rules = validationsRules[field];

            if (rules.required && !value) {
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

    const info = {
            customer: {
                nombre: formValue.nombre,
                apellido: formValue.apellido,
                apellidoMat: formValue.apellidoMat,
                email: formValue.email,
                telefono: formValue.telefono
            },
            data: {
                time: data.selectedTime,
                date: data.selectedDate,
                service: [data.preSelectedService, ...data.selectedServices],
            },
            total: totalEnd
        }
        const verifcationState = verificated =>{
            if(verificated.status){
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: verificated.message, life: 3000 });
            }else{
                toast.current.show({ severity: 'error', summary: 'Error', detail: verificated.message ? verificated.message : ' Verificación fallida', life: 3000 });
            }
        }
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationError = validate();
        if (Object.keys(validationError).length === 0) {
            axios.post(`${URLConnetion}/users/confirmation-email`, {
                email: formValue.email
            })
                .then(response => {
                    if (response.data.success) {
                        verifcationState({status: true, message: response.data.message })
                        setShowVerification(true);
                    } else {
                        const errorMessage = response.data.message ? response.data.message : 'Error desconocido';
                        toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
                        verifcationState({status: false, message: errorMessage})
                    }
                })
                .catch(error => {
                    console.log(error);
                    verifcationState({status: false, message:'Error al enviar el correo ', error})
                });

        } else {
            setError(validationError);
            toast.current.show({ severity: 'warn', summary: 'Completar Registro', detail: 'Completa todos los campos', life: 3000 });
        }
    }
    return (
        <div className=' max-w-4xl mx-auto py-12 p-6 md:p-8'>
            <Toast ref={toast} />
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
                <div className="flex justify-center text-gray-500 border-b border-gray-700 mb-4 py-4">
                    <div className="w-full px-6">
                        <div className="text-md grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex justify-center items-center">
                                <span className='font-semibold'>Servicio: </span>
                                <span> {service}</span>
                            </div>
                            <div className="flex justify-center items-center">
                                <span className='font-semibold'>Fecha: </span>
                                <span> {fecha}</span>
                            </div>
                            <div className="flex justify-center items-center">
                                <span className='font-semibold'>Hora: </span>
                                <span> {hora}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid gap-8'>
                <div className='grid md:grid-cols-2 gap-8'>
                    <div className='space-y-6'>
                        <div>
                            <h2 className='text-xl text-purple-600 font-semibold mb-5'>Informacion del Usuario</h2>
                            <form className='space-y-4'>
                                <div>
                                    <label htmlFor='nombre' className='text-md font-medium'>Nombre</label>
                                    <input id='nombre' placeholder='Ingresa tu nombre' className='flex h-10 w-full rounded-md border shadow px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                        value={formValue.nombre} onChange={handleChange} disabled={userToken? true : false }
                                    />
                                    {error.nombre && <span className='text-red-600 font-semibold text-sm'>!{error.nombre}</span>}
                                </div>
                                <div>
                                    <label htmlFor='apellido' className='text-md font-medium'>Apellido Paterno</label>
                                    <input id='apellido' placeholder='Ingresa tu apellido Paterno' className='flex h-10 w-full rounded-md border shadow px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                        value={formValue.apellido} onChange={handleChange} disabled={userToken? true : false }
                                    />
                                    {error.apellido && <span className='text-sm text-red-600 font-semibold'>!{error.apellido}</span>}
                                </div>
                                <div>
                                    <label htmlFor='apellidoMat' className='text-md font-medium'>Apellido Materno</label>
                                    <input id='apellidoMat' placeholder='Ingresa tu apellido Materno' className='flex h-10 w-full rounded-md border shadow px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                        value={formValue.apellidoMat} onChange={handleChange} disabled={userToken? true : false }
                                    />
                                    {error.apellidoMat && <span className='text-sm text-red-600 font-semibold'>!{error.apellidoMat}</span>}
                                </div>
                                <div>
                                    <label htmlFor='telefono' className='text-md font-medium'>Télefono (No. Celular)</label>
                                    <input id='telefono' placeholder='Ingresa tu telefono 10 digitos' maxLength={validationsRules.telefono.maxLength} className='flex h-10 w-full rounded-md border shadow px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                        value={formValue.telefono} onChange={handleChange} disabled={userToken? true : false }
                                    />
                                    {error.telefono && <span className='text-red-600 text-sm font-semibold'>{error.telefono}</span>}
                                </div>
                                <div>
                                    <label htmlFor='email' className='text-md font-medium'>Correo Eléctronico</label>
                                    <input id='email' placeholder='example@example.com' className='flex h-10 w-full rounded-md border px-3 py-2 shadow text-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                                        value={formValue.email} onChange={handleChange} disabled={userToken? true : false }
                                    />
                                    {error.email && <span className='text-red-600 text-sm font-semibold'>{error.email}</span>}
                                </div>
                                <span className='text-gray-400 text-sm'>*Al finalizar, se enviará un correo para validar que pertencezca a usted.</span>

                            </form>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <div>
                            <h2 className='text-2xl text-purple-600 font-semibold mb-5'>Resumen de la Cita</h2>
                            <div className='flex items-center justify-end'>
                                <span><i className='fa-brands fa-cc-visa fs-3'></i> <i className='fa-brands fa-cc-mastercard fs-3'></i> Acepta Tarjetas Crédito/Débito</span>
                            </div>
                            <div className='space-y-4 text-md mt-4'>
                                <div className='flex item-center justify-between'>
                                    <span >{service}:</span>
                                    <span>{price.toFixed(2)}</span>
                                </div>
                                <div className="flex item-center justify-between">
                                    <span>Servicios extras:</span>
                                    <span>${totalExtrasPrice.toFixed(2)}</span>
                                </div>

                                {data.selectedServices.length > 0 ? (
                                    <div className="ml-4 space-y-1">
                                        {data.selectedServices.map((extraService, index) => (
                                            <div key={index} className="flex">
                                                <span className="text-sm text-gray-500">{extraService.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="ml-4 text-sm text-gray-500">
                                        <span>No se seleccionaron servicios extras</span>
                                    </div>
                                )}
                                <div data-orientation='horizontal' className='shrink-0 bg-gray-300 h-[1px] w-full'></div>
                                <div className='flex items-center justify-between '>
                                    <span>Subtotal:</span>
                                    <span>${totalEnd.toFixed(2)}</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span>Descuento:</span>
                                    <span>-${descuento.toFixed(2)}</span>
                                </div>
                                <div data-orientation='horizontal' className='shrink-0 bg-gray-300 h-[1px] w-full'></div>
                                <div class="flex items-center justify-between font-semibold">
                                    <span>Total</span>
                                    <span>$ {(totalEnd - descuento).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className='text-lg font-semibold mb-2'>Opciones de Pago:</h2>
                            <div className='space-y-4'>
                                <div className='flex items-center'>
                                    <input
                                        type='radio'
                                        id='pay-full'
                                        name='payment-option'
                                        value='full'
                                        checked={paymentOption === 'full'}
                                        onChange={(e)=> setPaymentOption(e.target.value)}
                                        className='mr-2'
                                    />
                                    <label htmlFor='pay-full'>Pagar al Momento</label>
                                </div>
                                <div className='flex items-center'>
                                    <input
                                        type='radio'
                                        id='pay-deposit'
                                        name='payment-option'
                                        value='deposit'
                                        checked={paymentOption === 'deposit'}
                                        onChange={(e)=> setPaymentOption(e.target.value)}
                                        className='mr-2'
                                    />
                                    <label htmlFor='pay-deposit'>Realizar anticipo del 50%</label>
                                </div>

                                <button
                                    className='bg-green-600 hover:bg-green-600/90 text-white text-sm rounded p-3'
                                    onClick={handleSubmit}
                                >
                                {(paymentOption === 'full' ? 'Agendar Servicio' :'Pagar $' + (totalEnd / 2).toFixed(2))}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showVerification && <ConfirmateEmail data={info} verification={verifcationState} metodo={paymentOption}  resendVerification={handleSubmit} onBack={() => setShowVerification(false)}/>}
        </div>
    );
}

export default ServicesPay;
/*
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
    }; */