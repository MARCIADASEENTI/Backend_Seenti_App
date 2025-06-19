// src/components/cliente/CadastroUsuario.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroUsuario() {
  const [form, setForm] = useState({
    email: "",
    senha: "",
    consentimento: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulário enviado:", form);

    try {
      const response = await fetch("http://127.0.0.1:5000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem);
        navigate("/login");
      } else {
        alert(data.erro || "Erro ao cadastrar usuário.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            name="consentimento"
            checked={form.consentimento}
            onChange={handleChange}
            required
          />
          <span>Eu aceito os termos de uso e política de privacidade</span>
        </label>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default CadastroUsuario;
