// src/App.jsx
import React, { useState } from "react";

// COMPONENTES DO CLIENTE
import CadastroUsuario from "./components/cliente/CadastroUsuario";
import Login from "./components/cliente/Login";
import TermoUso from "./components/cliente/TermoUso";
import CadastroCliente from "./components/cliente/CadastroCliente";
import BoasVindasCliente from "./components/cliente/BoasVindasCliente";
import PaginaCliente from "./components/cliente/PaginaCliente";
import AnamneseCliente from "./components/cliente/AnamneseCliente";
import AgendamentoCliente from "./components/cliente/AgendamentoCliente";

// COMPONENTES DO TERAPEUTA (ainda importados para uso futuro)
import LoginTerapeuta from "./components/terapeuta/LoginTerapeuta";
import PaginaTerapeuta from "./components/terapeuta/PaginaTerapeuta";
import PainelTerapeuta from "./components/terapeuta/PainelTerapeuta";

function App() {
  const [pagina, setPagina] = useState("cadastroUsuario");
  const [usuarioId, setUsuarioId] = useState(null);
  const [clienteId, setClienteId] = useState(null);

  return (
    <div>
      {/* FLUXO CLIENTE */}
      {pagina === "cadastroUsuario" && (
        <CadastroUsuario
          onCadastroSucesso={(id) => {
            setUsuarioId(id);
            setPagina("login");
          }}
        />
      )}

      {pagina === "login" && (
        <Login
          onLoginSucesso={(id) => {
            setUsuarioId(id);
            setPagina("termo");
          }}
        />
      )}

      {pagina === "termo" && (
        <TermoUso
          usuarioId={usuarioId}
          onTermoAceito={() => setPagina("cadastroCliente")}
        />
      )}

      {pagina === "cadastroCliente" && (
        <CadastroCliente
          usuarioId={usuarioId}
          onCadastroFinalizado={(idCliente) => {
            setClienteId(idCliente);
            setPagina("boasVindas");
          }}
        />
      )}

      {pagina === "boasVindas" && (
        <BoasVindasCliente onAvancar={() => setPagina("paginaCliente")} />
      )}

      {pagina === "paginaCliente" && (
        <PaginaCliente
          clienteId={clienteId}
          onAbrirAnamnese={() => setPagina("anamnese")}
          onAbrirAgendamento={() => setPagina("agendamento")}
        />
      )}

      {pagina === "anamnese" && (
        <AnamneseCliente
          clienteId={clienteId}
          onVoltar={() => setPagina("paginaCliente")}
        />
      )}

      {pagina === "agendamento" && (
        <AgendamentoCliente
          clienteId={clienteId}
          onVoltar={() => setPagina("paginaCliente")}
        />
      )}

      {/* FLUXO TERAPEUTA – se quiser testar depois */}
      {/* 
      {pagina === "loginTerapeuta" && (
        <LoginTerapeuta
          onLoginSucesso={(id) => {
            setUsuarioId(id);
            setPagina("paginaTerapeuta");
          }}
        />
      )}

      {pagina === "paginaTerapeuta" && (
        <PaginaTerapeuta
          terapeutaId={usuarioId}
          onLogout={() => setPagina("loginTerapeuta")}
        />
      )}
      */}
    </div>
  );
}

export default App;
