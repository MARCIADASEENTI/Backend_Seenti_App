// src/components/cliente/HeaderPerfil.jsx
import React from 'react';
import { brand } from '../../whiteLabel/config/brandConfig';

export default function HeaderPerfil({ cliente, mostrarDados, onToggleDados }) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={onToggleDados}
              aria-label={mostrarDados ? 'Ocultar dados pessoais' : 'Mostrar dados pessoais'}
              title={mostrarDados ? 'Ocultar dados pessoais' : 'Mostrar dados pessoais'}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-white"
            >
              <span className="text-base md:text-lg">
                {mostrarDados ? '👁️' : '👁️‍🗨️'}
              </span>
            </button>

            <button
              aria-label="Configurações"
              title="Configurações"
              onClick={() => alert('Configurações - Implementação futura')}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-white"
            >
              <span className="text-base md:text-lg">⚙️</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="text-right text-white hidden sm:block">
              <p className="text-xs md:text-sm opacity-90">Bem-vindo(a)</p>
              <p className="font-semibold text-sm md:text-base">
                {cliente?.primeiro_nome || 'Cliente'}
              </p>
            </div>
            
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 border-white border-opacity-30">
              <span className="text-white text-sm md:text-lg font-medium">
                {cliente?.primeiro_nome ? cliente.primeiro_nome.charAt(0).toUpperCase() : '👤'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

