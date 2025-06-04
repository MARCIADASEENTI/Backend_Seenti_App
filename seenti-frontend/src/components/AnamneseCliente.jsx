// src/components/AnamneseCliente.jsx
import React, { useState } from 'react';
import './AnamneseCliente.css';

function AnamneseCliente({ clienteId, onVoltar }) {
  const [form, setForm] = useState({
    data: '',
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
      data: form.data,
      identificacao: form.identificacao,
      queixa_principal: form.queixa_principal,
      observacoes_finais: form.observacoes_finais,
      terapia_id: "000000000000000000000000" // ID placeholder por enquanto
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/anamneses", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Anamnese enviada com sucesso!");
        onVoltar();
      } else {
        alert(data.erro || "Erro ao enviar anamnese.");
      }
    } catch (error) {
      console.error("Erro ao enviar anamnese:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="anamnese-container">
      <h2>Formulário de Anamnese</h2>
      <form className="anamnese-form" onSubmit={handleSubmit}>
        <label>
          Data:
          <input type="date" name="data" value={form.data} onChange={handleChange} required />
        </label>
        <label>
          Identificação:
          <input type="text" name="identificacao" value={form.identificacao} onChange={handleChange} required />
        </label>
        <label>
          Queixa Principal:
          <textarea name="queixa_principal" value={form.queixa_principal} onChange={handleChange} required />
        </label>
        <label>
          Observações Finais:
          <textarea name="observacoes_finais" value={form.observacoes_finais} onChange={handleChange} />
        </label>
        <div className="botoes">
          <button type="button" onClick={onVoltar}>Voltar</button>
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default AnamneseCliente;
