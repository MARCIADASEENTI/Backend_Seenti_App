import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AnamneseCliente = () => {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

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

    const cliente_id = localStorage.getItem('cliente_id');
    if (!cliente_id) {
      setErro('Erro: cliente não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }

    if (!validarCampos()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/anamneses`,
        {
          cliente_id,
          dados: form
        }
      );
    
      if (response.status === 201) {
        setSucesso('✅ Anamnese enviada com sucesso!');
        setTimeout(() => navigate('/perfil'), 1500);
      }
    
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setErro('Você já possui uma anamnese registrada.');
      } else if (err.response?.data?.erro) {
        setErro(err.response.data.erro);
      } else {
        setErro('Erro ao enviar anamnese. Verifique os dados ou tente novamente.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Formulário de Anamnese
      </h2>

      {erro && <p className="text-red-600 mb-4 p-3 bg-red-50 rounded">{erro}</p>}
      {sucesso && <p className="text-green-600 mb-4 p-3 bg-green-50 rounded">{sucesso}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Objetivo e Área de Ênfase */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Objetivo e Foco</h3>
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
                className="w-full border rounded px-3 py-2"
                required
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
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Dor e Sintomas */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Dor e Sintomas</h3>
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
                className="w-full border rounded px-3 py-2 h-20"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="enxaqueca"
                  checked={form.enxaqueca}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Enxaqueca</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="depressao"
                  checked={form.depressao}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Depressão</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="insonia"
                  checked={form.insonia}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Insônia</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="dor_mandibula"
                  checked={form.dor_mandibula}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Dor Mandíbula</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="bruxismo"
                  checked={form.bruxismo}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Bruxismo</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="disturbio_renal"
                  checked={form.disturbio_renal}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Distúrbio Renal</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="antecedente_oncologico"
                  checked={form.antecedente_oncologico}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Antecedente Oncológico</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="pedra_rim"
                  checked={form.pedra_rim}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Pedra no Rim</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="pedra_vesicula"
                  checked={form.pedra_vesicula}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Pedra na Vesícula</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="doenca_cronica"
                  checked={form.doenca_cronica}
                  onChange={handleChange}
                  className="rounded"
                />
                <span className="text-sm">Doença Crônica</span>
              </label>
            </div>
          </div>
        </div>

        {/* Saúde Geral */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Saúde Geral</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funcionamento Intestinal *
              </label>
              <select
                name="funcionamento_intestinal"
                value={form.funcionamento_intestinal}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
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
                className="w-full border rounded px-3 py-2"
                required
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
                className="w-full border rounded px-3 py-2"
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
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Contato</h3>
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
                className="w-full border rounded px-3 py-2"
                required
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
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Observações</h3>
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
                className="w-full border rounded px-3 py-2 h-20"
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
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate('/perfil')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnamneseCliente; 