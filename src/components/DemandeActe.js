import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { 
  TextField, Button, Typography, Select, MenuItem, 
  FormControl, InputLabel, Grid, Box, AppBar, Toolbar, Link 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation



const DemandForm = () => {
  const [formData, setFormData] = useState({
    actDemand: 'BORN',
    numActe: '',
    province: 'ANTANANARIVO',
    commune: '',
    name: '',
    firstName: '',
    dateOfBirth: '',
    placeOfBirth: '',
  });

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // Declare navigate to use for page redirection

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setEmailUser(decodedToken.user_id || '');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const validateForm = () => {
    const requiredFields = ['actDemand', 'numActe', 'province', 'commune', 'name', 'firstName', 'dateOfBirth', 'placeOfBirth'];
    for (let field of requiredFields) {
      if (!formData[field]) return false;
    }
    if (files.length !== 2) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      setMessage('Veuillez remplir tous les champs requis et sélectionner deux fichiers.');
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, key === 'dateOfBirth' ? new Date(formData[key]).toISOString() : formData[key]);
    });

    data.append('emailUser', emailUser);
    data.append('emailAdmin', 'oreo@gmail.com');
    Array.from(files).forEach((file) => {
      data.append('files', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3005/api/demand/create', {
        method: 'POST',
        headers: {
          authorizations: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Demande envoyée avec succès.');
      } else {
        setMessage(result.message || 'Une erreur est survenue lors de la soumission.');
      }
    } catch (error) {
      setMessage('Erreur réseau : Impossible de soumettre la demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">
    {/* Navbar */}
    {/* <div className="navbar bg-primary text-white px-4">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Demande d'Acte d'Etat Civil</a>
      </div>
      <div className="flex-none">
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/userNotif')} // Navigate to the userNotif page
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-6 h-6 mr-2 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .415-.162.816-.445 1.114L4 17h5m6 0a3 3 0 01-6 0m6 0H9"
            />
          </svg>
          Notifications
        </button>
      </div>
    </div> */}
  
     <div className="navbar bg-base-300 flex justify-between px-4">
        <div className="navbar-start">
          {/* <h1 className="text-xl font-bold">Gestion des Actes</h1> */}
        <a className="btn btn-ghost normal-case text-xl font-bold"
          onClick={() => navigate('/demande-acte')}
        >Demande d'Acte d'Etat Civil</a>
        </div>
        <div className="navbar-end">
          <button
          onClick={() => navigate('/userNotif')}
          >
            <NotificationsIcon fontSize="large" />
          </button>
          
        </div>
      </div>



    {/* Main Content */}
    <div className="container mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Remplissez le formulaire ci-dessous</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Acte Demandé */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Acte Demandé</span>
          </label>
          <select
            className="select select-bordered"
            name="actDemand"
            value={formData.actDemand}
            onChange={handleChange}
            required
          >
            <option value="BORN">Naissance</option>
            <option value="DEATH">Décès</option>
            <option value="WEDDING">Mariage</option>
          </select>
        </div>
  
        {/* Numéro d'Acte */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Numéro d'Acte</span>
          </label>
          <input
            type="text"
            placeholder="Numéro d'Acte"
            className="input input-bordered"
            name="numActe"
            value={formData.numActe}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Province */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Province</span>
          </label>
          <select
            className="select select-bordered"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          >
            <option value="ANTANANARIVO">Antananarivo</option>
            <option value="TOAMASINA">Toamasina</option>
            <option value="TOLIARA">Toliara</option>
            <option value="ANTSIRANANA">Antsiranana</option>
            <option value="MAHAJANGA">Mahajanga</option>
          </select>
        </div>
  
        {/* Commune */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Commune</span>
          </label>
          <input
            type="text"
            placeholder="Commune"
            className="input input-bordered"
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Date de Naissance */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date de Naissance</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Nom */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nom</span>
          </label>
          <input
            type="text"
            placeholder="Nom"
            className="input input-bordered"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Prénom */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Prénom</span>
          </label>
          <input
            type="text"
            placeholder="Prénom"
            className="input input-bordered"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Lieu de Naissance */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text">Lieu de Naissance</span>
          </label>
          <input
            type="text"
            placeholder="Lieu de Naissance"
            className="input input-bordered"
            name="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={handleChange}
            required
          />
        </div>
  
        {/* Fichiers */}
        <div className="form-control col-span-2">
          <label className="label">
            <span className="label-text">Fichiers (Optionnel)</span>
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="file-input file-input-bordered"
          />
        </div>
  
        {/* Submit Button */}
        <div className="form-control col-span-3">
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Envoi en cours...' : 'Soumettre'}
          </button>
        </div>
      </form>
      
      {message && <p className="text-center text-secondary mt-4">{message}</p>}
    </div>
  </div>
    );
};

export default DemandForm;
