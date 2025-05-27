import { useState } from 'react';
import './CadastroCliente.css';

function CadastroCliente({ usuarioId }) {
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
      caixa_postal: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("endereco.")) {
      const campo = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [campo]: value
        }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, usuario_id: usuarioId })
      });
      const data = await response.json();
      alert(data.mensagem || data.erro);
    } catch (error) {
      alert("Erro ao cadastrar cliente.");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Cadastro de Cliente</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label>Nome completo:
          <input name="nome_completo" value={form.nome_completo} onChange={handleChange} required />
        </label>
        <label>Telefone:
          <input name="telefone" value={form.telefone} onChange={handleChange} />
        </label>
        <label>Data de nascimento:
          <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} />
        </label>

        <h4>Endereço:</h4>
        <label>Rua:
          <input name="endereco.rua" value={form.endereco.rua} onChange={handleChange} />
        </label>
        <label>Número:
          <input name="endereco.numero" value={form.endereco.numero} onChange={handleChange} />
        </label>
        <label>Complemento:
          <input name="endereco.complemento" value={form.endereco.complemento} onChange={handleChange} />
        </label>
        <label>Bairro:
          <input name="endereco.bairro" value={form.endereco.bairro} onChange={handleChange} />
        </label>
        <label>Cidade:
          <input name="endereco.cidade" value={form.endereco.cidade} onChange={handleChange} />
        </label>
        <label>Estado:
          <input name="endereco.estado" value={form.endereco.estado} onChange={handleChange} />
        </label>
        <label>UF:
          <input name="endereco.uf" value={form.endereco.uf} onChange={handleChange} />
        </label>
        <label>CEP:
          <input name="endereco.cep" value={form.endereco.cep} onChange={handleChange} />
        </label>
        <label>Caixa Postal:
          <input name="endereco.caixa_postal" value={form.endereco.caixa_postal} onChange={handleChange} />
        </label>

        <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem', fontWeight: 'bold' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default CadastroCliente;
