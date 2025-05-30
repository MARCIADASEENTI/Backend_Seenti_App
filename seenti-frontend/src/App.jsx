import React, { useState } from 'react';
import CadastroUsuario from './components/CadastroUsuario';
import TermoUso from './components/TermoUso';
import CadastroCliente from './components/CadastroCliente';
import BoasVindasCliente from './components/BoasVindasCliente';
import PaginaCliente from './components/PaginaCliente';

function App() {
  const [pagina, setPagina] = useState('cadastroUsuario');
  const [usuarioId, setUsuarioId] = useState(null);
  const [dadosCliente, setDadosCliente] = useState({});

  // Depois do cadastro de usuário
  const handleCadastroUsuario = (id) => {
    setUsuarioId(id);
    setPagina('termoUso');
  };

  // Depois do aceite do termo
  const handleAceiteTermo = () => {
    setPagina('cadastroCliente');
  };

  // Depois do cadastro de cliente
  const handleCadastroCliente = (clienteData) => {
    setDadosCliente(clienteData);
    setPagina('boasVindas');
  };

  // Depois da tela de boas-vindas
  const handleAvancarPosBoasVindas = () => {
    setPagina('paginaCliente');
  };

  return (
    <>
      {pagina === 'cadastroUsuario' && (
        <CadastroUsuario onCadastroSucesso={handleCadastroUsuario} />
      )}
      {pagina === 'termoUso' && (
        <TermoUso usuarioId={usuarioId} onTermoAceito={handleAceiteTermo} />
      )}
      {pagina === 'cadastroCliente' && (
      <CadastroCliente usuarioId={usuarioId} onCadastroFinalizado={handleCadastroCliente} />
      )}
      {pagina === 'boasVindas' && (
        <BoasVindasCliente onAvancar={handleAvancarPosBoasVindas} />
      )}
      {pagina === 'paginaCliente' && (
        <PaginaCliente
          cliente={dadosCliente}
          onPreencherAnamnese={() => alert('Ir para Anamnese')}
          onAgendar={() => alert('Ir para Agendamento')}
        />
      )}
    </>
  );
}

export default App;
