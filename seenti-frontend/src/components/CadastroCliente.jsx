// src/components/CadastroUsuario.jsx
import { useState } from 'react';
import './CadastroUsuario.css';

function CadastroUsuario({ onCadastroSucesso }) {
  const [form, setForm] = useState({
    email: '',
    senha: '',
    consentimento: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem);
        onCadastroSucesso(data.usuario_id);
      } else {
        alert(data.erro || 'Erro ao cadastrar usuário.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Erro ao cadastrar usuário.');
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit} className="cadastro-form">
        <label>
          E-mail:
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Senha:
          <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
        </label>
        <label className="termo-checkbox">
          <input
            type="checkbox"
            name="consentimento"
            checked={form.consentimento}
            onChange={handleChange}
            required
          />
          Eu aceito os termos de uso e política de privacidade
        </label>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroUsuario;
