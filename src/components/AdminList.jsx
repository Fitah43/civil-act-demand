import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TextField, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function AdminList({ isclick }) {
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null); // Admin sélectionné pour la mise à jour
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false); // Contrôle l'ouverture du modal de mise à jour
    const [emailAdmin, setEmailAdmin] = useState(''); // Champ de mise à jour (email, non modifiable)
    const [nameAdmin, setNameAdmin] = useState('');
    const [firstNameAdmin, setFirstNameAdmin] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Contrôle l'ouverture du modal de confirmation de suppression
    const [adminToDelete, setAdminToDelete] = useState(null); // Admin à supprimer

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers['authorizations'] = `Bearer ${token}`;
            }
            const response = await axios.get('http://localhost:3005/api/admin/lists');
            if (response.data && Array.isArray(response.data.admin)) {
                setAdmins(response.data.admin); // Mettre à jour avec le tableau des administrateurs
                
            }
        } catch (error) {
            console.error('Erreur lors du chargement des administrateurs', error);
        }
    };

    if (isclick) {
        fetchAdmins();
    }

    // Ouvrir le modal pour la mise à jour de l'admin sélectionné
    const openUpdateModal = (admin) => {
        setSelectedAdmin(admin);
        setEmailAdmin(admin.email_admin); // Email ne peut pas être modifié
        setNameAdmin(admin.name_admin);
        setFirstNameAdmin(admin.first_name_admin);
        setOpenUpdateDialog(true);
    };

    // Fonction pour mettre à jour un administrateur
    const handleUpdate = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers['authorizations'] = `Bearer ${token}`;
            }

            // Mise à jour de l'administrateur
            await axios.put('http://localhost:3005/api/admin/update', updatedData);
            setOpenUpdateDialog(false);
            fetchAdmins(); // Actualiser la liste après mise à jour
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l’administrateur", error);
        }
    };

    // Ouvrir la confirmation de suppression
    // const openDeleteConfirmDialog = (admin) => {
    //     setAdminToDelete(admin);
    //     setOpenDeleteDialog(true);
    // };

    const openDeleteConfirmDialog = (admin) => {
        MySwal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Vous êtes sur le point de supprimer cet administrateur. Cette action est irréversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler',
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete(admin);
            }
        });
    };
    

    const handleDelete = async (admin) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers['authorizations'] = `Bearer ${token}`;
            }
    
            // Suppression de l'administrateur
            await axios.delete('http://localhost:3005/api/admin/delete', {
                data: { email_admin: admin.email_admin },
            });
    
            // Affiche un message de succès
            MySwal.fire('Supprimé !', 'L’administrateur a été supprimé avec succès.', 'success');
            fetchAdmins(); // Actualiser la liste après suppression
        } catch (error) {
            console.error("Erreur lors de la suppression de l’administrateur", error);
            MySwal.fire('Erreur', "Impossible de supprimer l'administrateur.", 'error');
        }
    };
    

    // Fonction pour supprimer un administrateur
    // const handleDelete = async () => {
    //     if (adminToDelete) {
    //         try {
    //             const token = localStorage.getItem('token');
    //             if (token) {
    //                 axios.defaults.headers['authorizations'] = `Bearer ${token}`;
    //             }

    //             // Suppression de l'administrateur par son email
    //             await axios.delete('http://localhost:3005/api/admin/delete', {
    //                 data: { email_admin: adminToDelete.email_admin }
    //             });
                
    //             fetchAdmins(); // Actualiser la liste après suppression
    //             setOpenDeleteDialog(false); // Fermer le modal après suppression
    //         } catch (error) {
    //             console.error("Erreur lors de la suppression de l’administrateur", error);
    //         }
    //     }
    // };


    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Liste des Administrateurs</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin) => (
                            <tr key={admin.email_admin}>
                                <td>{admin.name_admin}</td>
                                <td>{admin.first_name_admin}</td>
                                <td>{admin.email_admin}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm mr-2"
                                        onClick={() => openUpdateModal(admin)}
                                    >
                                        Mettre à jour
                                    </button>
                                    <button
                                        className="btn btn-error btn-sm"
                                        onClick={() => openDeleteConfirmDialog(admin)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de mise à jour */}
            <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
                <DialogTitle>Mise à jour de l'Administrateur</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nom"
                        value={nameAdmin}
                        onChange={(e) => setNameAdmin(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Prénom"
                        value={firstNameAdmin}
                        onChange={(e) => setFirstNameAdmin(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    {/* Le champ email est affiché en lecture seule */}
                    <TextField
                        label="Email"
                        value={emailAdmin}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUpdateDialog(false)} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={() => handleUpdate({ email_admin: emailAdmin, name_admin: nameAdmin, first_name_admin: firstNameAdmin })} color="primary">
                        Mettre à jour
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Modal de confirmation de suppression */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmation de suppression</DialogTitle>
                <DialogContent>
                    <Typography>Êtes-vous sûr de vouloir supprimer cet administrateur ?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default AdminList;
