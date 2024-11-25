import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Container, Box, Typography } from '@mui/material';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        console.log(true);
        
      const response = await axios.post('http://localhost:3005/api/login', { 
        email, 
        password 
      });
      localStorage.setItem('token', response.data.token);
      console.log('Token:', response.data.token);
      navigate('/demande-acte');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || 'Error logging in');
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
                    Utilisateur
                </Typography>
                   <TextField  label="Email"  variant="outlined" 
                     value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   fullWidth margin="normal" />
                <TextField label="Mot de passe" 
                  value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" variant="outlined" fullWidth margin="normal" />
                <Button type='submit' variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>

                 {/* Lien pour rediriger vers le formulaire de SignUp */}
          <Typography variant="body2" sx={{ mt: 2 }}>
            Vous n'avez pas de compte ?{' '}
            <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
              S'inscrire
            </Link>
          </Typography>
            </Box>
        </Container>
    </form>
    
  );
};

export default Login;
