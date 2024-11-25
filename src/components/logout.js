export const logout = () => {
    // Suppression du token d'authentification (ou autre donnée de session)
    localStorage.removeItem('token'); // Assurez-vous que le nom de l'item est correct
    // Redirigez vers la page de connexion
    window.location.href = '/'; // Modifiez cette URL si nécessaire
};