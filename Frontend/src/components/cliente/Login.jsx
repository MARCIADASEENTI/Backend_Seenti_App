// src/components/cliente/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { brand } from "../../whiteLabel/config/brandConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    if (!email || !senha) {
      setErro("Por favor, preencha email e senha.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/login", { email, senha });

      if (res.status === 200) {
        const usuario_id = res.data.usuario_id;
        localStorage.setItem("usuario_id", usuario_id);
        localStorage.setItem("tipo_usuario", res.data.tipo_usuario);

        // 🔹 Verifica se o cliente existe
        let cliente = null;
        try {
          const clienteRes = await api.get(`/clientes/usuario/${usuario_id}`);
          cliente = clienteRes.data;
          // 🔹 Salva o cliente_id no localStorage se o cliente existir
          if (cliente && cliente._id) {
            localStorage.setItem("cliente_id", cliente._id);
          }
        } catch {
          cliente = null;
        }

        // 🔹 Verifica se o termo foi assinado
        let termoAssinado = false;
        try {
          const termoRes = await api.get(`/termo-assinado/${usuario_id}`);
          termoAssinado = termoRes.data.assinado;
        } catch {
          termoAssinado = false;
        }

        // 🔹 Verifica se já existe anamnese preenchida
        let possuiAnamnese = false;
        if (cliente) {
          try {
            const anamnesesRes = await api.get(`/anamneses/cliente/${cliente._id}`);
            possuiAnamnese = anamnesesRes.data.length > 0;
          } catch {
            possuiAnamnese = false;
          }
        }

        // 🔹 Regras de redirecionamento
        if (!termoAssinado) {
          navigate("/termo");
        } else if (!cliente) {
          navigate("/cadastro-cliente");
        } else if (!possuiAnamnese) {
          navigate("/anamnese");
        } else {
          navigate("/perfil");
        }
      }
    } catch (err) {
      console.error("Erro de login:", err);
      if (err?.response?.status === 404) {
        setErro("Usuário não encontrado. Cadastre-se.");
      } else if (err?.response?.status === 401) {
        setErro("Senha incorreta. Tente novamente.");
      } else {
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  const irParaCadastro = () => {
    navigate("/cadastro-usuario");
  };

  // Aplicar cores do WhiteLabel
  const primaryColor = brand?.primaryColor || '#AC80DD';
  const secondaryColor = brand?.secondaryColor || '#E91E63';

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Bem-vindo(a) de volta!
        </h1>
        <p className="text-gray-600 text-lg">
          Acesse sua conta para continuar sua jornada de bem-estar
        </p>
      </div>

      {erro && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-600 text-lg mr-2">⚠️</span>
            <p className="text-red-700 text-sm">{erro}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">📧</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔒</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            backgroundColor: primaryColor,
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = secondaryColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Entrando...
            </span>
          ) : (
            '🚀 Entrar'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Não tem uma conta ainda?
        </p>
        <button
          onClick={irParaCadastro}
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
        >
          <span className="mr-2">✨</span>
          Criar conta gratuita
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Ao continuar, você concorda com nossos{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">Termos de Uso</span>
          {' '}e{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">Política de Privacidade</span>
        </p>
      </div>
    </div>
  );
}
