// src/components/cliente/HeaderPerfil.jsx
import React from 'react';
import { FaUserCircle, FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';

const SEENTI_PRIMARY_COLOR = '#54AEFE'; // cor da barra

export default function HeaderPerfil({ cliente, mostrarDados, onToggleDados }) {
  const buttonStyle = {
    backgroundColor: SEENTI_PRIMARY_COLOR,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    transition: 'color 0.3s ease',
  };

  return (
    <header
      className="flex items-center justify-between p-4"
      style={{ backgroundColor: SEENTI_PRIMARY_COLOR }}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleDados}
          aria-label={mostrarDados ? 'Ocultar dados pessoais' : 'Mostrar dados pessoais'}
          title={mostrarDados ? 'Ocultar dados pessoais' : 'Mostrar dados pessoais'}
          style={buttonStyle}
          onMouseOver={e => (e.currentTarget.style.color = '#81c784')}
          onMouseOut={e => (e.currentTarget.style.color = '#fff')}
        >
          {mostrarDados ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
        </button>

        <button
          aria-label="Configurações"
          title="Configurações"
          onClick={() => alert('Configurações - Implementação futura')}
          style={buttonStyle}
          onMouseOver={e => (e.currentTarget.style.color = '#81c784')}
          onMouseOut={e => (e.currentTarget.style.color = '#fff')}
        >
          <FaCog size={22} />
        </button>
      </div>

      <div>
        {cliente?.avatar_url ? (
          <img
            src={cliente.avatar_url}
            alt="Avatar do cliente"
            className="h-10 w-10 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <FaUserCircle size={38} color="#fff" />
        )}
      </div>
    </header>
  );
}

