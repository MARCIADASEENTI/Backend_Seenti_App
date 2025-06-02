// src/components/AnamneseCliente.jsx
import React, { useState } from 'react';
import './AnamneseCliente.css';

function AnamneseCliente({ clienteId, onVoltar }) {
  const [form, setForm] = useState({
    identificacao: '',
    queixa_principal: '',
    observacoes_finais: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      cliente_id: clienteId,
      identificacao: form.identificacao,
      queixa_principal: form.queixa_principal,
      observacoes_finais: form.observacoes_finais,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/anamneses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem || 'Anamnese enviada com sucesso!');
        onVoltar(); // volta à página do cliente
      } else {
        alert(data.erro || 'Erro ao enviar anamnese.');
      }
    } catch (error) {
      console.error('Erro ao enviar anamnese:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div className="anamnese-container">
      <h2>Preenchimento de Anamnese</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          name="identificacao"
          placeholder="Identificação"
          value={form.identificacao}
          onChange={handleChange}
          required
        />
        <textarea
          name="queixa_principal"
          placeholder="Queixa principal"
          value={form.queixa_principal}
          onChange={handleChange}
          required
        />
        <textarea
          name="observacoes_finais"
          placeholder="Observações finais"
          value={form.observacoes_finais}
          onChange={handleChange}
        />
        <button type="submit">Enviar</button>
        <button type="button" onClick={onVoltar}>
          Voltar
        </button>
      </form>
    </div>
  );
}

export default AnamneseCliente;
