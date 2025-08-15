// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RouterCliente from "./components/cliente/RouterCliente";

function App() {
  return (
    <Router>
      <RouterCliente />
    </Router>
  );
}

export default App;
