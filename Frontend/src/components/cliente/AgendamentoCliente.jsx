// src/components/PaginaCliente.jsx
import React, { useEffect, useState } from 'react';
import './PaginaCliente.css';
import { FaTools, FaUserCog, FaRobot } from 'react-icons/fa';

function PaginaCliente({ clienteId, onAbrirAnamnese, onAbrirAgendamento }) {
  const [temAnamnese, setTemAnamnese] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const verificarAnamnese = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/clientes/${clienteId}/tem_anamnese`);
        const data = await response.json();
        setTemAnamnese(data.tem_anamnese);
      } catch (error) {
        console.error('Erro ao verificar anamnese:', error);
      } finally {
        setCarregando(false);
      }
    };

    if (clienteId) {
      verificarAnamnese();
    }
  }, [clienteId]);

  return (
    <div className="pagina-cliente">
      <h1>👏 Bem-vinda à sua página!</h1>
      <p>Você já pode iniciar seu acompanhamento terapêutico.</p>
      <p>Escolha abaixo:</p>

      <div className="icones-container">
        <div className="icone-item ativo" onClick={onAbrirAnamnese}>
          <FaTools size={40} />
          <p>Anamnese</p>
        </div>

        <div
          className={`icone-item ${temAnamnese ? 'ativo' : 'inativo'}`}
          onClick={temAnamnese ? onAbrirAgendamento : undefined}
          title={!temAnamnese ? 'Preencha a anamnese antes de agendar' : ''}
        >
          <FaTools size={40} />
          <p>Agendamento</p>
        </div>

        <div className="icone-item inativo">
          <FaUserCog size={40} />
          <p>Configurações</p>
        </div>

        <div className="icone-item inativo">
          <FaRobot size={40} />
          <p>Assistente IA</p>
        </div>
      </div>

      {carregando && <p>Verificando informações...</p>}
    </div>
  );
}

export default PaginaCliente;
