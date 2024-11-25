import React, { useState,useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, TextField, Alert, DialogActions } from '@mui/material';
import AdminList from './AdminList';
import AdminDashboard from './AdminDashboard'

// Schéma de validation
const SignUpAdminSchema = Yup.object().shape({
    name: Yup.string().required('Nom requis'),
    first_name: Yup.string().required('Prénom requis'),
    email: Yup.string().email('Email invalide').required('Email requis'),
    password: Yup.string().min(6, 'Le mot de passe doit faire au moins 6 caractères').required('Mot de passe requis'),
    role: Yup.string().required('Le rôle est requis').oneOf(['admin'], 'Le rôle doit être "admin"'),
});

function SignUpAdmin() {
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState(null);
    const [admins, setAdmins] = useState([]); // État pour gérer la liste des admins
    const [isclick, setIsClick] = useState(false)

    const handleOpenModal = () =>{
        setOpenModal(true);
        setIsClick(true);
        
    }
    const handleCloseModal = () =>{
        setOpenModal(false);
        setIsClick(false);
    }

  
    
 
    // // const fetchAdmins = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         if (token) {
    //             axios.defaults.headers['authorizations'] = `Bearer ${token}`;
    //         }
    //         const response = await axios.get('http://localhost:3005/api/admin/lists');
            
    //         if (response.data && Array.isArray(response.data.admin)) {
    //             setAdmins(response.data.admin);
    //             console.log(response.data.admin);
    //              // Mettre à jour avec le tableau des administrateurs
    //         }
    //     } catch (error) {
    //         console.error('Erreur lors du chargement des administrateurs', error);
    //     }
    // };


    const handleSubmit = async (values) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers['authorizations'] = `Bearer ${token}`;
            }
            const response = await axios.post('http://localhost:3005/api/admin/create', values);
            setMessage({ type: 'success', text: response.data.msg });
            setIsClick(true)

            // Ajout de l'administrateur à la liste immédiatement après sa création
            setAdmins((prevAdmins) => [
                ...prevAdmins,
                { email_admin: values.email, name_admin: values.name, first_name_admin: values.first_name } // Adaptez cette structure selon la réponse de votre API
            ]);
            // fetchAdmins(); 
            handleCloseModal(); // Ferme le modal après l'ajout

        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Erreur lors de la création de l’administrateur.';
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    return (
        <>
        {/* <AdminDashboard/> */}
      {/* <div style={{ marginTop: '-10px', marginLeft: '280px' }}> */}
        <div style={{ marginTop: '40px', marginLeft: '40px' }}>  
            {/* Bouton pour ouvrir la modal */}
            <button
                className="btn btn-primary btn-sm mr-2"
                onClick={handleOpenModal}
                sx={{ mb: 3 }} // Ajoute un peu de marge en bas du bouton
            >
                Créer Admin
            </button>

            {/* Modal pour le formulaire d'inscription */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
                <DialogTitle>Inscription Admin</DialogTitle>
                <DialogContent>
                    {message && (
                        <Alert severity={message.type} sx={{ mb: 2 }}>
                            {message.text}
                        </Alert>
                    )}
                    <Formik
                        initialValues={{ name: '', first_name: '', email: '', password: '', role: 'admin' }}
                        validationSchema={SignUpAdminSchema}
                        onSubmit={(values) => {
                            handleSubmit(values);
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    name="name"
                                    label="Nom"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                                <Field
                                    as={TextField}
                                    name="first_name"
                                    label="Prénom"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.first_name && Boolean(errors.first_name)}
                                    helperText={touched.first_name && errors.first_name}
                                />
                                <Field
                                    as={TextField}
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                                <Field
                                    as={TextField}
                                    name="password"
                                    label="Mot de passe"
                                    type="password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                
                                <DialogActions>
                                    <Button onClick={handleCloseModal} color="secondary">
                                        Annuler
                                    </Button>
                                    <button type="submit" 
                                      className="btn btn-primary btn-sm mr-2"
                                    >
                                        S'inscrire
                                    </button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            {/* Liste des administrateurs */}
            <AdminList isclick={isclick} admins={admins} />
        </div>
        </>
    );
}

export default SignUpAdmin;
