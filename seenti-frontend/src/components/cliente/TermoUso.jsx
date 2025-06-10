// src/components/TermoUso.jsx
import React, { useState, useEffect } from 'react';
import './TermoUso.css';

function TermoUso({ usuarioId, onTermoAceito }) {
  const [termoTexto, setTermoTexto] = useState('');
  const [aceito, setAceito] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/termos_texto')
      .then((res) => res.json())
      .then((data) => {
        setTermoTexto(data.conteudo_html || 'Texto do termo não disponível.');
      })
      .catch((err) => {
        console.error('Erro ao carregar termo:', err);
        setTermoTexto('Erro ao carregar o texto do termo.');
      });
  }, []);

  const handleAceite = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/termos_uso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: usuarioId, aceito: true })
      });

      const data = await response.json();
      if (response.ok) {
        alert('✅ Boas-vindas! Agora complete seu cadastro de cliente.');
        onTermoAceito(); // Redireciona para a próxima etapa
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
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={aceito}
          onChange={(e) => setAceito(e.target.checked)}
        />
        Eu li e concordo com os termos acima
      </label>
      <button
        className="btn-termo"
        onClick={handleAceite}
        disabled={!aceito}
      >
        Li e aceito os termos
      </button>
    </div>
  );
}

export default TermoUso;

