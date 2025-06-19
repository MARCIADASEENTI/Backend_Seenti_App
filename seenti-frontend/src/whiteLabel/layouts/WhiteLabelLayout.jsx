// src/whiteLabel/layouts/WhiteLabelLayout.jsx
import React from 'react';
import { brand } from '../config/brandConfig.js';

const WhiteLabelLayout = ({ children }) => {
  const layoutStyle = {
    fontFamily: brand.fontFamily,
    backgroundColor: brand.secondaryColor,
    color: brand.primaryColor,
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const logoStyle = {
    width: '150px',
    marginBottom: '1rem',
  };

  return (
    <div style={layoutStyle}>
      <img src={brand.logo} alt={`${brand.name} logo`} style={logoStyle} />
      <main style={{ width: '100%', maxWidth: '600px' }}>
        {children}
      </main>
    </div>
  );
};

export default WhiteLabelLayout;
