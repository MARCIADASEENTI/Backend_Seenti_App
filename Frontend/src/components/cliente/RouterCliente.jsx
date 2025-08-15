// src/components/cliente/RouterCliente.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout White Label com alias corrigido
import WhiteLabelLayout from "@white/layouts/WhiteLabelLayout";
import PerfilClienteLayout from "../../layouts/PerfilClienteLayout";

// Componentes de fluxo do cliente
import Login from "./Login";
import CadastroUsuario from "./CadastroUsuario";
import TermoUso from "./TermoUso";
import CadastroCliente from "./CadastroCliente";
import BoasVindasCliente from "./BoasVindasCliente";
import PaginaCliente from "./PaginaCliente";
import AnamneseCliente from "./AnamneseCliente";
import AgendamentoCliente from "./AgendamentoCliente";

export default function RouterCliente() {
  return (
    <Routes>
      {/* Rota padrão */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Fluxo de autenticação - Usa WhiteLabelLayout */}
      <Route path="/login" element={
        <WhiteLabelLayout>
          <Login />
        </WhiteLabelLayout>
      } />
      <Route path="/cadastro-usuario" element={
        <WhiteLabelLayout>
          <CadastroUsuario />
        </WhiteLabelLayout>
      } />
      <Route path="/termo" element={
        <WhiteLabelLayout>
          <TermoUso />
        </WhiteLabelLayout>
      } />
      
      {/* Fluxo de cadastro - Usa WhiteLabelLayout */}
      <Route path="/cadastro-cliente" element={
        <WhiteLabelLayout>
          <CadastroCliente />
        </WhiteLabelLayout>
      } />
      <Route path="/boas-vindas" element={
        <WhiteLabelLayout>
          <BoasVindasCliente />
        </WhiteLabelLayout>
      } />
      
      {/* Área do cliente - Usa PerfilClienteLayout com barra lateral */}
      <Route path="/perfil" element={
        <PerfilClienteLayout>
          <PaginaCliente />
        </PerfilClienteLayout>
      } />
      <Route path="/anamnese" element={
        <PerfilClienteLayout>
          <AnamneseCliente />
        </PerfilClienteLayout>
      } />
      <Route path="/agendamentos" element={
        <PerfilClienteLayout>
          <AgendamentoCliente />
        </PerfilClienteLayout>
      } />
      
      {/* Rota legada para compatibilidade */}
      <Route path="/cliente" element={<Navigate to="/perfil" />} />

      {/* Rota fallback para páginas não encontradas */}
      <Route
        path="*"
        element={
          <WhiteLabelLayout>
            <h2 className="text-center mt-20 text-red-600">
              Página não encontrada.
            </h2>
          </WhiteLabelLayout>
        }
      />
    </Routes>
  );
}
