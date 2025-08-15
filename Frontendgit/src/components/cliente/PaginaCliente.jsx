// src/components/cliente/PaginaCliente.jsx
import React, { useEffect, useState } from 'react';
import { brand } from '../../whiteLabel/config/brandConfig';
import HeaderPerfil from './HeaderPerfil';
import MenuFuncionalidades from './MenuFuncionalidades';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaginaCliente() {
  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const [mostrarDados, setMostrarDados] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      setErro('');
      setLoading(true);

      const cliente_id = localStorage.getItem('cliente_id');
      if (!cliente_id) {
        setErro('⚠️ Cliente não autenticado. Faça login novamente.');
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/clientes/${cliente_id}`);
        if (res.status === 200) {
          setCliente(res.data);
        } else {
          setErro('⚠️ Não foi possível carregar os dados do cliente.');
        }
      } catch (err) {
        console.error(err);
        setErro('⚠️ Erro ao buscar dados do cliente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [navigate]);

  const handleNovaAnamnese = () => {
    navigate('/anamnese');
  };

  // Formatação
  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    if (telefone.length === 11) return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };
  const formatarData = (data) => {
    if (!data) return '';
    const d = new Date(data);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: brand.secondaryColor, fontFamily: brand.fontFamily }}
    >
      <HeaderPerfil
        cliente={cliente}
        mostrarDados={mostrarDados}
        onToggleDados={() => setMostrarDados((v) => !v)}
      />

      <main className="flex-grow max-w-3xl mx-auto px-4 py-6 w-full text-gray-900 bg-white rounded-md shadow-md mt-4">
        {loading && <p className="text-center text-gray-600">⏳ Carregando dados...</p>}
        {erro && <p className="text-center text-red-600 mb-4">{erro}</p>}

        {cliente && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-green-700">
              Olá, {cliente.primeiro_nome}! Bem-vindo(a) de volta à sua jornada de bem-estar!
            </h2>

            {mostrarDados && (
              <section
                aria-labelledby="dados-pessoais-title"
                className="bg-green-50 border border-green-200 p-4 rounded mb-6"
              >
                <h3 id="dados-pessoais-title" className="font-bold mb-3 text-green-700">
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-800">
                  <div>
                    <strong>Nome:</strong> {cliente.primeiro_nome} {cliente.sobrenome}
                  </div>
                  {cliente.nome_social && <div><strong>Nome Social:</strong> {cliente.nome_social}</div>}
                  <div>
                    <strong>CPF:</strong> {formatarCPF(cliente.cpf)}
                  </div>
                  <div>
                    <strong>Data de Nascimento:</strong> {formatarData(cliente.data_nascimento)}
                  </div>
                  <div>
                    <strong>Telefone:</strong> {formatarTelefone(cliente.telefone)}
                  </div>
                  <div>
                    <strong>Gênero:</strong> {cliente.genero || 'Não informado'}
                  </div>
                </div>
              </section>
            )}

            <section
              aria-labelledby="status-title"
              className="bg-green-50 border border-green-200 p-4 rounded mb-6"
            >
              <h3 id="status-title" className="font-bold mb-3 text-green-700">
                Status
              </h3>
              <div>
                <strong>Status:</strong>{' '}
                <span
                  className={`ml-2 px-2 py-1 rounded text-sm ${
                    cliente.status === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : cliente.status === 'pendente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {cliente.status || 'pendente'}
                </span>
              </div>
            </section>

            <MenuFuncionalidades />
          </>
        )}
      </main>

      {/* Rodapé mobile simplificado com botão Home */}
      <footer
        className="bg-[#001433] border-t fixed bottom-0 left-0 right-0 flex justify-center py-3 md:hidden shadow-inner"
      >
        <button
          aria-label="Home"
          className="text-green-300 !text-green-300 hover:!text-green-400 focus:!text-green-400 active:!text-green-500 focus:outline-none px-6"
          onClick={() => navigate('/')}
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-11 w-11"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: '#22c55e' }} // verde Tailwind 300
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9.75L12 4l9 5.75v9a2 2 0 01-2 2h-4a2 2 0 01-2-2v-5h-2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-9z"
            />
          </svg>
        </button>
      </footer>
    </div>
  );
}
