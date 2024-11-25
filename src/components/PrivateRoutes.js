// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Ce composant va vérifier si l'utilisateur est authentifié
const PrivateRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem('token'); // Vérifiez si le token existe dans le local storage

    return isAuthenticated ? element : <Navigate to="/admin/login" />; // Redirige vers la page de connexion si non authentifié
};

export default PrivateRoute;
