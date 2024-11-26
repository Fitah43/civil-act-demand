import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table,MenuItem,Select, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);


function ListActes({ status }) {
    const [actes, setActes] = useState([]);
    const [selectedActe, setSelectedActe] = useState(null);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [acteToDelete, setActeToDelete] = useState(null);
    const [scrollPosition,setScrollPosition] = useState(0);


    // Champs de mise à jour
    const [numActe, setNumActe] = useState('');
    const [typeActe, setTypeActe] = useState('');
    const [province, setProvince] = useState('');
    const [nameCommune, setNameCommune] = useState('');
    const [nameCit, setNameCit] = useState('');
    const [firstNameCit, setFirstNameCit] = useState('');
    const [dateOB, setDateOB] = useState('');
    const [placeOB, setPlaceOB] = useState('');
    const [delivrance, setDelivrance] = useState('');
    const [father, setFather] = useState('');
    const [mother, setMother] = useState('');
    const [files, setFiles] = useState([]);
    const [test, setTest] = useState([]);

    const handleOpenModal = () => {
        setScrollPosition(window.scrollY);
        document.body.style.overflow = 'hidden';
    }

    const handleCloseModal = () => {
        // Restaurer la position
        document.body.style.overflow = 'auto'; // Réactiver le scroll
        window.scrollTo(0, scrollPosition);
    };

    useEffect(() => {
        fetchActes();
    }, []);

    const fetchActes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers['authorizations'] = `Bearer ${token}`;
            }
            const response = await axios.get('http://localhost:3005/api/act/lists');
           
            setActes(response.data.act);
        //    if(response.data && response.data.act){
        //    }else{
        //     setActes([]);
        //    }
        } catch (error) {
            console.error('Erreur lors du chargement des actes', error);
            setActes([]);
        }
    };

    if (status) {
        fetchActes();
    }

    const openUpdateModal = (acte) => {
        setSelectedActe(acte);
        setNumActe(acte.numAct);
        setTypeActe(acte.typeActe);
        setProvince(acte.province);
        setNameCommune(acte.nameCommune);
        setNameCit(acte.nameCit);
        setFirstNameCit(acte.firstNameCit);
        setDateOB(new Date(acte.dateOB).toISOString().split("T")[0]);
        setPlaceOB(acte.placeOB);
        setDelivrance(new Date(acte.delivrance).toISOString().split("T")[0]);
        setFather(acte.father);
        setMother(acte.mother);
        setFiles(acte.fileActe);
        setTest(acte.fileActe);
        setOpenUpdateDialog(true);
    };

    const formatISODate = (dateInput) => {
        const date = new Date(dateInput);
        return date.toISOString();
    };

    const handleUpdate = async (updatedActeData) => {
        const formDataSend = new FormData();
        Object.keys(updatedActeData).forEach((key) => {
            if (key === 'dateOB' || key === 'delivrance') {
                formDataSend.append(key, formatISODate(updatedActeData[key]));
            } else {
                formDataSend.append(key, updatedActeData[key]);
            }
        });
        if (files !== test) {
            Array.from(files).forEach((file) => {
                formDataSend.append('files', file);
            });
        }
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers['authorizations'] = `Bearer ${token}`;
            }
            await axios.put('http://localhost:3005/api/act/update', formDataSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            setOpenUpdateDialog(false);
            fetchActes();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l’acte", error);
        }
    };

    // const confirmDelete = (numAct) => {
    //     setActeToDelete(numAct);
    //     setOpenDeleteDialog(true);
    // };

    const confirmDelete = (numAct) => {
        MySwal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(numAct);
            }
        });
    };
    

    const handleDelete = async (numAct) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers['authorizations'] = `Bearer ${token}`;
            }
            await axios.delete('http://localhost:3005/api/act/delete', { data: { numAct } });
            // : acteToDelete
            // setOpenDeleteDialog(false);
            // setActeToDelete(null);
            MySwal.fire('Supprimé !', 'L’acte a été supprimé avec succès.', 'success');
            fetchActes();
        } catch (error) {
            console.error("Erreur lors de la suppression de l’acte", error);
            MySwal.fire('Erreur', "Impossible de supprimer l’acte.", 'error');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Liste des Actes</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Numéro d'Acte</th>
                            <th>Type d'Acte</th>
                            <th>Province</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Délivrance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {Array.isArray(actes) && actes.length > 0 ? ( */}
                       { actes.map((acte) => (
                            <tr key={acte.numAct}>
                                <td>{acte.numAct}</td>
                                <td>{acte.typeActe}</td>
                                <td>{acte.province}</td>
                                <td>{acte.nameCit}</td>
                                <td>{acte.firstNameCit}</td>
                                <td>{new Date(acte.delivrance).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm mr-2"
                                        onClick={() => openUpdateModal(acte)}
                                    >
                                        Mettre à jour
                                    </button>
                                    <button
                                        className="btn btn-error btn-sm"
                                        onClick={() => confirmDelete(acte.numAct)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    // )
                    //  : (
                    //     <tr>
                    //         <td colSpan="7">ghdhdfg</td>
                    //     </tr>
                    // )
                    }
                    </tbody>
                </table>
            </div>

            {/* Modal Mise à Jour */}
            <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
                <DialogTitle>Mise à jour de l'Acte</DialogTitle>
                <DialogContent>
                    <TextField label="Numéro d'Acte" value={numActe} onChange={(e) => setNumActe(e.target.value)} fullWidth margin="normal" />
                    <TextField
                    select
                    label="Type d'Acte"
                    value={typeActe}
                    onChange={(e) => setTypeActe(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="BORN">Naissance</MenuItem>
                    <MenuItem value="DEATH">Décès</MenuItem>
                    <MenuItem value="WEDDING">Mariage</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="ANTANANARIVO">Antananarivo</MenuItem>
                    <MenuItem value="TOAMASINA">Toamasina</MenuItem>
                    <MenuItem value="TOLIARA">Toliara</MenuItem>
                    <MenuItem value="ANTSIRANANA">Antsiranana</MenuItem>
                    <MenuItem value="MAHAJANGA">Mahajanga</MenuItem>
                </TextField>

                    <TextField label="Nom de la Commune" value={nameCommune} onChange={(e) => setNameCommune(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Nom du Citoyen" value={nameCit} onChange={(e) => setNameCit(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Prénom du Citoyen" value={firstNameCit} onChange={(e) => setFirstNameCit(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Date de Naissance" type="date" value={dateOB} onChange={(e) => setDateOB(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Lieu de Naissance" value={placeOB} onChange={(e) => setPlaceOB(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Date de Délivrance" type="date" value={delivrance} onChange={(e) => setDelivrance(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Nom du Père" value={father} onChange={(e) => setFather(e.target.value)} fullWidth margin="normal" />
                    <TextField label="Nom de la Mère" value={mother} onChange={(e) => setMother(e.target.value)} fullWidth margin="normal" />           
                     <img 
                     src={`data:image/png;base64,${files}`}
                     alt='file actuel' />
              <input type="file" name="files" onChange={(e) => setFiles(e.target.files)} multiple required style={{ marginTop: 16 }} />

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdateDialog(false)} color="secondary">Annuler</Button>
                    <Button onClick={() => handleUpdate({
                        numAct: numActe,
                        typeActe: typeActe,
                        province: province,
                        nameCommune: nameCommune,
                        nameCit: nameCit,
                        firstNameCit: firstNameCit,
                        dateOB: dateOB,
                        placeOB: placeOB,
                        delivrance: delivrance,
                        father: father,
                        mother: mother,
                    })} color="primary">Mettre à jour</Button>
                </DialogActions>
            </Dialog>


            {/* Modal Confirmation Suppression */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <Typography>Êtes-vous sûr de vouloir supprimer cet acte ?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">Annuler</Button>
                    <Button onClick={handleDelete} color="primary">Supprimer</Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default ListActes;
