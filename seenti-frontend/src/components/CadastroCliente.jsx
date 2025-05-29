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
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.endereco) {
      setForm((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      usuario_id: usuarioId,
      ...form,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem);
        onCadastroFinalizado();
      } else {
        alert(data.erro || 'Erro ao cadastrar cliente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro ao cadastrar cliente.');
    }
  };

  return (
    <div className="cadastro-cliente-container">
      <h2>Cadastro de Cliente</h2>
      <form onSubmit={handleSubmit} className="cadastro-form">
        <label>
          Nome Completo:
          <input type="text" name="nome_completo" value={form.nome_completo} onChange={handleChange} required />
        </label>
        <label>
          Telefone:
          <input type="text" name="telefone" value={form.telefone} onChange={handleChange} />
        </label>
        <label>
          Data de Nascimento:
          <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} />
        </label>

        <h3>Endereço</h3>
        {['rua', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'uf', 'cep', 'caixa_postal'].map((campo) => (
          <label key={campo}>
            {campo.charAt(0).toUpperCase() + campo.slice(1)}:
            <input type="text" name={campo} value={form.endereco[campo]} onChange={handleChange} />
          </label>
        ))}

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default CadastroCliente;
