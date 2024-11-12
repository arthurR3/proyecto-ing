import React, { lazy, Suspense } from "react";

import LoadingSpinner from "../Components/Loading/Loading";
import PrivateLayout from '../layouts/PrivateLayout.js'
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "../Components/Context/AdminAuthContext.js";
const LoginAdmin = lazy(() => import('../Screens/admin/loginAdm.js'))
const AdminHome = lazy(() => import('../Screens/admin/DashboardAdmin.js'))
const Promociones = lazy(() => import('../Screens/admin/Promociones/PromotionList.js'))
const AddPromociones = lazy(() => import('../Screens/admin/Promociones/Promociones.js'))
const ProductsList = lazy(() => import('../Screens/admin/Productos/ListProductos.js'))
const PrivateRoute = ({ children }) => {
    const { token } = useAdminAuth();
    return token ? children : <Navigate to="/admin" />;
};
const AdminRoutes = () => (
    <AdminAuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<LoginAdmin />} />

                <Route path="/home" element={
                    <PrivateRoute>
                        <PrivateLayout><AdminHome /></PrivateLayout>
                    </PrivateRoute>
                } />
                <Route path="/promociones" element={
                    <PrivateRoute>
                        <PrivateLayout><Promociones /></PrivateLayout>
                    </PrivateRoute>
                } />
                <Route path="/promociones/add" element={
                    <PrivateRoute>
                        <PrivateLayout><AddPromociones /></PrivateLayout>
                    </PrivateRoute>
                } />

                <Route path="/productos/lista" element={
                    <PrivateRoute>
                        <PrivateLayout><ProductsList /></PrivateLayout>
                    </PrivateRoute>
                } />
            </Routes>
        </Suspense>
    </AdminAuthProvider>
    // rest of your routes...
)

export default AdminRoutes;