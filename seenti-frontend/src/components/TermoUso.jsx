import { useEffect, useState } from 'react';

function TermoUso({ usuarioId, onAceiteConcluido }) {
  const [termo, setTermo] = useState(null);
  const [aceito, setAceito] = useState(false);

  useEffect(() => {
    async function fetchTermo() {
      try {
        const res = await fetch('http://127.0.0.1:5000/termos_texto');
        const data = await res.json();
        setTermo(data);
      } catch (err) {
        console.error('Erro ao buscar termo de uso:', err);
      }
    }
    fetchTermo();
  }, []);

  const handleAceite = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/termos_uso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuarioId,
          aceito: true
        })
      });

      const data = await res.json();
      alert(data.mensagem || data.erro);

      if (res.ok) {
        setAceito(true);
        onAceiteConcluido();
      }
    } catch (error) {
      console.error('Erro ao registrar aceite:', error);
    }
  };

  if (!termo) return <p>Carregando termo de uso...</p>;

  return (
    <div>
      <h2>{termo.titulo}</h2>
      <div
        style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', maxHeight: '300px', overflowY: 'scroll' }}
        dangerouslySetInnerHTML={{ __html: termo.conteudo_html }}
      />
      <button onClick={handleAceite}>Li e aceito os termos</button>
    </div>
  );
}

export default TermoUso;
