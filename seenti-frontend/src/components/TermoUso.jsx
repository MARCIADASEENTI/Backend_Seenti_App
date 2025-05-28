// TermoUso.jsx (revisado e funcional)
import React, { useState, useEffect } from 'react';
import './TermoUso.css';

function TermoUso({ usuarioId, onTermoAceito }) {
  const [termoTexto, setTermoTexto] = useState('');
  const [aceito, setAceito] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/termos_texto')
      .then((res) => res.json())
      .then((data) => setTermoTexto(data.conteudo_html || 'Texto do termo indisponível.'))
      .catch((err) => console.error('Erro ao carregar termo:', err));
  }, []);
 
  const handleAceite = async () => {
    if (!usuarioId) {
      alert('Erro: ID do usuário não está disponível.');
      return;
    }
  
    try {
      const response = await fetch('http://127.0.0.1:5000/termos_uso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, aceito: true }) // corrigido "aceito" ao invés de "aceito_termo"
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.mensagem || 'Termo aceito com sucesso.');
        onTermoAceito();
      } else {
        alert(data.erro || 'Erro ao registrar aceite.');
      }
    } catch (error) {
      console.error('Erro ao aceitar termo:', error);
      alert('Erro de conexão ao aceitar termo.');
    }
  };
  
  return (
    <div className="termo-container">
      <h2>Termo de Uso e Política de Privacidade</h2>
      <textarea
        className="termo-textarea"
        readOnly
        value={termoTexto}
        rows={12}
      />
      <button
        className="btn-termo"
        onClick={handleAceite}
        disabled={!aceito}
      >
        Li e aceito os termos
      </button>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
        /> Eu li e concordo com os termos acima
      </label>
    </div>
  );
}

export default TermoUso;
