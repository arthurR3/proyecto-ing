import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApiConnection from '../../../Componentes/Api/ApiConfig';
const URLConnection = ApiConnection();

const PromotionsList = () => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get(`${URLConnection}/promotion`);
                setPromotions(response.data);
            } catch (error) {
                console.error('Error fetching promotions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    const handleAddPromotion = () => {
        navigate('/admin/promociones/add');
    };

    const handleDeactivatePromotion = async (id) => {
        try {
            await axios.put(`${URLConnection}/promotion/${id}`, { status: false });
            // Refresh the promotions list
            const response = await axios.get(`${URLConnection}/promotion`);
            setPromotions(response.data);
        } catch (error) {
            console.error('Error deactivating promotion:', error);
        }
    };

    const handleReactivatePromotion = async (id) => {
        try {
            const response = await axios.get(`${URLConnection}/promotion/${id}`);
            setEditingPromotion(response.data);
        } catch (error) {
            console.error('Error fetching promotion for editing:', error);
        }
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`${URLConnection}/promotion/${editingPromotion.id}`, {
                status: true,
                discount: editingPromotion.discountPercentage,
                startDate: editingPromotion.startDate,
                endDate: editingPromotion.endDate
            });
            // Refresh the promotions list
            const response = await axios.get(`${URLConnection}/promotion`);
            setPromotions(response.data);
            setEditingPromotion(null);
        } catch (error) {
            console.error('Error updating promotion:', error);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingPromotion((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const today = new Date();

    const activePromotions = promotions.filter(promotion => promotion.status && new Date(promotion.endDate) >= today);
    const inactivePromotions = promotions.filter(promotion => !promotion.status || new Date(promotion.endDate) < today);

    return (
        <div className="container title py-5 mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h3 className="fw-bold">Promociones</h3>
                <button 
                    className="btn btn-primary"
                    onClick={handleAddPromotion}
                >
                    Agregar Promoción
                </button>
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="row">
                    <div className="col-md-6">
                        <h4 className="fw-bold">Vigentes</h4>
                        {activePromotions.length > 0 ? (
                            <ul className="list-group">
                                {activePromotions.map(promotion => (
                                    <li key={promotion.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{promotion.title}</h5>
                                            <p>{promotion.description}</p>
                                            <p>Descuento: {promotion.discount}%</p>
                                            <p>Fecha de inicio: {new Date(promotion.startDate).toLocaleDateString()}</p>
                                            <p>Fecha de fin: {new Date(promotion.endDate).toLocaleDateString()}</p>
                                            <p>Producto: {promotion.id_product || 'N/A'}</p>
                                            <p>Servicio: {promotion.id_service || 'N/A'}</p>
                                        </div>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleDeactivatePromotion(promotion.id)}
                                        >
                                            Desactivar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay promociones vigentes.</p>
                        )}
                    </div>
                    <div className="col-md-6">
                        <h4 className="fw-bold">No Vigentes</h4>
                        {inactivePromotions.length > 0 ? (
                            <ul className="list-group">
                                {inactivePromotions.map(promotion => (
                                    <li key={promotion.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{promotion.title}</h5>
                                            <p>{promotion.description}</p>
                                            <p>Descuento: {promotion.discount}%</p>
                                            <p>Fecha de inicio: {new Date(promotion.startDate).toLocaleDateString()}</p>
                                            <p>Fecha de fin: {new Date(promotion.endDate).toLocaleDateString()}</p>
                                            <p>Producto: {promotion.id_product || 'N/A'}</p>
                                            <p>Servicio: {promotion.id_service || 'N/A'}</p>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleReactivatePromotion(promotion.id)}
                                        >
                                            Reactivar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hay promociones no vigentes.</p>
                        )}
                    </div>
                </div>
            )}
            {editingPromotion && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title">Editar Promoción</h5>
                        <div className="mb-3">
                            <label htmlFor="discountPercentage" className="form-label">Descuento</label>
                            <input
                                type="number"
                                id="discountPercentage"
                                name="discountPercentage"
                                className="form-control"
                                value={editingPromotion.discountPercentage}
                                onChange={handleEditChange}
                                required
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">Fecha de Inicio</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                className="form-control"
                                value={editingPromotion.startDate}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endDate" className="form-label">Fecha de Fin</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                className="form-control"
                                value={editingPromotion.endDate}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <button
                            className="btn btn-success"
                            onClick={handleSaveChanges}
                        >
                            Guardar Cambios
                        </button>
                        <button
                            className="btn btn-secondary ms-2"
                            onClick={() => setEditingPromotion(null)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionsList;
