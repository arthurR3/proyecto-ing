import React, { useState } from 'react'

const FormProducts = ({ onSubmit, productsEdit }) => {
    const [values, setValues] = useState(productsEdit, { name: '', price: '', amount: '', category: '', marca: '', description: '', image: '' })
    const isEditting = !!productsEdit;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value })
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(values);
        setValues({ name: '', price: '', amount: '', category: '', marca: '', description: '', image: '' })
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label htmlFor='name'>Nombre</label>
                <input
                    type='text'
                    className='form-control'
                    id='name'
                    name='name'
                    value={values.name}
                    onChange={handleChange}
                />
            </div>
            <div className='form-group'>
                <label htmlFor='price'>Precio</label>
                <input
                    type='text'
                    className='form-control'
                    id='price'
                    name='price'
                    value={values.price}
                    onChange={handleChange}
                />
            </div>
            <div className='form-group'>
                <label htmlFor='amount'>Cantidad</label>
                <input
                    type='text'
                    className='form-control'
                    id='amount'
                    name='amount'
                    value={values.amount}
                    onChange={handleChange}
                />
            </div>
            <div className='form-group'>
                <label htmlFor='category'>Categoria</label>
                <input
                    type='text'
                    className='form-control'
                    id='category'
                    name='category'
                    value={values.category}
                    onChange={handleChange}
                />
            </div>
            <div className='form-group'>
                <label htmlFor='marca'>Marca</label>
                <input
                    type='text'
                    className='form-control'
                    id='marca'
                    name='marca'
                    value={values.marca}
                    onChange={handleChange}
                />
            </div>
            <div className='form-group'>
                <label htmlFor='description'>Descripcion</label>
                <input
                    type='text'
                    className='form-control'
                    id='description'
                    name='description'
                    value={values.description}
                    onChange={handleChange}
                />
                <div className='form-group'>
                    <label htmlFor='image'>Imagen</label>
                    <input
                        type='text'
                        className='form-control'
                        id='image'
                        name='image'
                        value={values.image}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className='btn btn-primary btn-clock confirm-button'>{isEditting ? 'Actualizar' : 'Agregar'} Producto</button>
            </div>
        </form>
    )
}
export default FormProducts;
 