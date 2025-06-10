// src/components/Home.jsx
import React from "react";
import './Home.css';

function Home({ irParaCliente, irParaTerapeuta }) {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao Seenti</h1>
      <p>Escolha seu perfil:</p>
      <div className="home-botoes">
        <button onClick={irParaCliente}>Sou Cliente</button>
        <button onClick={irParaTerapeuta}>Sou Terapeuta</button>
      </div>
    </div>
  );
}

export default Home;
