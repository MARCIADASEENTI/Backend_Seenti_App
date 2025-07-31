import { useNavigate } from "react-router-dom";

export default function BoasVindasCliente() {
  const navigate = useNavigate();

  const continuar = () => {
    navigate("/cadastro-cliente");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-3xl font-bold mb-4 text-green-700 text-center">
        Seja muito bem-vindo(a)!
      </h2>
      <p className="mb-6 text-justify text-gray-700">
        Estamos felizes em ter você por aqui. 😊
        <br />
        Nesta próxima etapa, você preencherá seus dados pessoais para que possamos
        oferecer um atendimento personalizado e seguro.
        <br /><br />
        Fique tranquilo: todas as informações são confidenciais e tratadas com
        segurança.
      </p>
      <div className="flex justify-center">
        <button
          onClick={continuar}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
