import React from 'react';
import './PaginaCliente.css';

function PaginaCliente({ cliente, onPreencherAnamnese, onAgendar }) {
  if (!cliente) {
    return <p>Carregando informações do cliente...</p>;
  }

  return (
    <div className="pagina-cliente-container">
      <h2>Olá, {cliente.nome_completo}!</h2>
      <p>Bem-vinda à sua área pessoal.</p>

      <div className="botoes-acoes">
        <button onClick={onPreencherAnamnese}>📋 Preencher Anamnese</button>
        <button onClick={onAgendar}>📅 Agendar Atendimento</button>
      </div>
    </div>
  );
}

export default PaginaCliente;
