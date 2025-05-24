import { useState } from 'react';
import CadastroUsuario from './components/CadastroUsuario';
import Login from './components/Login';
import CadastroCliente from './components/CadastroCliente';
import TelaBoasVindas from './components/TelaBoasVindas';
import TermoUso from './components/TermoUso';

function App() {
  const [tela, setTela] = useState('cadastro'); // fluxo: 'cadastro' → 'login' → 'cliente' → 'boas-vindas'
  const [usuarioId, setUsuarioId] = useState(null);
  const [termoAceito, setTermoAceito] = useState(false);

  const handleLoginSucesso = (id) => {
    setUsuarioId(id);
    setTela('cliente');
  };

  const handleCadastroSucesso = () => {
    setTela('login');
  };

  return (
    <div className="App">
      {tela === 'cadastro' && <CadastroUsuario onCadastroSucesso={handleCadastroSucesso} />}
      {tela === 'login' && <Login onLoginSucesso={handleLoginSucesso} />}
      {tela === 'cliente' && !termoAceito && (
        <TermoUso usuarioId={usuarioId} onAceiteConcluido={() => setTermoAceito(true)} />
      )}
      {tela === 'cliente' && termoAceito && (
        <CadastroCliente
          usuarioId={usuarioId}
          onCadastroCompleto={() => setTela('boas-vindas')}
        />
      )}
      {tela === 'boas-vindas' && <TelaBoasVindas onAvancar={() => alert("Pronto para anamnese!")} />}
    </div>
  );
}

export default App;
