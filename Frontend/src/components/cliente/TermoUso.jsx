import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TermoUso() {
  const [termoTexto, setTermoTexto] = useState('');
  const [erro, setErro] = useState('');
  const [aceitando, setAceitando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function buscarTextoTermo() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/termos_texto`);
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
      navigate('/login');
      return;
    }

    if (!termoTexto) {
      setErro('O termo não foi carregado corretamente. Tente novamente.');
      setAceitando(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/termos_uso`, {
        usuario_id,
        consentimento: true,
      });

      if (res.status === 201 || res.status === 200) {
        try {
          const clienteRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/clientes/usuario/${usuario_id}`
          );
          if (clienteRes?.data?._id) {
            // 🔹 Salva o cliente_id no localStorage antes de redirecionar
            localStorage.setItem("cliente_id", clienteRes.data._id);
            navigate('/perfil');
          } else {
            navigate('/cadastro-cliente');
          }
        } catch (error) {
          if (error?.response?.status === 404) {
            navigate('/cadastro-cliente');
          } else {
            setErro('Erro ao verificar cadastro do cliente.');
          }
        }
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
    <div className="max-w-3xl mx-auto mt-6 p-4 md:p-6 border rounded shadow bg-white">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-700">
        Termo de Uso e Consentimento
      </h2>
      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      {/* Conteúdo do termo com responsividade melhorada */}
      <div className="overflow-y-auto max-h-[50vh] md:max-h-[70vh] p-3 md:p-4 border bg-gray-50 rounded text-sm md:text-base leading-relaxed">
        {termoTexto ? (
          <div className="whitespace-pre-wrap font-sans text-gray-800">
            {termoTexto}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            Carregando termo...
          </div>
        )}
      </div>

      {/* Botão responsivo e melhorado */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={aceitarTermo}
          disabled={aceitando || !termoTexto}
          className="w-full md:w-auto px-6 py-3 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-base md:text-sm font-medium shadow-sm hover:shadow-md"
        >
          {aceitando ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando...
            </span>
          ) : (
            'Aceitar e Continuar'
          )}
        </button>
      </div>
    </div>
  );
}
