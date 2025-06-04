// src/components/PaginaCliente.jsx
import React from 'react';
import './PaginaCliente.css';
import { FaTools, FaUserCog, FaRobot } from 'react-icons/fa';

function PaginaCliente({ clienteId, onAbrirAnamnese, onAbrirAgendamento }) {
  return (
    <div className="pagina-cliente">
      <h1>👏 Bem-vinda à sua página!</h1>
      <p>Você já pode iniciar seu acompanhamento terapêutico.</p>
      <p>Escolha abaixo:</p>

      <div className="icones-container">
        <div className="icone-item ativo" onClick={onAbrirAnamnese}>
          <FaTools size={40} />
          <p>Anamnese</p>
        </div>
        <div className="icone-item ativo" onClick={onAbrirAgendamento}>
          <FaTools size={40} />
          <p>Agendamento</p>
        </div>
        <div className="icone-item inativo">
          <FaUserCog size={40} />
          <p>Configurações</p>
        </div>
        <div className="icone-item inativo">
          <FaRobot size={40} />
          <p>Assistente IA</p>
        </div>
      </div>
    </div>
  );
}

export default PaginaCliente;
