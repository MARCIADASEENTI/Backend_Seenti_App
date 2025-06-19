// src/components/cliente/BoasVindasCliente.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BoasVindasCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const clienteId = location.state?.clienteId;

  const continuar = () => {
    navigate("/pagina-cliente", { state: { clienteId } });
  };

  return (
    <div className="boas-vindas">
      <h2>🎉 Boas-vindas!</h2>
      <p>Seu cadastro foi concluído com sucesso.</p>
      <p>Estamos felizes em acompanhar sua jornada de autoconhecimento.</p>

      <button onClick={continuar} style={{ marginTop: "20px" }}>
        Ir para área do cliente
      </button>
    </div>
  );
}

export default BoasVindasCliente;
