// src/App.jsx
import React, { useState } from 'react';
import CadastroUsuario from './components/CadastroUsuario';
import TermoUso from './components/TermoUso';
import CadastroCliente from './components/CadastroCliente';
import TelaBoasVindas from './components/TelaBoasVindas';
import './components/CadastroUsuario.css';
import './components/TermoUso.css';
import './components/CadastroCliente.css';
import './components/TelaBoasVindas.css';

function App() {
  const [etapa, setEtapa] = useState('cadastro_usuario');
  const [usuarioId, setUsuarioId] = useState('');

  const handleCadastroSucesso = (id) => {
    setUsuarioId(id);
    setEtapa('termo');
  };

  const handleAceiteTermo = () => {
    setEtapa('boas_vindas_termo');
    setTimeout(() => {
      setEtapa('cadastro_cliente');
    }, 2000); // Mostra a tela de boas-vindas por 2s
  };

  const handleCadastroClienteFinalizado = () => {
    setEtapa('boas_vindas_final');
  };

  const handleAvancar = () => {
    // Aqui você pode redirecionar para outra etapa, dashboard, login, etc.
    alert('Você está pronta para começar. Em breve você será direcionada para o app!');
  };

  return (
    <div className="App">
      {etapa === 'cadastro_usuario' && (
        <CadastroUsuario onCadastroSucesso={handleCadastroSucesso} />
      )}

      {etapa === 'termo' && (
        <TermoUso usuarioId={usuarioId} onTermoAceito={handleAceiteTermo} />
      )}

      {etapa === 'boas_vindas_termo' && (
        <div className="boas-vindas">
          <h2>🎉 Seja bem-vinda ao Projeto Seenti!</h2>
          <p>Seu cadastro foi realizado com sucesso.</p>
          <p>Agora vamos completar suas informações pessoais.</p>
        </div>
      )}

      {etapa === 'cadastro_cliente' && (
        <CadastroCliente
          usuarioId={usuarioId}
          onCadastroFinalizado={handleCadastroClienteFinalizado}
        />
      )}

      {etapa === 'boas_vindas_final' && (
        <TelaBoasVindas onAvancar={handleAvancar} />
      )}
    </div>
  );
}

export default App;
