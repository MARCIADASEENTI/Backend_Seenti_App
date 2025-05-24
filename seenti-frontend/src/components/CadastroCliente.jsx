import { useState } from 'react';

function CadastroCliente({ usuarioId, onCadastroCompleto }) {
  const [form, setForm] = useState({
    usuario_id: usuarioId,
    nome_completo: '',
    telefone: '',
    data_nascimento: '',
    endereco: {
      rua: '', numero: '', complemento: '', bairro: '', cidade: '',
      estado: '', uf: '', cep: '', caixa_postal: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("endereco.")) {
      const campo = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [campo]: value }
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
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (data.mensagem) {
        alert(data.mensagem);
        onCadastroCompleto();
      } else {
        alert(data.erro || "Erro inesperado.");
      }
    } catch (error) {
      alert("Erro ao cadastrar cliente.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Cadastro de Cliente</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome completo: <input name="nome_completo" value={form.nome_completo} onChange={handleChange} required /></label><br />
        <label>Telefone: <input name="telefone" value={form.telefone} onChange={handleChange} /></label><br />
        <label>Data de nascimento: <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} /></label><br />

        <h4>Endereço:</h4>
        {Object.entries(form.endereco).map(([campo, valor]) => (
          <label key={campo}>
            {campo[0].toUpperCase() + campo.slice(1)}:{" "}
            <input name={`endereco.${campo}`} value={valor} onChange={handleChange} />
            <br />
          </label>
        ))}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default CadastroCliente;
