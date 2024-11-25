import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login'; // Assurez-vous que le chemin vers Login.js est correct
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DemandeActe from './components/DemandeActe';
import SignUp from './components/signup';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CrudAdmin from './components/CrudAdmin';
import CreateActe from './components/CreateActe';
import PrivateRoute from './components/PrivateRoutes';
import ListActes from './components/ListActes';
import Notification from './components/notification';
import '@coreui/coreui/dist/css/coreui.min.css';
import Navbar from './components/Navbar';
import ActeDash from './components/ActeDash';
import NotifDash from './components/NotifDash';
import UserNotif from './components/UserNotif';
import './index.css';
// import './App.css';

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
        


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/demande-acte" element={<DemandeActe />} />
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
          <Route path="/admin/createActe" element={<PrivateRoute element={<CreateActe />} />} />
          <Route path="/admin/crudAdmin" element={<PrivateRoute element={<CrudAdmin />} />} />
          <Route path="/admin/ListActes" element={<PrivateRoute element={<ListActes />} />} />
          <Route path="/admin/Notification" element={<PrivateRoute element={<Notification />} />} />
          <Route path="/admin/Navbar" element={<PrivateRoute element={<Navbar />} />} />
          <Route path="/admin/ActeDash" element={<PrivateRoute element={<ActeDash />} />} />
          <Route path="/admin/NotifDash" element={<PrivateRoute element={<NotifDash />} />} />
          <Route path="/UserNotif" element={<UserNotif />} />
          
          
        </Routes>
      </div>
    </Router>
  );
}


export default App;
