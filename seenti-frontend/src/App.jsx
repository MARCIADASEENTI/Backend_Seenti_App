// src/App.jsx
import React, { useState } from 'react';
import CadastroUsuario from './components/CadastroUsuario';
import TermoUso from './components/TermoUso';
import CadastroCliente from './components/CadastroCliente';
import BoasVindasCliente from './components/BoasVindasCliente';
import PaginaCliente from './components/PaginaCliente';

function App() {
  const [pagina, setPagina] = useState('cadastroUsuario');
  const [usuarioId, setUsuarioId] = useState(null);
  const [dadosCliente, setDadosCliente] = useState(null);

  const handleCadastroUsuario = (id) => {
    setUsuarioId(id);
    setPagina('termo');
  };

  const handleAceiteTermo = () => {
    setPagina('cadastroCliente');
  };

  const handleCadastroCliente = (dados) => {
    setDadosCliente(dados);
    setPagina('boasVindas');
  };

  const handleAvancarBoasVindas = () => {
    setPagina('paginaCliente');
  };

  return (
    <>
      {pagina === 'cadastroUsuario' && (
        <CadastroUsuario onCadastroSucesso={handleCadastroUsuario} />
      )}
      {pagina === 'termo' && (
        <TermoUso usuarioId={usuarioId} onTermoAceito={handleAceiteTermo} />
      )}
      {pagina === 'cadastroCliente' && (
        <CadastroCliente usuarioId={usuarioId} onCadastroFinalizado={handleCadastroCliente} />
      )}
      {pagina === 'boasVindas' && (
        <BoasVindasCliente onAvancar={handleAvancarBoasVindas} />
      )}
      {pagina === 'paginaCliente' && (
     <PaginaCliente
     cliente={dadosCliente}
     onPreencherAnamnese={() => setPagina('anamnese')}
     onAgendar={() => setPagina('agendamento')}
   />
     
      )}
    </>
  );
}

export default App;
