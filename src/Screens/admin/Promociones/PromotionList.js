import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApiConnection from '../../../Components/Api/ApiConfig';
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
        <div className="container mx-auto py-5 mt-4">
            <div className="flex justify-between mb-3">
                <h3 className="text-2xl font-bold">Promociones</h3>
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleAddPromotion}
                >
                    Agregar Promoción
                </button>
            </div>
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xl font-bold">Vigentes</h4>
                        {activePromotions.length > 0 ? (
                            <ul className="space-y-4">
                                {activePromotions.map(promotion => (
                                    <li key={promotion.id} className="border p-4 rounded shadow-md flex justify-between items-center">
                                        <div>
                                            <h5 className="text-lg font-semibold">{promotion.title}</h5>
                                            <p>{promotion.description}</p>
                                            <p>Descuento: {promotion.discount}%</p>
                                            <p>Fecha de inicio: {new Date(promotion.startDate).toLocaleDateString()}</p>
                                            <p>Fecha de fin: {new Date(promotion.endDate).toLocaleDateString()}</p>
                                            <p>Producto: {promotion.id_product || 'N/A'}</p>
                                            <p>Servicio: {promotion.id_service || 'N/A'}</p>
                                        </div>
                                        <button
                                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
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
                    <div>
                        <h4 className="text-xl font-bold">No Vigentes</h4>
                        {inactivePromotions.length > 0 ? (
                            <ul className="space-y-4">
                                {inactivePromotions.map(promotion => (
                                    <li key={promotion.id} className="border p-4 rounded shadow-md flex justify-between items-center">
                                        <div>
                                            <h5 className="text-lg font-semibold">{promotion.title}</h5>
                                            <p>{promotion.description}</p>
                                            <p>Descuento: {promotion.discount}%</p>
                                            <p>Fecha de inicio: {new Date(promotion.startDate).toLocaleDateString()}</p>
                                            <p>Fecha de fin: {new Date(promotion.endDate).toLocaleDateString()}</p>
                                            <p>Producto: {promotion.id_product || 'N/A'}</p>
                                            <p>Servicio: {promotion.id_service || 'N/A'}</p>
                                        </div>
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
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

            {/* Modal para Editar Promoción */}
            {editingPromotion && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h5 className="text-xl font-bold mb-4">Editar Promoción</h5>
                        <div className="mb-3">
                            <label htmlFor="discountPercentage" className="block text-sm font-medium">Descuento</label>
                            <input
                                type="number"
                                id="discountPercentage"
                                name="discountPercentage"
                                className="w-full border rounded px-3 py-2"
                                value={editingPromotion.discountPercentage}
                                onChange={handleEditChange}
                                required
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startDate" className="block text-sm font-medium">Fecha de Inicio</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                className="w-full border rounded px-3 py-2"
                                value={editingPromotion.startDate}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endDate" className="block text-sm font-medium">Fecha de Fin</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                className="w-full border rounded px-3 py-2"
                                value={editingPromotion.endDate}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={handleSaveChanges}
                            >
                                Guardar Cambios
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 ml-2 rounded hover:bg-gray-600"
                                onClick={() => setEditingPromotion(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionsList;
