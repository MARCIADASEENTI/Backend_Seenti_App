// src/components/cliente/CadastroCliente.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CadastroCliente() {
  const navigate = useNavigate();
  const [usuarioId, setUsuarioId] = useState(null);
  const [form, setForm] = useState({
    primeiro_nome: "",
    sobrenome: "",
    nome_social: "",
    cpf: "",
    telefone: "",
    data_nascimento: "",
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      caixa_postal: ""
    }
  });

  useEffect(() => {
    const id = localStorage.getItem("usuario_id");
    if (!id) {
      navigate("/login");
    } else {
      setUsuarioId(id);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const campo = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [campo]: value,
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
      const res = await fetch("http://127.0.0.1:5000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        navigate("/boas-vindas");
      } else {
        alert(data.erro || "Erro ao cadastrar cliente.");
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Cliente</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" name="primeiro_nome" placeholder="Primeiro Nome" value={form.primeiro_nome} onChange={handleChange} required />
        <input type="text" name="sobrenome" placeholder="Sobrenome" value={form.sobrenome} onChange={handleChange} required />
        <input type="text" name="nome_social" placeholder="Nome Social (opcional)" value={form.nome_social} onChange={handleChange} />
        <input type="text" name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required />
        <input type="text" name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
        <input type="date" name="data_nascimento" placeholder="Data de Nascimento" value={form.data_nascimento} onChange={handleChange} required />

        <h3 className="text-lg font-semibold mt-4">Endereço</h3>
        <input type="text" name="endereco.rua" placeholder="Rua" value={form.endereco.rua} onChange={handleChange} />
        <input type="text" name="endereco.numero" placeholder="Número" value={form.endereco.numero} onChange={handleChange} />
        <input type="text" name="endereco.complemento" placeholder="Complemento" value={form.endereco.complemento} onChange={handleChange} />
        <input type="text" name="endereco.bairro" placeholder="Bairro" value={form.endereco.bairro} onChange={handleChange} />
        <input type="text" name="endereco.cidade" placeholder="Cidade" value={form.endereco.cidade} onChange={handleChange} />
        <input type="text" name="endereco.uf" placeholder="UF" value={form.endereco.uf} onChange={handleChange} />
        <input type="text" name="endereco.cep" placeholder="CEP" value={form.endereco.cep} onChange={handleChange} />
        <input type="text" name="endereco.caixa_postal" placeholder="Caixa Postal" value={form.endereco.caixa_postal} onChange={handleChange} />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Salvar Cliente
        </button>
      </form>
    </div>
  );
}

export default CadastroCliente;
