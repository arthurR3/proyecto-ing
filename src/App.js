import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PublicRoutes from './routes/publicRoutes.js';
/* import { ToastContainer } from 'react-toastify'; */
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ScrollToTop from './hooks/ScrollTop.js';
import AdminRoutes from './routes/AdminRoutes.js';


/* import { AuthProvider } from './Componentes/Context/AuthContext.js';
import { CartProvider } from './Componentes/Context/CarritoContext.js';
import PrivateRoute from './Componentes/Context/PrivateRoute.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PublicLayout from './Componentes/Layouts/PublicLayout.js';
import Home from './Screens/Home.js';
import Login from './Screens/Login/Login.js';
import Register from './Screens/Login/Register.js';
import Recuperacion from './Screens/Login/Recuperacion/Recuperacion.js';
import ValidationEmail from './Screens/Login/Recuperacion/validationEmail.js';
import ChangePassword from './Screens/Login/Recuperacion/changePassword.js';
import Error404 from './Screens/Error/404.js';
import Productos from './Screens/Productos/Productos.js';
import Error500 from './Screens/Error/500.js';
import AgendarCita from './Screens/Citas/agendarCita.js';
import Carrito from './Screens/Productos/Compras/Carrito.js';
import PreguntaSecreta from './Screens/Login/Recuperacion/PreguntaSecreta.js';
import AddressScreen from './Screens/Productos/Compras/AddressScreen.js';
import DetailsOrder from './Screens/Productos/Compras/DetailsCart.js';
import Service from './Screens/Services/Service.js';
import DomicilioUser from './Screens/Users/Domicilio.js';
import SecurityScreen from './Screens/Users/Security.js';
import CitasAgendadas from './Screens/Users/MisCitas.js';
import Terminos from './Screens/Terms&Conditions/Terminos.js';
import ServicesList from './Screens/Services/ServicesList.js';
import Agenda from './Screens/Services/Agenda.js';
import PrivacyPolicy from './Screens/Terms&Conditions/AvisoPrivacidad.js';
import Loading from './Componentes/Loading/Loading.js';
import ServicesPay from './Screens/Services/ServicePay.js';
import ConfigUser from './Screens/Users/ConfigUser.js';
import Contact from './Screens/Contacto.js';
import { NavBar } from './Componentes/NavBar/NavBar.js';
import AdminRoutes from './AdminRoute.js';
import SuccessPage from './Screens/Productos/Compras/SuccessPage.js';
import ConfirmationDates from './Screens/Citas/ConfirmationDates.js';
import ErrorBoundary from './Componentes/Layouts/CatchErrores.js'; */

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<PublicRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </Router>
  )
}

export default App;


/* return (
    <div className='App'>
      <div className='content'>
        <ErrorBoundary>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path='/' element={<PublicLayout><Home /></PublicLayout>} />
                <Route path='/productos' element={<PublicLayout><Productos /></PublicLayout>} />
                <Route path='/Login' element={<PublicLayout><Login /></PublicLayout>} />
                <Route path='/Login/register' element={<PublicLayout><Register /></PublicLayout>} />
                <Route path='/Login/recuperacion/recover-password/:method' element={<PublicLayout><Recuperacion /></PublicLayout>} />
                <Route path='/Login/verificacion/verify-email/:method/:correo' element={<PublicLayout><ValidationEmail /></PublicLayout>} />
                <Route path='/Login/recuperacion/recuperacion/secret-question/:correo' element={<PublicLayout><PreguntaSecreta /></PublicLayout>} />
                <Route path='/Login/change/change-password/:correo' element={<PublicLayout><ChangePassword /></PublicLayout>} />
                <Route path='/shop-cart' element={<PrivateRoute><PublicLayout><Carrito /></PublicLayout></PrivateRoute>} />
                <Route path='/shop-cart/success' element={<PublicLayout><SuccessPage/></PublicLayout>} />
                <Route path='/contact' element={<PublicLayout><Contact /></PublicLayout>} />
                <Route path='/shop-cart/select-address' element={<PrivateRoute><PublicLayout><AddressScreen /></PublicLayout></PrivateRoute>} />
                <Route path='/shop-cart/details' element={<PrivateRoute><PublicLayout><DetailsOrder /></PublicLayout></PrivateRoute>} />
                <Route path='/book-appointments' element={<PublicLayout><AgendarCita /></PublicLayout>} />
                <Route path='/Politicas/Terminos y Condiciones' element={<PublicLayout><Terminos /></PublicLayout>} />
                <Route path='/Politicas/Aviso de Privacidad' element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
                <Route path='*' element={<PublicLayout><Error404 /></PublicLayout>} />
                <Route path='/Error-500' element={<PublicLayout><Error500 /></PublicLayout>} />
                <Route path='/user-info/datosPersonal' element={<PrivateRoute><PublicLayout><ConfigUser /></PublicLayout></PrivateRoute>} />
                <Route path='/user-info/Personal-security' element={<PrivateRoute><PublicLayout><SecurityScreen /></PublicLayout></PrivateRoute>} />
                <Route path='/User-info/address/:correo' element={<PrivateRoute><PublicLayout><DomicilioUser /></PublicLayout></PrivateRoute>} />
                <Route path='/user-info/citas-agendadas' element={<PrivateRoute><PublicLayout><CitasAgendadas /></PublicLayout></PrivateRoute>} />
                <Route path='/servicios' element={<PublicLayout><Service /></PublicLayout>} />
                <Route path='/servicios/categories/:category' element={<PublicLayout><ServicesList /></PublicLayout>} />
                <Route path='/servicios/agendar-cita/:id' element={<PublicLayout><Agenda /></PublicLayout>} />
                <Route path='/confirmacion-cita' element={<PublicLayout><ConfirmationDates /></PublicLayout>} />
                <Route path='/pago' element={<PublicLayout><ServicesPay /></PublicLayout>} />
                <Route path='/loading' element={<PublicLayout><Loading /></PublicLayout>} />
                
                <Route path='/admin/*' element={<AdminRoutes />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
        </ErrorBoundary>
      </div>
      <ToastContainer />
    </div>
  ); */
