// src/App.jsx
import React, { useState } from 'react';
import CadastroUsuario from './components/CadastroUsuario';
import TermoUso from './components/TermoUso';
import CadastroCliente from './components/CadastroCliente';
import PaginaCliente from './components/PaginaCliente';
import AnamneseCliente from './components/AnamneseCliente';
import AgendamentoCliente from './components/AgendamentoCliente';
import './App.css';

function App() {
  const [pagina, setPagina] = useState('cadastroUsuario');
  const [usuarioId, setUsuarioId] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [dadosCliente, setDadosCliente] = useState(null);

  // Após cadastro do usuário
  const handleCadastroUsuario = (id) => {
    setUsuarioId(id);
    setPagina('termoUso');
  };

  // Após aceite do termo
  const handleAceiteTermo = () => {
    setPagina('cadastroCliente');
  };

  // Após cadastro do cliente
  const handleCadastroCliente = (cliente) => {
    setClienteId(cliente.id);
    setDadosCliente(cliente);
    setPagina('cliente');
  };

  // Retorno da anamnese para a página do cliente
  const handleVoltarParaCliente = () => {
    setPagina('cliente');
  };

  return (
    <div className="app-container">
      {pagina === 'cadastroUsuario' && (
        <CadastroUsuario onCadastroSucesso={handleCadastroUsuario} />
      )}

      {pagina === 'termoUso' && (
        <TermoUso usuarioId={usuarioId} onTermoAceito={handleAceiteTermo} />
      )}

      {pagina === 'cadastroCliente' && (
        <CadastroCliente usuarioId={usuarioId} onCadastroFinalizado={handleCadastroCliente} />
      )}

      {pagina === 'cliente' && dadosCliente && (
        <PaginaCliente
          cliente={dadosCliente}
          onPreencherAnamnese={() => setPagina('anamnese')}
          onAgendar={() => setPagina('agendamento')}
        />
      )}

      {pagina === 'anamnese' && clienteId && (
        <AnamneseCliente clienteId={clienteId} onVoltar={handleVoltarParaCliente} />
      )}

      {pagina === 'agendamento' && clienteId && (
        <AgendamentoCliente clienteId={clienteId} onAgendamentoConcluido={handleVoltarParaCliente} />
      )}
      {pagina === 'anamnese' && (
  <AnamneseCliente cliente={dadosCliente} onVoltar={() => setPagina('cliente')} />
)}
{pagina === 'anamnese' && (
  <AnamneseCliente
    cliente={dadosCliente}
    onVoltar={() => setPagina('cliente')}
  />
)}

    </div>
  );
}

export default App;
