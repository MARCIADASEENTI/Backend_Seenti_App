import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AnamneseCliente() {
  const navigate = useNavigate();
  const [clienteId, setClienteId] = useState(null);
  const [form, setForm] = useState({
    identificacao: {
      nome_completo: "",
      idade: "",
      genero: "",
      profissao: "",
    },
    queixa_principal: "",
    historico_familiar: "",
    medicamentos_uso: "",
    alergias: "",
    observacoes_finais: ""
  });

  useEffect(() => {
    const id = localStorage.getItem("cliente_id");
    if (!id) {
      navigate("/login");
    } else {
      setClienteId(id);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("identificacao.")) {
      const campo = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        identificacao: {
          ...prev.identificacao,
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
      cliente_id: clienteId,
      ...form,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/anamneses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Anamnese enviada com sucesso!");
        navigate("/pagina-cliente");
      } else {
        alert(data.erro || "Erro ao enviar anamnese.");
      }
    } catch (err) {
      console.error("Erro ao enviar anamnese:", err);
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Anamnese</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" name="identificacao.nome_completo" placeholder="Nome completo" value={form.identificacao.nome_completo} onChange={handleChange} required />
        <input type="number" name="identificacao.idade" placeholder="Idade" value={form.identificacao.idade} onChange={handleChange} />
        <input type="text" name="identificacao.genero" placeholder="Gênero" value={form.identificacao.genero} onChange={handleChange} />
        <input type="text" name="identificacao.profissao" placeholder="Profissão" value={form.identificacao.profissao} onChange={handleChange} />

        <textarea name="queixa_principal" placeholder="Queixa principal" value={form.queixa_principal} onChange={handleChange} required />
        <textarea name="historico_familiar" placeholder="Histórico familiar" value={form.historico_familiar} onChange={handleChange} />
        <textarea name="medicamentos_uso" placeholder="Medicamentos em uso" value={form.medicamentos_uso} onChange={handleChange} />
        <textarea name="alergias" placeholder="Alergias" value={form.alergias} onChange={handleChange} />
        <textarea name="observacoes_finais" placeholder="Observações finais" value={form.observacoes_finais} onChange={handleChange} />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Enviar Anamnese
        </button>
      </form>
    </div>
  );
}

export default AnamneseCliente;
