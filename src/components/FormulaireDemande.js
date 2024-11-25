import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

export default function FormulaireDemande() {
  const [formData, setFormData] = useState({
    actDemand: '',
    emailAdmin: '',
    emailUser: '',
    numACte: '',
    province: '',
    commune: '',
    name: '',
    firstName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
      await axios.post('http://localhost:3005/api/createDemand', data);
      alert('Demande envoyée avec succès');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de la demande");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Demande d'Acte d'État Civil
        </Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField label="Act Demand" name="actDemand" fullWidth margin="normal" value={formData.actDemand} onChange={handleChange} />
          <TextField label="Email Admin" name="emailAdmin" fullWidth margin="normal" value={formData.emailAdmin} onChange={handleChange} />
          <TextField label="Email User" name="emailUser" fullWidth margin="normal" value={formData.emailUser} onChange={handleChange} />
          <TextField label="Numéro d'Acte" name="numACte" fullWidth margin="normal" value={formData.numACte} onChange={handleChange} />
          <TextField label="Province" name="province" fullWidth margin="normal" value={formData.province} onChange={handleChange} />
          <TextField label="Commune" name="commune" fullWidth margin="normal" value={formData.commune} onChange={handleChange} />
          <TextField label="Nom" name="name" fullWidth margin="normal" value={formData.name} onChange={handleChange} />
          <TextField label="Prénom" name="firstName" fullWidth margin="normal" value={formData.firstName} onChange={handleChange} />
          <TextField label="Date de Naissance" name="dateOfBirth" fullWidth margin="normal" type="date" InputLabelProps={{ shrink: true }} value={formData.dateOfBirth} onChange={handleChange} />
          <TextField label="Lieu de Naissance" name="placeOfBirth" fullWidth margin="normal" value={formData.placeOfBirth} onChange={handleChange} />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Télécharger un fichier
            <input type="file" hidden name="file" onChange={handleFileChange} />
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Envoyer la Demande
          </Button>
        </form>
      </Box>
    </Container>
  );
}
