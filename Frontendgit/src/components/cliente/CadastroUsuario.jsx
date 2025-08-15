// src/components/cliente/CadastroUsuario.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CadastroUsuario() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async () => {
    setErro("");
    setLoading(true);

    if (!email || !senha) {
      setErro("Preencha o email e a senha para continuar.");
      setLoading(false);
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/usuarios`, {
        email,
        senha,
        tipo_usuario: "C",
        tenant_id: "686af5e0bb776faa73fa8e03" // Tenant padrão
      });
      // ... resto do código
    

      if (res.status === 201) {
        // Salva o ID do usuário criado
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("cadastro_email", email);
        localStorage.setItem("cadastro_senha", senha);
        localStorage.setItem("cadastro_tipo", "C");
        
        // Vai para o termo de uso
        navigate("/termo");
      } else {
        setErro("Erro ao criar usuário. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setErro("Email já cadastrado. Use outro email ou faça login.");
      } else if (err.response?.status === 400) {
        setErro(err.response.data.erro || "Dados inválidos. Revise os campos.");
      } else {
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Cadastro de Usuário
      </h2>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleCadastro(); }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha (mínimo 8 caracteres)"
          className="border rounded px-3 py-2"
          minLength="8"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      <p className="text-center mt-4">
        Já possui conta?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-green-700 underline hover:text-green-900"
        >
          Voltar para o Login
        </button>
      </p>
    </div>
  );
}
