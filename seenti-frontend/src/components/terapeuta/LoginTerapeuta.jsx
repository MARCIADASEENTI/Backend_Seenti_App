// src/components/LoginTerapeuta.jsx
import React, { useState } from 'react';
import './Login.css';

function LoginTerapeuta({ onLoginSucesso }) {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          senha: form.senha
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.tipo_usuario === 'T') {
          onLoginSucesso(data.usuario_id);
        } else {
          alert("Este login é exclusivo para terapeutas.");
        }
      } else {
        setErro(data.erro || 'Erro ao realizar login.');
      }

    } catch (error) {
      console.error(error);
      setErro('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login do Terapeuta</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
        <button type="submit">Entrar</button>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
      </form>
    </div>
  );
}

export default LoginTerapeuta;
