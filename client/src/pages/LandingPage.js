import React from 'react';
import logo from '../assets/logo.png'; // make sure logo.png is in src/assets/

const LandingPage = () => {
  
  return (
    <div
      style={{
        backgroundcolor:'powderblue',
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '85vh',
        width: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#121d24',
        textShadow: '2px 2px 6px #000',
        flexDirection: 'column',
      }}
    >
    </div>
  );
};

export default LandingPage;