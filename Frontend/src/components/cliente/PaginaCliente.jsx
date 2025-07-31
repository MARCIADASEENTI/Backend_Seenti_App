// src/components/cliente/PaginaCliente.jsx
import { brand } from '../../whiteLabel/config/brandConfig';
import WhiteLabelLayout from '../../whiteLabel/layouts/WhiteLabelLayout';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PaginaCliente() {
  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
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
        const res = await axios.get(`http://localhost:5000/clientes/${cliente_id}`);
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

  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const formatarData = (data) => {
    if (!data) return '';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <WhiteLabelLayout>
    <div className="max-w-2xl mx-auto mt-12 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
      <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: brand.fontFamily, color: brand.primaryColor }}>
  Olá, {cliente?.primeiro_nome}! Bem-vindo(a) de volta à sua jornada de bem-estar 🌿
</h2>
        Perfil do Cliente
      </h2>

      {loading && <p className="text-gray-600">⏳ Carregando dados...</p>}
      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      {cliente && (
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-green-700">Dados Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <strong>Nome:</strong> {cliente.primeiro_nome} {cliente.sobrenome}
              </div>
              
              {cliente.nome_social && (
                <div>
                  <strong>Nome Social:</strong> {cliente.nome_social}
                </div>
              )}
              
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
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-green-700">Status</h3>
            <div>
              <strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                cliente.status === 'ativo' ? 'bg-green-100 text-green-800' :
                cliente.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {cliente.status || 'pendente'}
              </span>
            </div>
          </div>

          <button
            onClick={handleNovaAnamnese}
            className="mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Preencher Nova Anamnese
          </button>
        </div>
      )}
    </div>
    </WhiteLabelLayout> 
     );
}
