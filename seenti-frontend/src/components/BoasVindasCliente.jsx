import React from 'react';

function BoasVindasCliente({ onAvancar }) {
  return (
    <div className="boas-vindas">
      <h2>🎉 Bem-vinda!</h2>
      <p>
        Seu cadastro como cliente foi concluído com sucesso.
        Estamos muito felizes em ter você com a gente!
      </p>
      <p>
        Em breve, você poderá preencher sua Anamnese e dar início ao seu acompanhamento personalizado.
      </p>
      <button onClick={onAvancar}>Avançar</button>
    </div>
  );
}

export default BoasVindasCliente;
