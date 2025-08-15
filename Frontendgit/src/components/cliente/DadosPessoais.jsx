// src/components/cliente/DadosPessoais.jsx
import React from 'react';
import { FaUser, FaIdCard, FaBirthdayCake, FaPhone, FaVenusMars } from 'react-icons/fa';

export default function DadosPessoais({ cliente }) {
  if (!cliente) return null;

  const dados = [
    { label: 'Nome', valor: cliente.nome, icon: <FaUser className="text-green-600" /> },
    { label: 'Nome Social', valor: cliente.nomeSocial || '-', icon: <FaUser className="text-green-600" /> },
    { label: 'CPF', valor: cliente.cpf || '-', icon: <FaIdCard className="text-green-600" /> },
    { label: 'Data de Nascimento', valor: cliente.dataNascimento || '-', icon: <FaBirthdayCake className="text-green-600" /> },
    { label: 'Telefone', valor: cliente.telefone || '-', icon: <FaPhone className="text-green-600" /> },
    { label: 'Gênero', valor: cliente.genero || '-', icon: <FaVenusMars className="text-green-600" /> },
  ];

  return (
    <section className="bg-white rounded-xl shadow-md p-4 max-w-3xl mx-auto mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Dados Pessoais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dados.map(({ label, valor, icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="text-xl">{icon}</div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-base font-medium text-gray-800">{valor}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
