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
        // Buscar o cliente salvo para capturar o ID
        const res = await fetch('http://127.0.0.1:5000/clientes');
        const lista = await res.json();
        const cliente = lista.find((c) => c.usuario_id === usuarioId);
        onCadastroFinalizado(cliente?.id || null);
      } else {
        alert(data.erro || 'Erro ao cadastrar cliente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      alert('Erro de conexão.');
    }
  };

  return (
    <div className="cadastro-cliente-container">
      <h2>Complete seu cadastro</h2>
      <form onSubmit={handleSubmit} className="cadastro-cliente-form">
        <input type="text" name="nome_completo" placeholder="Nome completo" value={form.nome_completo} onChange={handleChange} required />
        <input type="tel" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
        <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} required />
        
        <h4>Endereço</h4>
        <input type="text" name="rua" placeholder="Rua" value={form.endereco.rua} onChange={handleChange} />
        <input type="text" name="numero" placeholder="Número" value={form.endereco.numero} onChange={handleChange} />
        <input type="text" name="complemento" placeholder="Complemento" value={form.endereco.complemento} onChange={handleChange} />
        <input type="text" name="bairro" placeholder="Bairro" value={form.endereco.bairro} onChange={handleChange} />
        <input type="text" name="cidade" placeholder="Cidade" value={form.endereco.cidade} onChange={handleChange} />
        <input type="text" name="estado" placeholder="Estado" value={form.endereco.estado} onChange={handleChange} />
        <input type="text" name="uf" placeholder="UF" value={form.endereco.uf} onChange={handleChange} />
        <input type="text" name="cep" placeholder="CEP" value={form.endereco.cep} onChange={handleChange} />
        <input type="text" name="caixa_postal" placeholder="Caixa Postal" value={form.endereco.caixa_postal} onChange={handleChange} />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default CadastroCliente;
