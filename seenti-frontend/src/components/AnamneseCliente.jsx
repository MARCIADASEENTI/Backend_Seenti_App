import React, { useState } from 'react';
import './AnamneseCliente.css';

function AnamneseCliente({ cliente, onVoltar }) {
  const [form, setForm] = useState({
    cliente_id: cliente?.id || '',
    terapia_id: '', // será melhorado futuramente
    queixa_principal: '',
    identificacao: '',
    observacoes_finais: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/anamneses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.mensagem || 'Anamnese salva com sucesso!');
        onVoltar();
      } else {
        alert(data.erro || 'Erro ao salvar anamnese.');
      }
    } catch (error) {
      console.error('Erro ao enviar anamnese:', error);
      alert('Erro de conexão ao enviar anamnese.');
    }
  };

  return (
    <div className="anamnese-container">
      <h2>Anamnese</h2>
      <form onSubmit={handleSubmit} className="anamnese-form">
        <label>
          Identificação:
          <input
            type="text"
            name="identificacao"
            value={form.identificacao}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Queixa Principal:
          <textarea
            name="queixa_principal"
            value={form.queixa_principal}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Observações Finais:
          <textarea
            name="observacoes_finais"
            value={form.observacoes_finais}
            onChange={handleChange}
          />
        </label>
        <div className="anamnese-botoes">
          <button type="submit">Enviar</button>
          <button type="button" onClick={onVoltar}>Voltar</button>
        </div>
      </form>
    </div>
  );
}

export default AnamneseCliente;
