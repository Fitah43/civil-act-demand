import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Schéma de validation pour les informations de l'administrateur
const AdminSignUpSchema = Yup.object().shape({
    name: Yup.string().required('Nom requis'),
    first_name: Yup.string().required('Prénom requis'),
    email: Yup.string().email('Email invalide').required('Email requis'),
    password: Yup.string().min(6, 'Le mot de passe doit faire au moins 6 caractères').required('Mot de passe requis'),
});

function AdminSignUp() {
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            // Requête POST vers le backend pour créer un administrateur
            const response = await axios.post('http://localhost:3005/api/admin/signUp', values);
            setMessage({ type: 'success', text: response.data.msg });
            // Redirection vers la page de connexion après succès
            setTimeout(() => {
                navigate('/admin/login');
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.msg || "Erreur lors de la création de l'administrateur.";
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{
                    marginTop: 8,
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    width: '100%',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Inscription Admin
                </Typography>
                {message && (
                    <Alert severity={message.type} sx={{ mb: 2 }}>
                        {message.text}
                    </Alert>
                )}
                <Formik
                    initialValues={{ name: '', first_name: '', email: '', password: '' }}
                    validationSchema={AdminSignUpSchema}
                    onSubmit={handleSubmit}
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
                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                S'inscrire
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Container>
    );
}

export default AdminSignUp;
