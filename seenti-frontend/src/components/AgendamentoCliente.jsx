// src/components/AgendamentoCliente.jsx
import React, { useEffect, useState } from 'react';
import './AgendamentoCliente.css';

function AgendamentoCliente({ clienteId, onAgendamentoConcluido }) {
  const [terapias, setTerapias] = useState([]);
  const [form, setForm] = useState({
    terapia_id: '',
    data: '',
    horario: '',
  });

  useEffect(() => {
    async function buscarTerapias() {
      try {
        const response = await fetch('http://127.0.0.1:5000/terapias');
        const data = await response.json();
        setTerapias(data);
      } catch (error) {
        console.error('Erro ao carregar terapias:', error);
      }
    }
    buscarTerapias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      cliente_id: clienteId,
      terapia_id: form.terapia_id,
      data: form.data,
      horario: form.horario,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Agendamento realizado com sucesso!');
        onAgendamentoConcluido();
      } else {
        alert(data.erro || 'Erro ao agendar.');
      }
    } catch (error) {
      console.error('Erro ao agendar:', error);
      alert('Erro de conexão.');
    }
  };

  return (
    <div className="agendamento-container">
      <h2>📅 Agendar Sessão</h2>
      <form onSubmit={handleSubmit} className="agendamento-form">
        <label>
          Terapia:
          <select name="terapia_id" value={form.terapia_id} onChange={handleChange} required>
            <option value="">Selecione</option>
            {terapias.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Data:
          <input type="date" name="data" value={form.data} onChange={handleChange} required />
        </label>
        <label>
          Horário:
          <input type="time" name="horario" value={form.horario} onChange={handleChange} required />
        </label>
        <button type="submit">Agendar</button>
      </form>
    </div>
  );
}

export default AgendamentoCliente;
