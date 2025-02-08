import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom'; // Changed from Link to NavLink
import { ThemeContext } from '../context/ThemeContext';
import { FaHome, FaCamera, FaHistory, FaMoon, FaSun } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
          end
        >
          <FaHome className="nav-icon" />
          <span>Home</span>
        </NavLink>
        <NavLink 
          to="/camera"
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          <FaCamera className="nav-icon" />
          <span>Camera</span>
        </NavLink>
        <NavLink 
          to="/history"
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
        >
          <FaHistory className="nav-icon" />
          <span>History</span>
        </NavLink>
      </div>
      
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? (
          <FaSun className="theme-icon" />
        ) : (
          <FaMoon className="theme-icon" />
        )}
        <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    </nav>
  );
};

export default Navbar;