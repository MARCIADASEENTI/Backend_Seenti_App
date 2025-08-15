//// Pequena atualização para disparar build
import React from 'react';
import { FaNotesMedical, FaCalendarAlt, FaHistory, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function MenuFuncionalidades() {
  const navigate = useNavigate();

  const opcoes = [
    { label: 'Nova Anamnese', icon: <FaNotesMedical size={28} color="#2e7d32" /> },
    { label: 'Agendamentos', icon: <FaCalendarAlt size={28} color="#2e7d32" /> },
    { label: 'Histórico', icon: <FaHistory size={28} color="#2e7d32" /> },
    { label: 'Atendente Virtual', icon: <FaRobot size={28} color="#2e7d32" /> },
  ];

  return (
    <nav aria-label="Menu de funcionalidades" className="flex justify-around max-w-md mx-auto my-6 bg-transparent">
      {opcoes.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => {
            if (label === 'Nova Anamnese') {
              navigate('/anamnese');
            } else if (label === 'Agendamentos') {
              navigate('/agendamentos');
            } else {
              alert(`${label} - Implementando`);
            }
          }}
          aria-label={label}
          title={label}
          className="focus:outline-none hover:text-green-700 transition-colors"
          style={{ backgroundColor: 'transparent', color: '#2e7d32' }}
          onMouseOver={e => (e.currentTarget.style.color = '#81c784')}
          onMouseOut={e => (e.currentTarget.style.color = '#2e7d32')}
        >
          {icon}
        </button>
      ))}
    </nav>
  );
}
