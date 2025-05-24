function TelaBoasVindas({ onAvancar }) {
  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h2>🎉 Bem-vinda ao Projeto Seenti!</h2>
      <p>
        Seu cadastro foi concluído com sucesso. Agradecemos pela confiança!
      </p>
      <p>
        Agora você está pronta para iniciar sua jornada terapêutica conosco.
      </p>
      <button onClick={onAvancar}>Avançar</button>
    </div>
  );
}

export default TelaBoasVindas;
