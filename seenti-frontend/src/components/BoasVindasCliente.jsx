import React from 'react';
import './BoasVindasCliente.css';

function BoasVindasCliente({ onAvancar }) {
  return (
    <div className="boas-vindas-cliente-container">
      <h1>👏 Cadastro concluído com sucesso!</h1>
      <p>Seja bem-vinda à sua nova jornada terapêutica.</p>
      <p>A partir de agora, você poderá acompanhar seus atendimentos e evolução.</p>
      <button onClick={onAvancar}>Avançar</button>
    </div>
  );
}

export default BoasVindasCliente;
