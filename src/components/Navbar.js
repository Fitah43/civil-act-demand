import React from 'react';
import { Link } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { UserCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import CrudAdmin from './CrudAdmin';


function Navbar() {
  return (
    <>
      <div className="navbar bg-base-300 flex justify-between px-4">
        <div className="navbar-start">
          <h1 className="text-xl font-bold">Gestion des Actes</h1>
        </div>
        <div className="navbar-end">
          <Link to="/admin/notifDash" className="btn btn-ghost">
            <NotificationsIcon fontSize="large" />
          </Link>
        </div>
      </div>

      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content ">
          {/* Content principal ici */}
          <CrudAdmin />

        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" aria-label="close sidebar"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
  <li>
    <Link 
      to="/admin/Navbar" 
       className="block px-4 py-2 rounded hover:bg-gray-200 text-gray-800 hover:text-gray-900 no-underline"
    >
       {/* <UserCircleIcon className="h-5 w-5 text-gray-800" /> */}
       <span>Créer Admin</span>
    </Link>
  </li>
  <li>
    <Link 
      to="/admin/ActeDash" 
      className="block px-4 py-2 rounded hover:bg-gray-200 text-gray-800 hover:text-gray-900 no-underline"
    >
      {/* <DocumentTextIcon className="h-5 w-5 text-gray-800" /> */}
      <span>

        Créer Acte</span>
    </Link>
  </li>
</ul>

        </div>
      </div>
    </>
  );
}

export default Navbar;
