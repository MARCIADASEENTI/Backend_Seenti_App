import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TermoUso() {
  const [termoTexto, setTermoTexto] = useState('');
  const [erro, setErro] = useState('');
  const [aceitando, setAceitando] = useState(false);

  useEffect(() => {
    async function buscarTextoTermo() {
      try {
        const res = await axios.get('http://localhost:5000/termos_texto');
        if (res.status === 200 && res.data.termo) {
          setTermoTexto(res.data.termo);
        } else {
          setErro('Não foi possível carregar o texto do termo.');
        }
      } catch (err) {
        console.error(err);
        setErro('Erro ao conectar com o servidor.');
      }
    }

    buscarTextoTermo();
  }, []);

  const aceitarTermo = async () => {
    setErro('');
    setAceitando(true);

    const usuario_id = localStorage.getItem('usuario_id');
    if (!usuario_id) {
      setErro('Usuário não autenticado. Faça login novamente.');
      setAceitando(false);
      return;
    }

    if (!termoTexto) {
      setErro('O termo não foi carregado corretamente. Tente novamente.');
      setAceitando(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/termos_uso', {
        usuario_id,
        consentimento: true,
      });
      if (res.status === 200) {
        window.location.href = '/cadastro-cliente';
      } else {
        setErro('Erro ao registrar aceite do termo.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro ao aceitar o termo. Verifique sua conexão.');
    } finally {
      setAceitando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Termo de Uso e Consentimento</h2>
      {erro && <p className="text-red-600">{erro}</p>}
      <div className="overflow-y-scroll max-h-96 p-3 border bg-gray-50 rounded">
        {termoTexto ? <pre className="whitespace-pre-wrap">{termoTexto}</pre> : 'Carregando termo...'}
      </div>
      <button
        onClick={aceitarTermo}
        disabled={aceitando || !termoTexto}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {aceitando ? 'Processando...' : 'Aceitar e Continuar'}
      </button>
    </div>
  );
}
