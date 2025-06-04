import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSucesso, navegarParaTermo }) {
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });

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
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.aceito_termo) {
          onLoginSucesso(data.usuario_id);
        } else {
          alert('Você precisa aceitar os termos de uso antes de continuar.');
        onLoginSucesso(data.usuario_id);
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
      <h2>Login</h2>
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

export default Login;
