// src/components/PaginaCliente.jsx
import React, { useState } from 'react';
import './PaginaCliente.css';

function PaginaCliente({ cliente, onPreencherAnamnese, onAgendar }) {
  const [mostrarFerramentas, setMostrarFerramentas] = useState(false);

  return (
    <div className="pagina-cliente-container">
      <header>
        <h2>Bem-vinda, {cliente?.nome_completo || 'Cliente'}!</h2>
        <p>Sua nova jornada terapêutica começa agora 💫</p>
      </header>

      <div className="top-icons">
        {/* Ícone de Configurações */}
        <div className="icone-config" title="Configurações">
          ⚙️
        </div>

        {/* Ícone de Ferramentas */}
        <div
          className="icone-ferramentas"
          title="Ferramentas"
          onClick={() => setMostrarFerramentas(!mostrarFerramentas)}
        >
          🔧
        </div>

        {/* Ícone de Perfil */}
        <div className="icone-perfil" title="Meu perfil">
          <img
            src="/foto-perfil-default.png"
            alt="Perfil"
            className="foto-perfil"
          />
        </div>
      </div>

      {/* Menu de Ferramentas */}
      {mostrarFerramentas && (
        <div className="menu-ferramentas">
          <button onClick={onPreencherAnamnese}>🧾 Anamnese</button>
          <button onClick={onAgendar}>📅 Agendamento</button>
          <button disabled>📚 Outras ferramentas</button>
        </div>
      )}

      <div className="assistente-ia" title="Assistente Virtual">
        🤖 Assistente IA em breve...
      </div>
    </div>
  );
}

export default PaginaCliente;


