import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        padding: "10px 30px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        transition: "background-color 0.3s",
        ":hover": {
          backgroundColor: "#d32f2f",
        },
      }}
    >
      Sign Out
    </button>
  );
};

const SettingsPage = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h3 style={{ color: "#ffff", paddingLeft: "30px" }}>
          Settings
        </h3>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        padding: '20px',
        marginTop: '60px',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div style={{
          background: '#2d2d2d',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          height: '150px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '300px',
          margin: '0 auto'
        }}>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;