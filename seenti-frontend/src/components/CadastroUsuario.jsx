import { useState } from 'react';

function CadastroUsuario({ onCadastroSucesso }) {
  const [form, setForm] = useState({
    email: '',
    cpf: '',
    senha: '',
    consentimento: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      alert(data.mensagem || data.erro);

      if (response.ok && onCadastroSucesso) {
        onCadastroSucesso();
      }

    } catch (error) {
      alert('Erro ao cadastrar usuário.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:<br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label><br />

        <label>
          CPF:<br />
          <input type="text" name="cpf" value={form.cpf} onChange={handleChange} required />
        </label><br />

        <label>
          Senha:<br />
          <input type="password" name="senha" value={form.senha} onChange={handleChange} required />
        </label><br />

        <label>
          <input type="checkbox" name="consentimento" checked={form.consentimento} onChange={handleChange} />
          Aceito os termos da LGPD
        </label><br />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroUsuario;
