// src/components/AgendamentoCliente.jsx
import React, { useState } from 'react';
import './AgendamentoCliente.css';

function AgendamentoCliente({ clienteId, onVoltar }) {
  const [form, setForm] = useState({
    data: '',
    horario: '',
    motivo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      cliente_id: clienteId,
      data: form.data,
      horario: form.horario,
      motivo: form.motivo
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/agendamentos", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Agendamento realizado com sucesso!");
        onVoltar();
      } else {
        alert(data.erro || "Erro ao agendar.");
      }
    } catch (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="agendamento-container">
      <h2>Agendar Atendimento</h2>
      <form className="agendamento-form" onSubmit={handleSubmit}>
        <label>
          Data:
          <input type="date" name="data" value={form.data} onChange={handleChange} required />
        </label>
        <label>
          Horário:
          <input type="time" name="horario" value={form.horario} onChange={handleChange} required />
        </label>
        <label>
          Motivo:
          <textarea name="motivo" value={form.motivo} onChange={handleChange} required />
        </label>
        <div className="botoes">
          <button type="button" onClick={onVoltar}>Voltar</button>
          <button type="submit">Agendar</button>
        </div>
      </form>
    </div>
  );
}

export default AgendamentoCliente;
