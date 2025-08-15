import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { brand } from '../../whiteLabel/config/brandConfig';

const AnamneseCliente = () => {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [form, setForm] = useState({
    objetivo: '',
    area_enfase: '',
    dor_atual: '',
    funcionamento_intestinal: '',
    stress_diario: '',
    enxaqueca: false,
    depressao: false,
    insonia: false,
    dor_mandibula: false,
    bruxismo: false,
    disturbio_renal: false,
    antecedente_oncologico: false,
    pedra_rim: false,
    pedra_vesicula: false,
    doenca_cronica: false,
    email: '',
    whatsapp: '',
    anticoncepcional: '',
    alimentacao: '',
    observacoes_saude: '',
    nao_gosta_massagem_em: ''
  });

  // Carregar dados do cliente para preencher email e whatsapp
  useEffect(() => {
    const carregarDadosCliente = async () => {
      try {
        const cliente_id = localStorage.getItem('cliente_id');
        if (cliente_id) {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clientes/${cliente_id}`);
          if (response.ok) {
            const cliente = await response.json();
            setForm(prev => ({
              ...prev,
              email: cliente.contato?.email || '',
              whatsapp: cliente.contato?.telefone || ''
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    carregarDadosCliente();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validarCampos = () => {
    const camposObrigatorios = [
      'objetivo', 'area_enfase', 'dor_atual', 'funcionamento_intestinal',
      'stress_diario', 'email', 'whatsapp'
    ];
    
    for (const campo of camposObrigatorios) {
      if (!form[campo]) {
        setErro(`Campo "${campo}" é obrigatório.`);
        return false;
      }
    }

    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w{2,}$/;
    if (!emailRegex.test(form.email)) {
      setErro('Formato de email inválido.');
      return false;
    }

    const whatsappRegex = /^\(?\d{2}\)? ?\d{4,5}-?\d{4}$/;
    if (!whatsappRegex.test(form.whatsapp)) {
      setErro('Formato de WhatsApp inválido. Use: (31) 99999-9999');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);

    const cliente_id = localStorage.getItem('cliente_id');
    if (!cliente_id) {
      setErro('Erro: cliente não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }

    if (!validarCampos()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/anamneses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente_id,
          dados: form
        })
      });
    
      if (response.status === 201) {
        setSucesso('✅ Anamnese enviada com sucesso!');
        setTimeout(() => navigate('/perfil'), 1500);
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          setErro('Você já possui uma anamnese registrada.');
        } else if (errorData?.erro) {
          setErro(errorData.erro);
        } else {
          setErro('Erro ao enviar anamnese. Verifique os dados ou tente novamente.');
        }
      }
    
    } catch (err) {
      console.error(err);
      setErro('Erro ao enviar anamnese. Verifique os dados ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Aplicar cores do WhiteLabel
  const primaryColor = brand?.primaryColor || '#1E3A8A';
  const secondaryColor = brand?.secondaryColor || '#AC80DD';

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando formulário...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: primaryColor }}>
        📋 Formulário de Anamnese
      </h2>
  
      {erro && (
        <div className="text-red-600 mb-4 p-3 bg-red-50 rounded border border-red-200">
          ⚠️ {erro}
        </div>
      )}
      {sucesso && (
        <div className="text-green-600 mb-4 p-3 bg-green-50 rounded border border-green-200">
          {sucesso}
        </div>
      )}
  
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Objetivo e Área de Ênfase */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
            🎯 Objetivo e Foco
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Principal *
              </label>
              <input
                type="text"
                name="objetivo"
                value={form.objetivo}
                onChange={handleChange}
                placeholder="Ex: Relaxamento e alívio lombar"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área de Ênfase *
              </label>
              <input
                type="text"
                name="area_enfase"
                value={form.area_enfase}
                onChange={handleChange}
                placeholder="Ex: Coluna lombar e ombros"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>
  
        {/* Dor e Sintomas */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
            🩺 Dor e Sintomas
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dor Atual *
              </label>
              <textarea
                name="dor_atual"
                value={form.dor_atual}
                onChange={handleChange}
                placeholder="Descreva sua dor atual, localização e características"
                className="w-full border border-gray-300 rounded px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
                disabled={loading}
              />
            </div>
  
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'enxaqueca', label: 'Enxaqueca' },
                { key: 'depressao', label: 'Depressão' },
                { key: 'insonia', label: 'Insônia' },
                { key: 'dor_mandibula', label: 'Dor Mandíbula' },
                { key: 'bruxismo', label: 'Bruxismo' },
                { key: 'disturbio_renal', label: 'Distúrbio Renal' },
                { key: 'antecedente_oncologico', label: 'Antecedente Oncológico' },
                { key: 'pedra_rim', label: 'Pedra no Rim' },
                { key: 'pedra_vesicula', label: 'Pedra na Vesícula' },
                { key: 'doenca_cronica', label: 'Doença Crônica' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={key}
                    checked={form[key]}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
  
        {/* Saúde Geral */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
            💊 Saúde Geral
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funcionamento Intestinal *
              </label>
              <select
                name="funcionamento_intestinal"
                value={form.funcionamento_intestinal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Selecione...</option>
                <option value="normal">Normal</option>
                <option value="preso">Preso</option>
                <option value="solto">Solto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stress Diário *
              </label>
              <select
                name="stress_diario"
                value={form.stress_diario}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Selecione...</option>
                <option value="baixo">Baixo</option>
                <option value="moderado">Moderado</option>
                <option value="alto">Alto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anticoncepcional
              </label>
              <input
                type="text"
                name="anticoncepcional"
                value={form.anticoncepcional}
                onChange={handleChange}
                placeholder="Se aplicável"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alimentação
              </label>
              <input
                type="text"
                name="alimentacao"
                value={form.alimentacao}
                onChange={handleChange}
                placeholder="Ex: Equilibrada, com frutas e vegetais"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
        </div>
  
        {/* Contato */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
            📞 Contato
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp *
              </label>
              <input
                type="text"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="(31) 99999-9999"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>
  
        {/* Observações */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>
            📝 Observações
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações de Saúde
              </label>
              <textarea
                name="observacoes_saude"
                value={form.observacoes_saude}
                onChange={handleChange}
                placeholder="Informações complementares sobre sua saúde"
                className="w-full border border-gray-300 rounded px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Áreas que não gosta de massagem
              </label>
              <input
                type="text"
                name="nao_gosta_massagem_em"
                value={form.nao_gosta_massagem_em}
                onChange={handleChange}
                placeholder="Ex: barriga, pés, rosto"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
        </div>
  
        {/* Botões */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/perfil')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition disabled:opacity-50"
            disabled={loading}
          >
            ← Voltar
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded text-white transition disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.target.style.backgroundColor = secondaryColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </span>
            ) : (
              '📤 Enviar Anamnese'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnamneseCliente; 