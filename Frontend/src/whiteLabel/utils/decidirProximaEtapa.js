import axios from "axios";

export async function decidirProximaEtapa(navigate) {
  const token = localStorage.getItem("token");
  const usuarioId = localStorage.getItem("usuario_id");
  const clienteId = localStorage.getItem("cliente_id");
  const termoAceito = localStorage.getItem("termo_aceito") === "true";

  if (!token) {
    navigate("/login");
    return;
  }

  if (!termoAceito) {
    navigate("/termo");
    return;
  }

  if (!clienteId) {
    navigate("/cadastro-cliente");
    return;
  }

  try {
    const res = await axios.get(`http://localhost:5000/anamneses/cliente/${clienteId}`);
    const jaPreencheuAnamnese = res.data.existe;

    if (jaPreencheuAnamnese) {
      navigate("/pagina-cliente"); // ou /dashboard
    } else {
      navigate("/anamnese");
    }
  } catch (error) {
    console.error("Erro ao verificar anamnese:", error);
    navigate("/anamnese"); // fallback se erro
  }
}
