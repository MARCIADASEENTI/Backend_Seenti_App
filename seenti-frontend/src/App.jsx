import { useState } from 'react';
import CadastroUsuario from './components/CadastroUsuario';
import Login from './components/Login';
import TermoUso from './components/TermoUso';
import CadastroCliente from './components/CadastroCliente';
import TelaBoasVindas from './components/TelaBoasVindas';

function App() {
  const [tela, setTela] = useState('cadastro');
  const [usuarioId, setUsuarioId] = useState(null);
  const [termoAceito, setTermoAceito] = useState(false);

  const handleCadastroSucesso = () => {
    setTela('login');
  };

  const handleLoginSucesso = (id) => {
    setUsuarioId(id);
    setTermoAceito(true);
    setTela('cliente');
  };

  const navegarParaTermo = (id) => {
    setUsuarioId(id);
    setTela('termo');
  };

  const handleAceiteTermo = () => {
    setTermoAceito(true);
    setTela('cliente');
  };

  return (
    <div className="App">
      {tela === 'cadastro' && <CadastroUsuario onCadastroSucesso={handleCadastroSucesso} />}
      {tela === 'login' && (
        <Login
          onLoginSucesso={handleLoginSucesso}
          navegarParaTermo={navegarParaTermo}
        />
      )}
      {tela === 'termo' && (
         <TermoUso usuarioId={usuarioId} onTermoAceito={handleAceiteTermo} />
             )}
      {tela === 'cliente' && <CadastroCliente usuarioId={usuarioId} />}
      {tela === 'boas-vindas' && <TelaBoasVindas />}
    </div>
  );
}

export default App;
