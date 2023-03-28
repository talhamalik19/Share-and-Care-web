import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ConfigProvider as AvatarProvider } from 'react-avatar';
import { useSelector } from 'react-redux';
//navbar
import NavBar from '../components/UI/Navbar';
//routes
import Signin from '../routes/Signin';
import Signup from '../routes/Signup';
import Home from '../routes/Home';
import UpdateAccount from '../routes/UpdateAccount';
import UpdatePassword from '../routes/UpdatePassword';
import ForgotPassword from '../routes/ForgotPassword';
import Resources from '../routes/Resources';
import ResourceRequest from '../routes/ResourceRequest';
import Volunteers from '../routes/Volunteers';
import VolunteerRequest from '../routes/VolunteerRequest';
import Error404 from '../routes/Error404';

function ProtectedRoutes() {
  const { isLoggedIn } = useSelector((state) => state.hospital);
  if (!isLoggedIn) {
    return <Navigate to='/sign-in' replace />;
  }
  return <Outlet />;
}

export default function AppRouter() {
  return (
    <Router>
      <AvatarProvider>
        <NavBar />
      </AvatarProvider>
      <Routes>
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<Home />} />
          <Route path='/update-account' element={<UpdateAccount />} />
          <Route path='/update-password' element={<UpdatePassword />} />
          <Route path='/resources' element={<Resources />} />
          <Route path='/resource-request' element={<ResourceRequest />} />
          <Route path='/volunteers' element={<Volunteers />} />
          <Route path='/volunteer-request' element={<VolunteerRequest />} />
        </Route>
        <Route path='*' element={<Error404 />} />
      </Routes>
    </Router>
  );
}
