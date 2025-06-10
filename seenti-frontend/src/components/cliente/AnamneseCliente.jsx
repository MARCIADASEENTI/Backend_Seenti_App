// src/components/AnamneseCliente.jsx
import React, { useState } from 'react';
import './AnamneseCliente.css';

function AnamneseCliente({ clienteId, onVoltar }) {
  const [form, setForm] = useState({
    identificacao: {
      nome_completo: '',
      idade: '',
      sexo: '',
      profissao: '',
      estado_civil: '',
      escolaridade: '',
      religiao: ''
    },
    historico_clinico: {
      doencas_cronicas: [''],
      historico_familiar: [''],
      internacoes_cirurgias: [''],
      uso_medicamentos: [''],
      alergias: ['']
    },
    sinais_vitais: {
      pressao_arterial: '',
      temperatura_corporal: '',
      frequencia_cardiaca: ''
    },
    aspectos_psicossociais: {
      interacao_familiar: '',
      risco_isolamento_social: ''
    },
    aspectos_cognitivos_comportamentais: {
      lapsos_memoria: '',
      padroes_sono: '',
      alteracoes_humor: ''
    },
    pensamentos_suicidas: {
      resposta: '',
      detalhes: ''
    },
    uso_alcool_drogas: {
      resposta: '',
      detalhes: ''
    },
    revisao_sistemas: {
      cardiovascular: [''],
      respiratorio: [''],
      digestivo: [''],
      neurologico: ['']
    },
    estilo_vida: {
      alimentacao: '',
      atividade_fisica: '',
      habitos_sono: '',
      estresse_ansiedade: ''
    },
    mulheres: {
      historico_gestacoes: '',
      uso_contraceptivos: '',
      alteracoes_hormonais: ''
    },
    criancas_adolescentes: {
      aleitamento_materno: '',
      marcos_desenvolvimento: ''
    },
    imunizacoes: [],
    queixa_principal: '',
    observacoes_finais: ''
  });

  const handleChange = (e, path) => {
    const { name, value } = e.target;
    setForm(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path ? path.split('.') : [name];
      let current = clone;
      keys.slice(0, -1).forEach(k => (current = current[k]));
      current[keys.at(-1)] = value;
      return clone;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      cliente_id: clienteId,
      data: new Date().toISOString().split('T')[0],
      ...form
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/anamneses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Anamnese registrada com sucesso!');
        onVoltar();
      } else {
        alert(data.erro || 'Erro ao salvar anamnese');
      }
    } catch (error) {
      console.error('Erro ao enviar anamnese:', error);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="anamnese-container">
      <h2>Formulário de Anamnese</h2>
      <form className="anamnese-form" onSubmit={handleSubmit}>

        <fieldset>
          <legend>Identificação</legend>
          <input name="nome_completo" placeholder="Nome Completo" onChange={(e) => handleChange(e, 'identificacao.nome_completo')} />
          <input name="idade" placeholder="Idade" onChange={(e) => handleChange(e, 'identificacao.idade')} />
          <input name="sexo" placeholder="Sexo" onChange={(e) => handleChange(e, 'identificacao.sexo')} />
          <input name="profissao" placeholder="Profissão" onChange={(e) => handleChange(e, 'identificacao.profissao')} />
          <input name="estado_civil" placeholder="Estado Civil" onChange={(e) => handleChange(e, 'identificacao.estado_civil')} />
          <input name="escolaridade" placeholder="Escolaridade" onChange={(e) => handleChange(e, 'identificacao.escolaridade')} />
          <input name="religiao" placeholder="Religião" onChange={(e) => handleChange(e, 'identificacao.religiao')} />
        </fieldset>

        <fieldset>
          <legend>Queixa principal</legend>
          <textarea placeholder="Descreva sua queixa principal" onChange={(e) => handleChange(e, 'queixa_principal')} />
        </fieldset>

        <fieldset>
          <legend>Sinais Vitais</legend>
          <input placeholder="Pressão Arterial" onChange={(e) => handleChange(e, 'sinais_vitais.pressao_arterial')} />
          <input placeholder="Temperatura Corporal" onChange={(e) => handleChange(e, 'sinais_vitais.temperatura_corporal')} />
          <input placeholder="Frequência Cardíaca" onChange={(e) => handleChange(e, 'sinais_vitais.frequencia_cardiaca')} />
        </fieldset>

        <fieldset>
          <legend>Estilo de Vida</legend>
          <input placeholder="Alimentação" onChange={(e) => handleChange(e, 'estilo_vida.alimentacao')} />
          <input placeholder="Atividade Física" onChange={(e) => handleChange(e, 'estilo_vida.atividade_fisica')} />
          <input placeholder="Hábitos de Sono" onChange={(e) => handleChange(e, 'estilo_vida.habitos_sono')} />
          <input placeholder="Estresse/Ansiedade" onChange={(e) => handleChange(e, 'estilo_vida.estresse_ansiedade')} />
        </fieldset>

        <fieldset>
          <legend>Observações Finais</legend>
          <textarea placeholder="Observações adicionais" onChange={(e) => handleChange(e, 'observacoes_finais')} />
        </fieldset>

        <div className="botoes">
          <button type="button" onClick={onVoltar}>Voltar</button>
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  );
}

export default AnamneseCliente;
