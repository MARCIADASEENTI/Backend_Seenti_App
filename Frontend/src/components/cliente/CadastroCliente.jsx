import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CadastroCliente() {
  const [form, setForm] = useState({
    primeiro_nome: '',
    sobrenome: '',
    nome_social: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    genero: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validação de CPF
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    if (cpf === cpf[0].repeat(11)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto < 2 ? 0 : resto;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf[i]) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto < 2 ? 0 : resto;

    return cpf[9] === digito1.toString() && cpf[10] === digito2.toString();
  };

  // Validação de idade (18+)
  const validarIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  // Validação dos campos obrigatórios
  const validarCampos = () => {
    const { primeiro_nome, sobrenome, cpf, data_nascimento, telefone, rua, numero, bairro, cidade, estado, cep } = form;

    if (!primeiro_nome || !sobrenome || !cpf || !data_nascimento || !telefone) {
      setErro('⚠️ Preencha todos os campos obrigatórios.');
      return false;
    }

    if (!rua || !numero || !bairro || !cidade || !estado || !cep) {
      setErro('⚠️ Preencha todos os campos de endereço obrigatórios.');
      return false;
    }

    if (!validarCPF(cpf)) {
      setErro('⚠️ CPF inválido.');
      return false;
    }

    const idade = validarIdade(data_nascimento);
    if (idade < 18) {
      setErro('⚠️ É necessário ter 18 anos ou mais.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);

    const usuario_id = localStorage.getItem('usuario_id');

    if (!usuario_id) {
      setErro('Usuário não autenticado. Faça login novamente.');
      setLoading(false);
      navigate('/login');
      return;
    }

    if (!validarCampos()) {
      setLoading(false);
      return;
    }

    try {
      // Verifica se cliente já existe para o usuário atual
      const clienteExistente = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/clientes/usuario/${usuario_id}`);
      if (clienteExistente?.data?._id) {
        setLoading(false);
        navigate('/perfil');
        return;
      }
    } catch (error) {
      if (error?.response?.status !== 404) {
        setErro('Erro ao verificar cliente existente.');
        setLoading(false);
        return;
      }
      // Se 404, cliente não existe, segue o fluxo
    }

    try {
      const dadosCliente = {
        usuario_id,
        primeiro_nome: form.primeiro_nome.trim(),
        sobrenome: form.sobrenome.trim(),
        nome_social: form.nome_social.trim() || null,
        cpf: form.cpf.replace(/[^\d]/g, ''),
        data_nascimento: form.data_nascimento,
        genero: form.genero || null,
        contato: {
          telefone: form.telefone.replace(/[^\d]/g, ''),
          email_alternativo: null,
        },
        endereco: {
          rua: form.rua.trim(),
          numero: form.numero.trim(),
          complemento: form.complemento.trim() || null,
          bairro: form.bairro.trim(),
          cidade: form.cidade.trim(),
          estado: form.estado.trim(),
          cep: form.cep.replace(/[^\d]/g, ''),
        },
        tenant_id: '686af5e0bb776faa73fa8e03',
      };

      console.log('🔍 Enviando dados do cliente:', dadosCliente);
      console.log('🔍 CPF sendo enviado:', dadosCliente.cpf);

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/clientes`, dadosCliente);

      if (res.status === 201 && res.data.cliente_id) {
        localStorage.setItem('cliente_id', res.data.cliente_id);
        setSucesso('✅ Cadastro realizado com sucesso!');
        setTimeout(() => navigate('/perfil'), 1000);
      } else {
        setErro('Erro ao cadastrar cliente. Tente novamente.');
      }
    } catch (err) {
      console.error('❌ Erro detalhado:', err);
      console.error('❌ Status da resposta:', err.response?.status);
      console.error('❌ Dados da resposta:', err.response?.data);
      
      if (err.response?.status === 400) {
        setErro(err.response.data.erro || 'Dados inválidos ou incompletos. Revise os campos.');
      } else if (err.response?.status === 409) {
        // Cliente já cadastrado → redirecionar
        setErro('CPF já cadastrado na base de dados. Use outro CPF ou faça login.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 500) {
        setErro('Erro interno do servidor. Tente novamente.');
      } else {
        setErro('Erro de conexão com o servidor. Verifique sua internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 border rounded-lg shadow bg-white">
      
      {/* Botão Voltar */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Voltar
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
        Cadastro do Cliente
      </h2>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}
      {sucesso && <p className="text-green-600 mb-4">{sucesso}</p>}

      {/* Formulário continua igual */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        
        {/* Campos pessoais */}
        {/* ... restante dos inputs iguais ao seu código atual ... */}
        <div className="grid grid-cols-2 gap-2">
          <input
            name="primeiro_nome"
            placeholder="Primeiro nome *"
            value={form.primeiro_nome}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="sobrenome"
            placeholder="Sobrenome *"
            value={form.sobrenome}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        
        <input
          name="nome_social"
          placeholder="Nome social (opcional)"
          value={form.nome_social}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
        
        <input
          name="cpf"
          placeholder="CPF * (apenas números)"
          value={form.cpf}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          maxLength="14"
          required
        />
        
        <input
          name="data_nascimento"
          type="date"
          value={form.data_nascimento}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        
        <input
          name="telefone"
          placeholder="Telefone * (apenas números)"
          value={form.telefone}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />
        
        <select
          name="genero"
          value={form.genero}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Gênero (opcional)</option>
          <option value="Feminino">Feminino</option>
          <option value="Masculino">Masculino</option>
          <option value="Outro">Outro</option>
        </select>

        {/* Seção de Endereço */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Endereço</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <input
              name="rua"
              placeholder="Rua *"
              value={form.rua}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <input
              name="numero"
              placeholder="Número *"
              value={form.numero}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          
          <input
            name="complemento"
            placeholder="Complemento (opcional)"
            value={form.complemento}
            onChange={handleChange}
            className="border rounded px-3 py-2 mt-2"
          />
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              name="bairro"
              placeholder="Bairro *"
              value={form.bairro}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <input
              name="cidade"
              placeholder="Cidade *"
              value={form.cidade}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Estado *</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
            <input
              name="cep"
              placeholder="CEP * (00000-000)"
              value={form.cep}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              maxLength="9"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded text-white transition ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      
    </div>
  );
}