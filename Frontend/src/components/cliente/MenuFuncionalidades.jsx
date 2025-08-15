import React, { useState, useEffect } from 'react';
import { FaNotesMedical, FaCalendarAlt, FaHistory, FaRobot, FaUserCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function MenuFuncionalidades() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (!cliente_id) {
          navigate('/login');
          return;
        }

        const response = await api.get(`/clientes/${cliente_id}`);
        setCliente(response.data);
      } catch (err) {
        console.error('Erro ao carregar dados do cliente:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDadosCliente();
  }, [navigate]);

  const opcoes = [
    { 
      label: 'Nova Anamnese', 
      icon: <FaNotesMedical size={28} color="#2e7d32" />,
      action: () => navigate('/anamnese'),
      sempreAtivo: true
    },
    { 
      label: 'Agendamentos', 
      icon: <FaCalendarAlt size={28} color="#2e7d32" />,
      action: () => navigate('/agendamentos'),
      sempreAtivo: true
    },
    { 
      label: 'Histórico', 
      icon: <FaHistory size={28} color="#2e7d32" />,
      action: () => alert('Histórico - Em desenvolvimento para próxima sprint'),
      sempreAtivo: false
    },
    { 
      label: 'Atendente Virtual', 
      icon: <FaRobot size={28} color="#2e7d32" />,
      action: () => alert('Atendente Virtual - Em desenvolvimento para próxima sprint'),
      sempreAtivo: false
    },
    { 
      label: 'Configurações', 
      icon: <FaUserCog size={28} color="#2e7d32" />,
      action: () => alert('Configurações - Em desenvolvimento para próxima sprint'),
      sempreAtivo: false
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center my-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <nav aria-label="Menu de funcionalidades" className="flex justify-around max-w-md mx-auto my-6 bg-transparent">
      {opcoes.map(({ label, icon, action, sempreAtivo }) => (
        <button
          key={label}
          onClick={action}
          aria-label={label}
          title={label}
          className={`focus:outline-none transition-all duration-200 transform hover:scale-110 ${
            sempreAtivo 
              ? 'text-green-700 hover:text-green-800' 
              : 'text-gray-400 hover:text-gray-500 cursor-not-allowed'
          }`}
          disabled={!sempreAtivo}
        >
          {icon}
        </button>
      ))}
    </nav>
  );
}
