// src/components/PaginaCliente.jsx
import React from 'react';
import './PaginaCliente.css';

function PaginaCliente({ clienteId, onPreencherAnamnese }) {
  return (
    <div className="pagina-cliente-container">
      <header className="cliente-header">
        <h1>🎉 Bem-vinda!</h1>
        <p>Você já pode iniciar seu acompanhamento terapêutico.</p>
      </header>

      <div className="cliente-acoes">
        <button className="btn-anamnese" onClick={onPreencherAnamnese}>
          Preencher Anamnese
        </button>

        <button className="btn-agenda" disabled>
          Ver Agenda (em breve)
        </button>

        <button className="btn-configuracoes" disabled>
          Configurações (em breve)
        </button>

        <button className="btn-ia" disabled>
          Assistente IA (em breve)
        </button>
      </div>
    </div>
  );
}

export default PaginaCliente;
