// src/components/cliente/PaginaCliente.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function PaginaCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const clienteId = location.state?.clienteId || localStorage.getItem("clienteId");

  const irParaAnamnese = () => {
    navigate("/anamnese", { state: { clienteId } });
  };

  return (
    <div className="pagina-cliente">
      <h2>👤 Área do Cliente</h2>
      <p>Seja bem-vindo! Escolha uma opção abaixo:</p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={irParaAnamnese}>📝 Preencher Anamnese</button>
      </div>
    </div>
  );
}

export default PaginaCliente;
