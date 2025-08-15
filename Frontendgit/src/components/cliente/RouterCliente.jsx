// src/components/cliente/RouterCliente.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout White Label com alias corrigido
import WhiteLabelLayout from "@white/layouts/WhiteLabelLayout";

// Componentes de fluxo do cliente
import Login from "./Login";
import CadastroUsuario from "./CadastroUsuario";
import TermoUso from "./TermoUso";
import CadastroCliente from "./CadastroCliente";
import BoasVindasCliente from "./BoasVindasCliente";
import PaginaCliente from "./PaginaCliente";
import AnamneseCliente from "./AnamneseCliente";

export default function RouterCliente() {
  return (
    <WhiteLabelLayout>
      <Routes>
        {/* Rota padrão */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Fluxo de autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/termo" element={<TermoUso />} />
        
        {/* Fluxo de cadastro */}
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route path="/boas-vindas" element={<BoasVindasCliente />} />
        
        {/* Área do cliente */}
        <Route path="/perfil" element={<PaginaCliente />} />
        <Route path="/anamnese" element={<AnamneseCliente />} />
        
        {/* Rota legada para compatibilidade */}
        <Route path="/cliente" element={<Navigate to="/perfil" />} />

        {/* Rota fallback para páginas não encontradas */}
        <Route
          path="*"
          element={
            <h2 className="text-center mt-20 text-red-600">
              Página não encontrada.
            </h2>
          }
        />
      </Routes>
    </WhiteLabelLayout>
  );
}
