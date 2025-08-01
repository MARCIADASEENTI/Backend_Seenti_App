// src/components/cliente/Login.jsx

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    if (!email || !senha) {
      setErro("Por favor, preencha email e senha.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        email,
        senha,
      });
      
    

      if (res.status === 200) {
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("tipo_usuario", res.data.tipo_usuario);

        navigate("/boas-vindas"); // Redireciona para a tela de boas-vindas
      }
    } catch (err) {
      console.error("Erro de login:", err);
      if (err?.response?.status === 404) {
        setErro("Usuário não encontrado. Cadastre-se.");
      } else if (err?.response?.status === 401) {
        setErro("Senha incorreta. Tente novamente.");
      } else {
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  const irParaCadastro = () => {
    navigate("/cadastro-usuario");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Login do Cliente
      </h2>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center mt-4">
        Não tem conta?{" "}
        <button
          onClick={irParaCadastro}
          className="text-green-700 underline hover:text-green-900"
        >
          Cadastre-se aqui
        </button>
      </p>
    </div>
  );
}
