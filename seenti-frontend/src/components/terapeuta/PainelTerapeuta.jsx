// src/components/PainelTerapeuta.jsx
import React, { useState, useEffect } from 'react';
import './PainelTerapeuta.css';

function PainelTerapeuta() {
  const [clientes, setClientes] = useState([]);
  const [anamneses, setAnamneses] = useState([]);
  const [terapias, setTerapias] = useState([]);
  const [novaTerapia, setNovaTerapia] = useState({ codigo: '', nome: '', protocolo_execucao: '' });
  const [mensagem, setMensagem] = useState('');

  // Buscar clientes
  const buscarClientes = async () => {
    const res = await fetch("http://127.0.0.1:5000/clientes");
    const data = await res.json();
    setClientes(data);
  };

  // Buscar anamneses
  const buscarAnamneses = async () => {
    const res = await fetch("http://127.0.0.1:5000/anamneses");
    const data = await res.json();
    setAnamneses(data);
  };

  // Buscar terapias
  const buscarTerapias = async () => {
    const res = await fetch("http://127.0.0.1:5000/terapias");
    const data = await res.json();
    setTerapias(data);
  };

  // Criar nova terapia
  const handleNovaTerapia = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:5000/terapias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaTerapia),
    });
    const data = await res.json();
    setMensagem(data.mensagem || data.erro);
    setNovaTerapia({ codigo: '', nome: '', protocolo_execucao: '' });
    buscarTerapias();
  };

  return (
    <div className="painel-terapeuta">
      <h2>👩‍⚕️ Painel do Terapeuta</h2>

      <button onClick={buscarClientes}>📋 Ver clientes</button>
      {clientes.length > 0 && (
        <ul>
          {clientes.map((c) => (
            <li key={c.id}>{c.nome_completo} - {c.telefone}</li>
          ))}
        </ul>
      )}

      <button onClick={buscarAnamneses}>🧠 Ver anamneses</button>
      {anamneses.length > 0 && (
        <ul>
          {anamneses.map((a) => (
            <li key={a.id}>{a.identificacao?.nome_completo || "Sem nome"} - {a.queixa_principal}</li>
          ))}
        </ul>
      )}

      <button onClick={buscarTerapias}>🧘 Ver terapias</button>
      {terapias.length > 0 && (
        <ul>
          {terapias.map((t) => (
            <li key={t.id}>{t.codigo} - {t.nome}</li>
          ))}
        </ul>
      )}

      <h3>➕ Criar nova terapia</h3>
      <form onSubmit={handleNovaTerapia}>
        <input
          type="text"
          placeholder="Código"
          value={novaTerapia.codigo}
          onChange={(e) => setNovaTerapia({ ...novaTerapia, codigo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Nome"
          value={novaTerapia.nome}
          onChange={(e) => setNovaTerapia({ ...novaTerapia, nome: e.target.value })}
          required
        />
        <textarea
          placeholder="Protocolo de execução"
          value={novaTerapia.protocolo_execucao}
          onChange={(e) => setNovaTerapia({ ...novaTerapia, protocolo_execucao: e.target.value })}
        />
        <button type="submit">Salvar terapia</button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default PainelTerapeuta;
