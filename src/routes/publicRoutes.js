import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../Components/Loading/Loading.js";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedLayout from "../layouts/ProtectedLayout.js";

const Home = lazy(() => import('../pages/public/Home'))
const CatalogoProductos = lazy(() => import('../pages/public/Products.js'))
const CatalogoServicios = lazy(() => import('../pages/public/Servicios.js'))
const AgendarCita = lazy(() => import('../pages/public/ServiciosAgendar/CategoriasAgendar.js'))
const Login = lazy(() => import('../pages/public/Login/Login.js'))
const CrearCuenta = lazy(() => import('../pages/public/Login/Register.js'))
const ForgetEmail = lazy(() => import('../pages/public/Login/Recuperacion/ForEmail.js'))
const ValidationEmail = lazy(() => import('../pages/public/Login/Recuperacion/validationEmail.js'))
const ChangePassword = lazy(() => import('../pages/public/Login/Recuperacion/changePassword.js')) 
const ListaServicios = lazy(() => import('../pages/public/ServiciosAgendar/ServicesList.js'))
const AgendaHorarios = lazy(() => import('../pages/public/ServiciosAgendar/Agenda.js'))
const SuccessDates = lazy(() => import('../pages/public/ServiciosAgendar/SuccessDate.js'))

const Carrito = lazy(() => import('../pages/public/Carrito/Carrito.js'))
const SuccessPage = lazy(()=> import('../pages/public/Carrito/SuccessPage.js'))
const MisCompras = lazy(() => import('../pages/public/users/DetailsCart.js'))
const MisCitas = lazy(() => import('../pages/public/users/MisCitas.js'))
const MiPerfil = lazy(() => import('../pages/public/users/Perfil.js'))

const Terminos = lazy(() => import('../pages/public/Terms&Conditions/Terminos.js'))
const AvisoPriv = lazy(() => import('../pages/public/Terms&Conditions/AvisoPrivacidad.js'))
const DashboardAdmin = lazy(()=> import('../Screens/admin/DashboardAdmin.js'))
const PublicRoutes = () =>(
    <Suspense fallback={<LoadingSpinner/>}>
        <Routes>
            <Route path="/" element={<PublicLayout><Home/></PublicLayout>}/>
            <Route path="/productos" element={<PublicLayout><CatalogoProductos/></PublicLayout>}/>
            <Route path="/servicios" element={<PublicLayout><CatalogoServicios/></PublicLayout>}/>
            <Route path="/servicios-agendar" element={<PublicLayout><AgendarCita/></PublicLayout>}/>
            <Route path="/login" element={<PublicLayout><Login/></PublicLayout>}/>
            <Route path="/login/register" element={<PublicLayout><CrearCuenta/></PublicLayout>}/>
            <Route path="/login/forgeted-password/:method" element={<PublicLayout><ForgetEmail/></PublicLayout>}/>
            <Route path="/login/verificacion/verify-email/:method/:correo" element={<PublicLayout><ValidationEmail/></PublicLayout>}/>
            <Route path="/login/change/change-password/:correo" element={<PublicLayout><ChangePassword/></PublicLayout>}/>
            <Route path="/servicio/:category" element={<PublicLayout><ListaServicios/></PublicLayout>}/>
            <Route path="/servicio/horarios/:id" element={<PublicLayout><AgendaHorarios/></PublicLayout>}/>
            <Route path="/success" element={<PublicLayout><SuccessDates/></PublicLayout>}/>

             {/* TERMINOS Y CONDICIONES */}
             <Route path="/Terminos y condiciones" element={<PublicLayout><Terminos/></PublicLayout>}/>   
             <Route path="/Aviso de Privacidad" element={<PublicLayout><AvisoPriv/></PublicLayout>}/>   

            <Route path="/carrito-compras" element={<ProtectedLayout><Carrito /></ProtectedLayout>}/>
            <Route path="/shopmarket/success" element={<PublicLayout><SuccessPage/></PublicLayout>}/>
            <Route path="/mi-perfil" element={<ProtectedLayout><MiPerfil/></ProtectedLayout>}/>
            <Route path='/user-info/citas-agendadas' element={<ProtectedLayout><MisCitas/></ProtectedLayout>}/>
            <Route path="/user-info/mis-compras" element={<ProtectedLayout><MisCompras/></ProtectedLayout>}/>

            <Route path="/admin/home" element={<PublicLayout><DashboardAdmin/></PublicLayout>}/>
        </Routes>
    </Suspense>
)

export default PublicRoutes;
