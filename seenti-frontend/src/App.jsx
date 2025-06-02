// src/App.jsx
import React, { useState } from "react";
import CadastroUsuario from "./components/CadastroUsuario";
import Login from "./components/Login";
import TermoUso from "./components/TermoUso";
import CadastroCliente from "./components/CadastroCliente";
import BoasVindasCliente from "./components/BoasVindasCliente";
import PaginaCliente from "./components/PaginaCliente";
import AnamneseCliente from "./components/AnamneseCliente";
import "./App.css";

function App() {
  const [pagina, setPagina] = useState("cadastro"); // primeira página
  const [usuarioId, setUsuarioId] = useState(null);
  const [clienteId, setClienteId] = useState(null);

  const handleCadastroSucesso = (id) => {
    setUsuarioId(id);
    setPagina("login");
  };

  const handleLoginSucesso = (id) => {
    setUsuarioId(id);
    setPagina("termo");
  };

  const handleTermoAceito = () => {
    setPagina("cadastroCliente");
  };

  const handleClienteCadastrado = (id) => {
    setClienteId(id);
    setPagina("boasVindas");
  };

  const handleIrParaPaginaCliente = () => {
    setPagina("paginaCliente");
  };

  const handleAbrirAnamnese = () => {
    setPagina("anamnese");
  };

  return (
    <div className="App">
      {pagina === "cadastro" && (
        <CadastroUsuario onCadastroSucesso={handleCadastroSucesso} />
      )}
      {pagina === "login" && (
        <Login
          onLoginSucesso={handleLoginSucesso}
          navegarParaTermo={() => setPagina("termo")}
        />
      )}
      {pagina === "termo" && (
        <TermoUso usuarioId={usuarioId} onTermoAceito={handleTermoAceito} />
      )}
      {pagina === "cadastroCliente" && (
        <CadastroCliente
          usuarioId={usuarioId}
          onCadastroFinalizado={handleClienteCadastrado}
        />
      )}
      {pagina === "boasVindas" && (
        <BoasVindasCliente onAvancar={handleIrParaPaginaCliente} />
      )}
      {pagina === "paginaCliente" && (
        <PaginaCliente
          clienteId={clienteId}
          onPreencherAnamnese={handleAbrirAnamnese}
        />
      )}
      {pagina === "anamnese" && (
        <AnamneseCliente clienteId={clienteId} onVoltar={handleIrParaPaginaCliente} />
      )}
    </div>
  );
}

export default App;
