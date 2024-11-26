import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers["authorizations"] = `Bearer ${token}`;
      }
      const response = await axios.get("http://localhost:3005/api/demand/notificationAdmin");
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  const handleOpenModal = (notif) => {
    setSelectedNotification(notif);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNotification(null);
  };

  const handleDecision = async (decision) => {
    try {
        if (selectedNotification) {
            const token = localStorage.getItem("token");
            // Créer un objet headers
            const headers = {
                'Content-Type': 'application/json',
            };

            // Si un token est présent, l'ajouter à l'en-tête Authorization
            if (token) {
                headers["authorizations"] = `Bearer ${token}`;
            }

            const data = {
                idDemande: selectedNotification.id, // Utiliser l'ID de la demande
                status: decision, // Mettre à jour le statut ("REFUSE" ou "ACCEPTE")
            };
            console.log(headers);
            
            // Effectuer la requête PUT pour mettre à jour le statut
            const response = await fetch('http://localhost:3005/api/demand/update', {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(data), // Passer les données avec le statut mis à jour
            });

            if (!response.ok) {
                throw new Error('La mise à jour a échoué');
            }

            const result = await response.json();
            // Gérer la réponse du serveur ici
            console.log(result);
            fetchNotifications(); // Rafraîchir les notifications après l'action
        }
    } catch (err) {
        console.error(err);
    } finally {
        handleCloseModal(); // Fermer le modal après la mise à jour
    }
};


  return (
    <>
      <div style={{ marginTop: "40px", marginLeft: "40px" }}>
        <h1>Voici les demandes non traitées :</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              onClick={() => handleOpenModal(notif)}
              style={{
                cursor: "pointer",
                width: "300px",
                border: "1px solid #ddd",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Nouvelle Demande d'Acte
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Utilisateur : ${notif.emailUser}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Type d'acte : ${notif.actDemand}`}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {`Numéro d'acte : ${notif.numActe}`}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Voir Détails
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>

        {/* Modal pour afficher les détails */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Détails de la Demande</DialogTitle>
          <DialogContent>
            {selectedNotification && (
              <>
                <Typography>{`ID de la demande: ${selectedNotification.id}`}</Typography>
                <Typography>{`Utilisateur: ${selectedNotification.emailUser}`}</Typography>
                <Typography>{`Type d'acte: ${selectedNotification.actDemand}`}</Typography>
                <Typography>{`Numéro d'acte: ${selectedNotification.numActe}`}</Typography>
                <Typography>{`Province: ${selectedNotification.province}`}</Typography>
                <Typography>{`Commune: ${selectedNotification.commune}`}</Typography>
                <Typography>{`Date de naissance: ${selectedNotification.dateOfBirth}`}</Typography>
                <Typography>{`Lieu de naissance: ${selectedNotification.placeOfBirth}`}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDecision("REFUSE")} color="error">
              Refuser
            </Button>
            <Button onClick={() => handleDecision("ACCEPTE")} color="primary">
              Approuver
            </Button>
            <Button onClick={handleCloseModal} color="secondary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default Notification;