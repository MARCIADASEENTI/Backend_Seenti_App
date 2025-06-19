// src/components/cliente/RouterCliente.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import CadastroCliente from "./CadastroCliente";
import AnamneseCliente from "./AnamneseCliente";
import BoasVindasCliente from "./BoasVindasCliente";
import TermoUso from "./TermoUso";
import PaginaCliente from "./PaginaCliente";

import WhiteLabelLayout from "../../whiteLabel/layouts/WhiteLabelLayout";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default function RouterCliente() {
  return (
    <WhiteLabelLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        <Route
          path="/anamnese"
          element={isAuthenticated() ? <AnamneseCliente /> : <Navigate to="/login" />}
        />
        <Route
          path="/boas-vindas"
          element={isAuthenticated() ? <BoasVindasCliente /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <PaginaCliente /> : <Navigate to="/login" />}
        />
        <Route path="/termo" element={<TermoUso />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </WhiteLabelLayout>
  );
}
