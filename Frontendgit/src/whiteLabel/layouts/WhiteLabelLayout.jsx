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
    justifyContent: 'space-between',
  };

  const logoStyle = {
    width: '150px',
    marginBottom: '1rem',
  };

const footerStyle = {
  marginTop: '3rem',     // Substitui o "auto" e sobe o rodapé
  fontSize: '0.8rem',
  opacity: 0.7,
  paddingTop: '1rem',    // Pode reduzir se quiser o espaçamento mais compacto
};


  return (
    <div style={layoutStyle}>
      <img src={brand.logo} alt={`${brand.name} logo`} style={logoStyle} />

      <main style={{ width: '100%', maxWidth: '500px' }}>
        {children}
      </main>

      {brand.name === 'Seenti' && (
        <footer style={footerStyle}>
          <span>© {new Date().getFullYear()} Seenti® - Todos os direitos reservados.</span>
        </footer>
      )}
    </div>
  );
};

export default WhiteLabelLayout;
