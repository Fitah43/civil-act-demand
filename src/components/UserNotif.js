import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const UserNotif = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const [empty, setEmpty] = useState("");

  const fetchDemands = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "Utilisateur non authentifié. Veuillez vous connecter."
        );
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      const response = await fetch(
        "http://localhost:3005/api/demand/notificationUser",
        {
          headers: {
            authorizations: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.message || "Erreur lors de la récupération des demandes."
        );
      }

      const result = await response.json();
      if (!result.demands) {
        setEmpty("vous n'avez pas encore fait une demande");
      } else {
        const notifUniqUser = result.demands.filter(
          (demand) => demand.emailUser === userId
        );
        setEmpty("");
        setSelectedDemand(notifUniqUser);
      }
    } catch (err) {
      setError(err.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDemands();
  }, []);

  const handleOpenModal = (demand) => {
    setSelectedDemand(demand);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDemand(null);
    setFile(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmitUpdate = async () => {
    if (!file || !selectedDemand) return;

    const formData = new FormData();
    formData.append("idDemande", selectedDemand.id); // ID de la demande
    // formData.append('status', selectedDemand.status); // Gardez le statut inchangé
    formData.append("files", file); // Nouveau fichier

    try {
      const response = await fetch("http://localhost:3005/api/demand/update", {
        method: "PUT",
        headers: {
          authorizations: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(
          result.message || "Erreur lors de la mise à jour de la demande."
        );
      }

      // alert('Fichier envoyé avec succès.');
      handleCloseModal();
      MySwal.fire(
        "envoyée !",
        "Le capture de payement a été envoyée avec succès.",
        "success"
      );
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box>
      <div className="navbar bg-base-300 flex justify-between px-4">
        <div className="navbar-start">
          <a
            className="btn btn-ghost normal-case text-xl font-bold"
            onClick={() => navigate("/demande-acte")}
          >
            Demande d'Acte d'État Civil
          </a>
        </div>
        <div className="navbar-end">
          <IconButton onClick={() => navigate("/userNotif")}>
            <NotificationsIcon fontSize="large" />
          </IconButton>
        </div>
      </div>

      <Typography variant="h5" align="center" gutterBottom>
        Mes Demandes
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", mt: 3 }} />
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : demands.length === 0 || empty ? (
        <h2 style={{ textAlign: "center" }}>{empty}</h2>
      ) : (
        <List>
          {demands.map((demand) => (
            <ListItem
              key={demand.id}
              sx={{ borderBottom: "1px solid #fff", cursor: "pointer" }}
              onClick={() =>
                demand.status === "ACCEPTE" && handleOpenModal(demand)
              }
            >
              <ListItemText
                primary={`Demande ID: ${demand.id}`}
                secondary={`Type: ${demand.actDemand}, État: ${demand.status}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Mettre à jour la demande</DialogTitle>
        <DialogContent>
          <Typography>ID de la demande: {selectedDemand?.id}</Typography>
          <TextField
            type="file"
            fullWidth
            onChange={handleFileChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Annuler</Button>
          <Button
            onClick={handleSubmitUpdate}
            variant="contained"
            color="primary"
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserNotif;
