import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateLayout from './Componentes/Layouts/PrivateLayout.js';
import PublicLayout from './Componentes/Layouts/PublicLayout.js';
import DashboardAdmin from './Screens/admin/DashboardAdmin.js';
import CitaDetalle from './Screens/admin/Citas/CitaDetalle.js';
import ListaClientes from './Screens/admin/Clientes/ListaClientes.js';
import ListServicios from './Screens/admin/Servicios/ListServicios.js';
import ProductList from './Screens/admin/Productos/ListProductos.js';
import CitasList from './Screens/admin/Citas/ListCitas.js';
import GestionVentas from './Screens/admin/Ventas/Ventas.js';
import PromotionsList from './Screens/admin/Promociones/PromotionList.js';
import PromotionForm from './Screens/admin/Promociones/Promociones.js';
import AdminLogin from './Screens/admin/loginAdm.js';
import { AdminAuthProvider } from './Componentes/Context/AdminAuthContext.js';
import { NavBarAdmin } from './Componentes/NavBar/NavBar.js';
import PrivateAdminRoute from './Componentes/Context/PrivateAdminRoute.js';

const AdminRoutes = () => (
  <AdminAuthProvider>
    <Routes>
      <Route path='/admin/dashboard' element={<PrivateAdminRoute> <PrivateLayout><DashboardAdmin /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/admin/cita-detalle/:id' element={<PrivateAdminRoute><PrivateLayout><CitaDetalle /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/admin/clientes' element={<PrivateAdminRoute><PrivateLayout><ListaClientes /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/admin/services-list' element={<PrivateAdminRoute><PrivateLayout><ListServicios /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/admin/Productos-list' element={<PrivateAdminRoute><PrivateLayout><ProductList /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/admin/citas-list' element={<PrivateAdminRoute><PrivateLayout><CitasList /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/admin/ventas-realizadas' element={<PrivateAdminRoute><PrivateLayout><GestionVentas /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/admin/promociones' element={<PrivateAdminRoute><PrivateLayout><PromotionsList /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/admin/promociones/add' element={<PrivateAdminRoute><PrivateLayout><PromotionForm /></PrivateLayout></PrivateAdminRoute>} />
      <Route path='/login' element={<PublicLayout><AdminLogin /></PublicLayout>} />
    </Routes>
  </AdminAuthProvider>
);

export default AdminRoutes;
