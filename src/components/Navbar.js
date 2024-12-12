import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { UserCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import CrudAdmin from './CrudAdmin';
import { Badge } from '@mui/material';
import logo from '../images/logo.png';

function Navbar() {
  const [notif,setNotif] = useState(0)

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers["authorizations"] = `Bearer ${token}`;
      }
      const response = await axios.get("http://localhost:3005/api/demand/notificationAdmin");
      const notifLen = response.data.data
      setNotif(notifLen.length);      
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  useEffect(()=>{
    fetchNotifications()
    const interval = setInterval(()=>{      
      fetchNotifications()
    },1000)
    return ()=> clearInterval(interval)
  },[])

  return (
    <>
     <div className="flex">
  {/* Sidebar */}
  <aside className="fixed top-0 left-0 h-screen w-64 bg-base-200 shadow-lg">
      {/* Image at the top of the sidebar */}
      <div className="p-4">
        <img 
          src={logo}  // Remplacez par le lien de votre image
          alt="Logo"
          className="w-full h-auto rounded-lg"  // Ajoutez des classes pour ajuster la taille
        />
      </div>
    <ul className="menu p-4 text-base-content">
      <li>
        <Link 
          to="/admin/Navbar" 
          className="block px-4 py-2 rounded hover:bg-gray-200 text-gray-800 hover:text-gray-900 no-underline"
        >
          <span>Créer Admin</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/admin/ActeDash" 
          className="block px-4 py-2 rounded hover:bg-gray-200 text-gray-800 hover:text-gray-900 no-underline"
        >
          <span>Créer Acte</span>
        </Link>
      </li>
    </ul>
  </aside>

  {/* Main Content */}
  <div className="flex-1 ml-64">
    {/* Navbar */}
    {/* <div className="navbar bg-base-300 flex justify-between px-4 fixed top-0 right-0 w-[calc(100%-16rem)] z-40"> */}
    <div className="navbar bg-base-300 flex justify-between px-4">
      <div className="navbar-start">
        <h1 className="text-xl font-bold">Gestion des Actes</h1>
      </div>
      <div className="navbar-end">
        <Link to="/admin/notifDash" className="btn btn-ghost">
          <Badge badgeContent={notif} color="error" className="!z-10">
            <NotificationsIcon fontSize="large" />
          </Badge>
        </Link>
      </div>
    </div>

    {/* Page Content */}
    <div className="pt-0 px-0">
      <CrudAdmin />
    </div>
  </div>
</div>

    </>
  );
}

export default Navbar;
