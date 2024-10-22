import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConnection from '../../../Componentes/Api/ApiConfig.js';
import { toast } from 'react-toastify';

const URLConnetion = ApiConnection();

const ServiceForm = ({ service, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        id_category: '',
        description: '',
        price: '',
        duration: '',
        image: null,
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${URLConnetion}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchCategories();

        if (service) {
            setFormData({
                name: service.name,
                id_category: service.id_category,
                description: service.description,
                price: service.price,
                duration: service.duration,
                image: null,
            });
        }
    }, [service]);

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file && !['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
            toast.error('Solo se permiten archivos con formato png, jpg y jpeg');
            return;
        }
        setFormData(prevFormData => ({ ...prevFormData, image: file }));
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            if (service) {
                await axios.put(`${URLConnetion}/services/${service.id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Servicio actualizado correctamente!');
            } else {
                await axios.post(`${URLConnetion}/services`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Servicio agregado correctamente!');
            }
            onSave();
        } catch (error) {
            console.error('Error saving service', error);
            toast.error('Error guardando el servicio');
        }
    };

    return (
        <div className="container-fluid px-1 mx-auto">
            <div className='row d-flex justify-content-center'>
                <div className='col-xl-10 col-lg-11 col-md-12 col-12 text-center'>
                    <div className='card'>
                        <h5 className='title text-center mb-4'>{service ? 'Actualizando Servicios' : 'Agregando Nuevo Servicio'}</h5>
                        <form className='form-card' onSubmit={handleSubmit}>
                            <div className='row justify-content-between text-left'>
                                <div className='form-group col-sm-6 flex-column d-flex'><label className='form-control-label fw-bold px-3'>Nombre del servicio</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder='Nombre del servicio'
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='form-group col-sm-6 flex-column d-flex'><label className='form-control-label fw-bold px-3'>Categoria del servicio</label>
                                    <select
                                        className="form-control"
                                        name="id_category"
                                        value={formData.id_category}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='row justify-content-between text-left mt-4'>
                                <div className='form-group col-sm-6 flex-column d-flex'><label className='form-control-label fw-bold px-3'>Precio del servicio</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='form-group col-sm-6 flex-column d-flex'><label className='form-control-label fw-bold px-3'>Duracion del servicio</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="duration"
                                        placeholder='formato hh:mm:ss'
                                        value={formData.duration}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className='row justify-content-between text-left mt-4'>
                                <div className='form-group col-sm-6 flex-column d-flex'><label className='form-control-label fw-bold px-3'>Imagen servicio</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        onChange={handleChangeImage}
                                    />
                                </div>
                            </div>
                            <div className='row justify-content-between text-left'>
                                <div className='form-group col-sm-12 flex-column d-flex mt-5'>
                                    <label className='form-control-label fw-bold px-3'>Descripción del servicio</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                    />
                                </div>
                            </div>
                            <div className='row justify-content-end'>
                                <div className='form-group col-sm-6 mt-5'>
                                    <button type="submit" className="btn btn-block btn-success me-4">
                                        Guardar
                                    </button>
                                    <button type="button" className="btn btn-block btn-secondary" onClick={onCancel}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ServiceForm;
