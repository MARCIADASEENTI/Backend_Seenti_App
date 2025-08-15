// src/whiteLabel/layouts/WhiteLabelLayout.jsx
import React from 'react';
import { brand } from '../config/brandConfig.js';
import './WhiteLabelLayout.css';

const WhiteLabelLayout = ({ children }) => {
  const layoutStyle = {
    '--primary-color': brand.primaryColor,
    '--secondary-color': brand.secondaryColor,
  };

  return (
    <div className="white-label-layout" style={layoutStyle}>
      <img 
        src={brand.logo} 
        alt={`${brand.name} logo`} 
        className="white-label-logo"
        onError={(e) => {
          console.error('❌ Erro ao carregar logo no WhiteLabelLayout:', brand.logo);
        }}
      />

      <main className="white-label-main">
        {children}
      </main>

      {/* Rodapé sempre visível com a marca Seenti */}
      <footer className="white-label-footer">
        <span>© {new Date().getFullYear()} Seenti® - Todos os direitos reservados.</span>
      </footer>
    </div>
  );
};

export default WhiteLabelLayout;
