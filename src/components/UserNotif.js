import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrigé : Import sans accolades
import {
  Typography, List, ListItem, ListItemText, CircularProgress, Box, IconButton,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const UserNotif = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        // Vérifie la présence du token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Utilisateur non authentifié. Veuillez vous connecter.');
        }

        // Décoder le token JWT
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user_id;

        // Appeler l'API pour récupérer les demandes
        const response = await fetch('http://localhost:3005/api/demand/notificationUser', {
          headers: {
            authorizations: `Bearer ${token}`, 
          },
        });

        

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || 'Erreur lors de la récupération des demandes.');
        }

        const result = await response.json();
        console.log(result.demands.length);
        console.log(userId)
      
        const notifUniqUser = [...result.demands].filter(demand => demand.emailUser ===userId)
        setDemands(notifUniqUser);
      } catch (err) {
        setError(err.message || 'Erreur réseau');
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();
  }, []);

  return (
    <Box >
      <div className="navbar bg-base-300 flex justify-between px-4">
        <div className="navbar-start">
          <a
            className="btn btn-ghost normal-case text-xl font-bold"
            onClick={() => navigate('/demande-acte')}
          >
            Demande d'Acte d'État Civil
          </a>
        </div>
        <div className="navbar-end">
          <IconButton onClick={() => navigate('/userNotif')}>
            <NotificationsIcon fontSize="large" />
          </IconButton>
        </div>
      </div>

      <Typography variant="h5" align="center" gutterBottom>
        Mes Demandes
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 3 }} />
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : demands.length === 0 ? (
        <Typography align="center">Aucune demande trouvée.</Typography>
      ) : (
        <List>
          {demands.map((demand) => (
            <ListItem key={demand.id} sx={{ borderBottom: '1px solid #ddd' }}>
              <ListItemText
                primary={`Demande ID: ${demand.id}`}
                secondary={`Type: ${demand.actDemand}, État: ${demand.status}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UserNotif;
