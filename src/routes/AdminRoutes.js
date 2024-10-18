import React, {lazy, Suspense} from "react";

import LoadingSpinner from "../Components/Loading/Loading";
import PrivateLayout from '../layouts/PrivateLayout.js'
import { Route, Routes } from "react-router-dom";

const AdminHome = lazy(() => import('../Screens/admin/DashboardAdmin.js'))

const AdminRoutes = () => (
    <Suspense fallback={<LoadingSpinner />}>
        <Routes>
            <Route path="/home" element={<PrivateLayout><AdminHome/></PrivateLayout>} />
        </Routes>
    </Suspense>

    // rest of your routes...
)

export default AdminRoutes;