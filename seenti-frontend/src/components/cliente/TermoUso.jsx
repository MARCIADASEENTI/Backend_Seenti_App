// src/components/cliente/TermoUso.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TermoUso() {
  const [termo, setTermo] = useState(null);
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem("usuarioId");

  useEffect(() => {
    const carregarTermo = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/termos_texto");
        const data = await response.json();
        setTermo(data);
      } catch (error) {
        console.error("Erro ao carregar termo:", error);
      }
    };
    carregarTermo();
  }, []);

  const aceitarTermo = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/termos_uso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: usuarioId, aceito: true }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem);
        navigate("/cadastro-cliente");
      } else {
        alert(data.erro || "Erro ao registrar termo.");
      }
    } catch (error) {
      console.error("Erro ao aceitar termo:", error);
      alert("Erro ao aceitar termo.");
    }
  };

  if (!termo) return <p>Carregando termo de uso...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">{termo.titulo}</h1>
      <div
        className="prose max-w-none bg-white border p-4 rounded shadow-sm mb-6"
        dangerouslySetInnerHTML={{ __html: termo.conteudo_html }}
      />
      <button
        onClick={aceitarTermo}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Aceitar Termo de Uso
      </button>
    </div>
  );
}

export default TermoUso;
