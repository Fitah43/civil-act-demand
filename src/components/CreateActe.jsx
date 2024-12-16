import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ListActes from "./ListActes";

const App = () => {
  const [formData, setFormData] = useState({
    numAct: "",
    typeActe: "",
    province: "",
    nameCommune: "",
    nameCit: "",
    firstNameCit: "",
    dateOB: "",
    placeOB: "",
    delivrance: "",
    father: "",
    mother: "",
  });
  const [files, setFiles] = useState([]);
  const [openModal, setOpenModal] = useState(false); // Contrôle de l'ouverture de la modal
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [actes, setActes] = useState([]); // Stocke la liste des actes
  const [status, setStatus] = useState(false);

  // Gérer les changements dans les champs de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gérer le changement de fichiers
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Formater la date en ISO pour l'envoyer au backend
  const formatISODate = (dateInput) => {
    const date = new Date(dateInput);
    return date.toISOString();
  };

  // Fonction pour ajouter un acte à la liste des actes
  const addActe = (newActe) => {
    setActes((prevActes) => [...prevActes, newActe]);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "dateOB" || key === "delivrance") {
        formDataToSend.append(key, formatISODate(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    Array.from(files).forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3005/api/act/create", {
        method: "POST",
        headers: {
          authorizations: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      console.log(response);

      const result = await response.json();
      if (response.status === 200) {
        // Ajouter le nouvel acte à la liste des actes
        addActe(result.acte);
      } else {
        alert("Erreur lors de la création de l'acte");
        console.error(result.err);
      }
      setStatus(true);
    } catch (error) {
      console.error("Erreur de requête :", error);
    } finally {
      setLoading(false);
      setOpenModal(false); // Fermer la modal après la soumission
    }
  };

  // Ouvrir la modal
  const handleOpen = () => {
    setOpenModal(true);
  };
  const newStatus = (status) => {
    setStatus(status);
  };
  // Fermer la modal
  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      {/* <AdminDashboard /> */}
      {/* <div style={{ marginTop: '-10px', marginLeft: '280px' }}> */}
      <div style={{ marginTop: "40px", marginLeft: "40px" }}>
        <button className="btn btn-primary btn-sm mr-2" onClick={handleOpen}>
          Créer un Acte
        </button>

        <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Créer un Acte</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <TextField
                label="Numéro d'Acte"
                name="numAct"
                value={formData.numAct}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Type d'Acte</InputLabel>
                <Select
                  name="typeActe"
                  value={formData.typeActe}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="BORN">Naissance</MenuItem>
                  <MenuItem value="DEATH">Décès</MenuItem>
                  <MenuItem value="WEDDING">Mariage</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Province</InputLabel>
                <Select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="ANTANANARIVO">Antananarivo</MenuItem>
                  <MenuItem value="TOLIARA">Toliara</MenuItem>
                  <MenuItem value="TOAMASINA">Toamasina</MenuItem>
                  <MenuItem value="FIANARANTSOA">Fianarantsoa</MenuItem>
                  <MenuItem value="ANTSIRANANA">Antsiranana</MenuItem>
                  <MenuItem value="MAHAJANGA">Mahajanga</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Commune"
                name="nameCommune"
                value={formData.nameCommune}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Nom du Citoyen"
                name="nameCit"
                value={formData.nameCit}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Prénom du Citoyen"
                name="firstNameCit"
                value={formData.firstNameCit}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Date de Naissance"
                name="dateOB"
                type="date"
                value={formData.dateOB}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                label="Lieu de Naissance"
                name="placeOB"
                value={formData.placeOB}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Date de Délivrance"
                name="delivrance"
                type="date"
                value={formData.delivrance}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
              <TextField
                label="Nom du Père"
                name="father"
                value={formData.father}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Nom de la Mère"
                name="mother"
                value={formData.mother}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />

              <input
                type="file"
                name="files"
                onChange={handleFileChange}
                multiple
                style={{ marginTop: 16 }}
              />

              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Annuler
                </Button>
                <Button type="submit" color="primary" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Créer Acte"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        <ListActes status={status} onClick={newStatus} actes={actes} />
      </div>
    </>
  );
};

export default App;
