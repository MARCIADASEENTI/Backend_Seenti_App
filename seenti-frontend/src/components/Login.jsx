import { useState } from 'react';

function Login({ onLoginSucesso }) {
  const [form, setForm] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      alert(data.mensagem || data.erro);

      if (response.ok && onLoginSucesso) {
        onLoginSucesso(data.usuario_id);
      }

    } catch (error) {
      alert('Erro ao fazer login.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:<br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label><br />

        <label>
          Senha:<br />
          <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
        </label><br />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
