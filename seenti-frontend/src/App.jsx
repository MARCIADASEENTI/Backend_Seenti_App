import React, { useState } from "react";
import CadastroUsuario from "./components/CadastroUsuario";
import Login from "./components/Login";
import TermoUso from "./components/TermoUso";
import CadastroCliente from "./components/CadastroCliente";
import BoasVindasCliente from "./components/BoasVindasCliente";
import PaginaCliente from "./components/PaginaCliente";
import AnamneseCliente from "./components/AnamneseCliente";
import AgendamentoCliente from "./components/AgendamentoCliente";

function App() {
  const [pagina, setPagina] = useState("cadastroUsuario");
  const [usuarioId, setUsuarioId] = useState(null);
  const [clienteId, setClienteId] = useState(null);

  return (
    <div>
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
          onCadastroFinalizado={(clienteID) => {
            setClienteId(clienteID);
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
          onPreencherAnamnese={() => setPagina("anamnese")}
          onAgendar={() => setPagina("agendamento")}
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
    </div>
  );
}

export default App;
