import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Container, Box, Typography } from '@mui/material';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3005/api/admin/login', { 
                email_admin: email, 
                password ,
                role: 'admin'
            });
            console.log('Token:', response); // Log du token reçu
            localStorage.setItem('token', response.data.admin_token);
            // Ici, vous pouvez sauvegarder le token dans le localStorage ou le state global
            navigate('/admin/Navbar'); // Redirection vers le tableau de bord admin
        } catch (error) {
            console.error('Error logging in:', error || 'Erreur lors de la connexion');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <Container maxWidth="xs">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        marginTop: 15,
                        padding: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Connexion Admin
                    </Typography>
                    <TextField
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button type='submit' variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Connexion
                    </Button>

                  
                </Box>
            </Container>
        </form>
    );
};

export default AdminLogin;
