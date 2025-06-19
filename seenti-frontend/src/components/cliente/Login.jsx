import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login realizado:", data);

        if (data.tipo_usuario === "C") {
          // Armazena ID e token (simples por enquanto)
          localStorage.setItem("usuario_id", data.usuario_id);
          localStorage.setItem("token", "cliente_token");

          // Redireciona conforme aceite do termo
          if (data.aceito_termo) {
            navigate("/cadastro-cliente");
          } else {
            navigate("/termo");
          }
        } else {
          alert("Apenas clientes podem usar este login.");
        }

      } else {
        setErro(data.erro || "Erro ao realizar login.");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />

        {erro && <p className="text-red-600 text-sm mb-2">{erro}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;
