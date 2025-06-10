import React from 'react';
import './TelaBoasVindas.css';

function TelaBoasVindas({ onAvancar }) {
  return (
    <div className="boas-vindas-container">
      <h1>🎉 Bem-vinda ao Projeto Seenti!</h1>
      <p>Seu cadastro foi concluído com sucesso. Agradecemos pela confiança.</p>
      <p>Agora você está pronta para iniciar sua jornada terapêutica conosco.</p>
      <button onClick={onAvancar}>Avançar</button>
    </div>
  );
}

export default TelaBoasVindas;
