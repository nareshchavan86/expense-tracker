import React from 'react';
import { LayoutDashboard, Film, List, Users, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white p-4 flex flex-col">
      <div className="text-2xl font-bold mb-8 text-blue-500">OTT Admin</div>
      <nav className="flex-1 space-y-2">
        <Link to="/dashboard" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
          <LayoutDashboard className="mr-3" /> Dashboard
        </Link>
        <Link to="/movies" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
          <Film className="mr-3" /> Movies
        </Link>
        <Link to="/categories" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
          <List className="mr-3" /> Categories
        </Link>
        <Link to="/users" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
          <Users className="mr-3" /> Users
        </Link>
        <Link to="/settings" className="flex items-center p-3 hover:bg-gray-800 rounded transition">
          <Settings className="mr-3" /> Settings
        </Link>
      </nav>
      <button onClick={handleLogout} className="flex items-center p-3 text-red-400 hover:bg-gray-800 rounded transition">
        <LogOut className="mr-3" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
