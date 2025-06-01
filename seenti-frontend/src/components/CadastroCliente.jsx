// src/components/CadastroCliente.jsx
import React, { useState } from 'react';
import './CadastroCliente.css';

function CadastroCliente({ usuarioId, onCadastroFinalizado }) {
  const [form, setForm] = useState({
    nome_completo: '',
    telefone: '',
    data_nascimento: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      uf: '',
      cep: '',
      caixa_postal: '',
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.endereco) {
      setForm((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [name]: value }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, usuario_id: usuarioId };

    try {
      const response = await fetch('http://127.0.0.1:5000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.mensagem);
        onCadastroFinalizado(payload); // Envia os dados do cliente
      } else {
        alert(data.erro || 'Erro ao cadastrar cliente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro de conexão.');
    }
  };

  return (
    <div className="cliente-container">
      <h2>Cadastro do Cliente</h2>
      <form className="cliente-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nome completo:</label>
          <input type="text" name="nome_completo" value={form.nome_completo} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Telefone:</label>
          <input type="text" name="telefone" value={form.telefone} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Data de nascimento:</label>
          <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} required />
        </div>

        <h3>Endereço</h3>
        {Object.entries(form.endereco).map(([key, value]) => (
          <div className="input-group" key={key}>
            <label>{key.replace('_', ' ')}:</label>
            <input type="text" name={key} value={value} onChange={handleChange} />
          </div>
        ))}

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default CadastroCliente;
