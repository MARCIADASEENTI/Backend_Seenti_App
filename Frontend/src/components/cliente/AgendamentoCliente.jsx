// src/components/cliente/AgendamentoCliente.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { brand } from '../../whiteLabel/config/brandConfig';
import api from '../../services/api';

export default function AgendamentoCliente() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [terapeutas, setTerapeutas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [form, setForm] = useState({
    terapeuta_id: '',
    data: '',
    horario: '',
    observacoes: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const cliente_id = localStorage.getItem('cliente_id');
    if (!cliente_id) {
      navigate('/login');
      return;
    }
    
    carregarDados();
  }, [navigate]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar terapeutas disponíveis
      const terapeutasRes = await api.get('/terapeutas/disponiveis');
      setTerapeutas(terapeutasRes.data);
      
      // Carregar horários disponíveis
      const horariosRes = await api.get('/agendamentos/horarios-disponiveis');
      setHorarios(horariosRes.data);
      
      // Carregar agendamentos do cliente
      const cliente_id = localStorage.getItem('cliente_id');
      const agendamentosRes = await api.get(`/agendamentos/cliente/${cliente_id}`);
      setAgendamentos(agendamentosRes.data);
      
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setErro('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarForm = () => {
    if (!form.terapeuta_id || !form.data || !form.horario) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    
    const dataSelecionada = new Date(form.data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataSelecionada < hoje) {
      setErro('Não é possível agendar para datas passadas.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    
    if (!validarForm()) return;
    
    try {
      const cliente_id = localStorage.getItem('cliente_id');
      const response = await api.post('/agendamentos', {
        cliente_id,
        terapeuta_id: form.terapeuta_id,
        data: form.data,
        horario: form.horario,
        observacoes: form.observacoes
      });
      
      if (response.status === 201) {
        setSucesso('✅ Agendamento realizado com sucesso!');
        setForm({ terapeuta_id: '', data: '', horario: '', observacoes: '' });
        carregarDados(); // Recarrega a lista
      }
    } catch (err) {
      console.error('Erro ao agendar:', err);
      if (err.response?.status === 409) {
        setErro('Este horário já está ocupado. Escolha outro.');
      } else {
        setErro('Erro ao realizar agendamento. Tente novamente.');
      }
    }
  };

  const cancelarAgendamento = async (agendamentoId) => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    
    try {
      await api.delete(`/agendamentos/${agendamentoId}`);
      setSucesso('✅ Agendamento cancelado com sucesso!');
      carregarDados();
    } catch (err) {
      console.error('Erro ao cancelar:', err);
      setErro('Erro ao cancelar agendamento. Tente novamente.');
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHorario = (horario) => {
    return horario;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado': return 'text-green-600';
      case 'pendente': return 'text-yellow-600';
      case 'cancelado': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <FaCalendarAlt className="inline mr-2 text-green-600" />
          Agendamentos
        </h1>
        <p className="text-gray-600">Agende sua sessão de terapia integrativa</p>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {sucesso}
        </div>
      )}

      {/* Formulário de Novo Agendamento */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Novo Agendamento</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Terapeuta
              </label>
              <select
                name="terapeuta_id"
                value={form.terapeuta_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Selecione um terapeuta</option>
                {terapeutas.map(terapeuta => (
                  <option key={terapeuta._id} value={terapeuta._id}>
                    {terapeuta.nome_completo} - {terapeuta.especialidades.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Data
              </label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" />
                Horário
              </label>
              <select
                name="horario"
                value={form.horario}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Selecione um horário</option>
                {horarios.map(horario => (
                  <option key={horario} value={horario}>
                    {horario}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <input
                type="text"
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                placeholder="Alguma observação especial?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FaCheck className="inline mr-2" />
              Agendar
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Meus Agendamentos</h2>
        
        {agendamentos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado.</p>
        ) : (
          <div className="space-y-4">
            {agendamentos.map(agendamento => (
              <div
                key={agendamento._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <FaCalendarAlt className="text-green-600 mr-2" />
                      <span className="font-medium text-gray-800">
                        {formatarData(agendamento.data)} às {formatarHorario(agendamento.horario)}
                      </span>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(agendamento.status)}`}>
                        {agendamento.status}
                      </span>
                    </div>
                    
                    <div className="text-gray-600 space-y-1">
                      <p><FaUser className="inline mr-2" /> {agendamento.terapeuta?.nome_completo}</p>
                      {agendamento.observacoes && (
                        <p className="text-sm italic">"{agendamento.observacoes}"</p>
                      )}
                    </div>
                  </div>
                  
                  {agendamento.status === 'pendente' && (
                    <button
                      onClick={() => cancelarAgendamento(agendamento._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Cancelar agendamento"
                    >
                      <FaTimes size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
