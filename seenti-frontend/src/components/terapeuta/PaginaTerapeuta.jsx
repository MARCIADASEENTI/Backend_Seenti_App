// src/components/PaginaTerapeuta.jsx
import React, { useEffect, useState } from "react";
import PainelTerapeuta from "./PainelTerapeuta";

function PaginaTerapeuta({ terapeutaId, onLogout }) {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/usuarios");
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarUsuarios();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>👩‍⚕️ Página do Terapeuta</h2>
      <button onClick={onLogout}>Sair</button>

      <h3>Lista de Usuários</h3>
      {carregando ? (
        <p>Carregando usuários...</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.id}>
              {u.email} — {u.tipo_usuario === "T" ? "Terapeuta" : "Cliente"}
            </li>
          ))}
        </ul>
      )}

      <hr />
      <PainelTerapeuta />
    </div>
  );
}

export default PaginaTerapeuta;
