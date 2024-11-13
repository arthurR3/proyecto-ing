import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiConnection from '../../../Components/Api/ApiConfig.js';
import { toast } from 'react-toastify';
const URLConnetion = ApiConnection();

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        id_category: '',
        id_brand: '',
        id_supplier: '',
        price: '',
        amount: '',
        description: '',
        image: null,
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                id_category: product.id_category,
                id_brand: product.id_brand,
                id_supplier: product.id_supplier,
                price: product.price,
                amount: product.amount,
                description: product.description,
                image: null,
            });
        }
    }, [product]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, brandsResponse, suppliersResponse] = await Promise.all([
                    axios.get(`${URLConnetion}/categories`),
                    axios.get(`${URLConnetion}/brands`),
                    axios.get(`${URLConnetion}/suppliers`),
                ]);
                setCategories(categoriesResponse.data);
                setBrands(brandsResponse.data);
                setSuppliers(suppliersResponse.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file && !['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
            toast.error('Solo se permiten archivos con formato png, jpg y jpeg');
            return;
        }
        setFormData(prevFormData => ({ ...prevFormData, image: file }));
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (product) {
                const modifiedData = {};
                Object.keys(formData).forEach(key => {
                    if (formData[key] !== product[key])
                        modifiedData[key] = formData[key];
                });
                await axios.put(`${URLConnetion}/products/${product.id}`, modifiedData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Producto actualizado correctamente!');
            } else {
                await axios.post(`${URLConnetion}/products/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success('Producto agregado correctamente!');
            }
            onSave();
        } catch (error) {
            console.error('Error saving product', error);
        }
    };

    return (
        <div className="container-fluid px-1 mx-auto">
            <div className='row d-flex justify-content-center'>
                <div className='col-xl-10 col-lg-11 col-md-12 col-12 text-center'>
                    <div className='card'>
                        <h5 className='title text-center mb-4'>{product ? 'Actualizando Producto' : 'Agregando Nuevo Producto'}</h5>
                        <form className='form-card' onSubmit={handleSubmit}>
                            <div className='row justify-content-between text-left'>
                                <div className='form-group col-sm-6 flex-column d-flex'>
                                    <label className='form-control-label fw-bold px-3'>Nombre del producto</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder='Nombre del producto'
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='form-group col-sm-6 flex-column d-flex'>
                                    <label className='form-control-label fw-bold px-3'>Categoría del producto</label>
                                    <select
                                        className="form-control"
                                        name="id_category"
                                        value={formData.id_category}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='row justify-content-between text-left mt-4'>
                                <div className='form-group col-sm-6 flex-column d-flex'>
                                    <label className='form-control-label fw-bold px-3'>Marca del producto</label>
                                    <select
                                        className="form-control"
                                        name="id_brand"
                                        value={formData.id_brand}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione una marca</option>
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='form-group col-sm-6 flex-column d-flex'>
                                    <label className='form-control-label fw-bold px-3'>Proveedor del producto</label>
                                    <select
                                        className="form-control"
                                        name="id_supplier"
                                        value={formData.id_supplier}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione un proveedor</option>
                                        {suppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='row justify-content-between text-left mt-4'>
                                <div className='form-group col-sm-6 flex-column d-flex'>
                                    <label className='form-control-label fw-bold px-3'>Precio del producto</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='form-group col-sm-6 flex-column d-flex'>
                                    <label className='form-control-label fw-bold px-3'>Cantidad del producto</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className='row justify-content-between text-left mt-4'>
                                <div className='form-group col-sm-6 flex-column d-flex'>
                                    <label className='form-control-label fw-bold px-3'>Imagen del producto</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChangeImage}
                                    />
                                </div>
                            </div>
                            <div className='row justify-content-between text-left'>
                                <div className='form-group col-sm-12 flex-column d-flex mt-5'>
                                    <label className='form-control-label fw-bold px-3'>Descripción del producto</label>
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
            </div>
        </div>
    );
};

export default ProductForm;
