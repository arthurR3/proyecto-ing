import axios from 'axios';
import React, { useEffect, useState } from 'react'
import FormProducts from '../../Componentes/FormProducts';
import ApiConnection from '../../Componentes/Api/ApiConfig';
import { toast } from 'react-toastify';


function Products() {
    const URLConnetion = ApiConnection();
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${URLConnetion}/products`);
            setProducts(response.data);
        }
        fetchData()
    }, []);

    const handleAddProduct = newProduct => {
        axios.post(`${URLConnetion}/products`, {
            newProduct
        })
            .then(response => response.data)
            .then(newProduct => {
                setProducts([...products, newProduct]);
            })
            .catch(error => toast.error('Error al agregar el producto'));
    }
    const handleEditProduct = editedProduct => {}

    return (
        <div className=' container'>
            <div className='py-5'>
                <table className='table-responsive'>
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Cantidad</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    )
}

export default Products