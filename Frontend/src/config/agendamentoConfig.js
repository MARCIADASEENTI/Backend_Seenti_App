// src/config/agendamentoConfig.js
// Configurações do sistema de agendamentos

export const AGENDAMENTO_CONFIG = {
  // Horários disponíveis para agendamento
  horarios: {
    manha: [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
      "11:00", "11:30"
    ],
    tarde: [
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
      "17:00", "17:30"
    ],
    noite: [
      "18:00", "18:30", "19:00", "19:30"
    ]
  },

  // Duração padrão das sessões (em minutos)
  duracaoSessao: 60,

  // Intervalo entre sessões (em minutos)
  intervaloEntreSessoes: 30,

  // Dias da semana disponíveis
  diasDisponiveis: [
    "segunda", "terca", "quarta", "quinta", "sexta"
  ],

  // Configurações de cancelamento
  cancelamento: {
    // Horas mínimas antes da sessão para permitir cancelamento
    horasMinimasCancelamento: 24,
    // Permitir reagendamento
    permitirReagendamento: true
  },

  // Status dos agendamentos
  status: {
    PENDENTE: "pendente",
    CONFIRMADO: "confirmado",
    CANCELADO: "cancelado",
    REALIZADO: "realizado",
    NAO_COMPARECEU: "nao_compareceu"
  },

  // Cores para cada status
  statusColors: {
    pendente: "text-yellow-600 bg-yellow-100",
    confirmado: "text-green-600 bg-green-100",
    cancelado: "text-red-600 bg-red-100",
    realizado: "text-blue-600 bg-blue-100",
    nao_compareceu: "text-gray-600 bg-gray-100"
  },

  // Mensagens padrão
  mensagens: {
    sucesso: {
      agendamento: "✅ Agendamento realizado com sucesso!",
      cancelamento: "✅ Agendamento cancelado com sucesso!",
      reagendamento: "✅ Agendamento reagendado com sucesso!"
    },
    erro: {
      horario_ocupado: "Este horário já está ocupado. Escolha outro.",
      data_passada: "Não é possível agendar para datas passadas.",
      cancelamento_tardio: "Não é possível cancelar com menos de 24h de antecedência.",
      campos_obrigatorios: "Por favor, preencha todos os campos obrigatórios."
    },
    confirmacao: {
      cancelamento: "Tem certeza que deseja cancelar este agendamento?",
      reagendamento: "Tem certeza que deseja reagendar este agendamento?"
    }
  },

  // Validações
  validacoes: {
    // Idade mínima para agendar (anos)
    idadeMinima: 18,
    
    // Horário mínimo para agendamento no mesmo dia (horas)
    horarioMinimoMesmoDia: 2,
    
    // Máximo de agendamentos pendentes por cliente
    maxAgendamentosPendentes: 3
  },

  // Configurações de notificação
  notificacoes: {
    // Horas antes da sessão para enviar lembrete
    lembreteHorasAntes: 24,
    
    // Permitir notificações por email
    email: true,
    
    // Permitir notificações por WhatsApp
    whatsapp: true
  }
};

// Funções utilitárias
export const agendamentoUtils = {
  // Verifica se um horário está disponível
  isHorarioDisponivel: (horario, agendamentosExistentes) => {
    return !agendamentosExistentes.some(ag => 
      ag.horario === horario && ag.status !== 'cancelado'
    );
  },

  // Formata data para exibição
  formatarData: (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Formata horário para exibição
  formatarHorario: (horario) => {
    return horario;
  },

  // Verifica se uma data é válida para agendamento
  isDataValida: (data) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const dataSelecionada = new Date(data);
    return dataSelecionada >= hoje;
  },

  // Gera horários disponíveis baseado na data e terapeuta
  gerarHorariosDisponiveis: (data, terapeuta, agendamentosExistentes) => {
    const horarios = AGENDAMENTO_CONFIG.horarios.manha.concat(
      AGENDAMENTO_CONFIG.horarios.tarde
    );
    
    // Filtrar horários já ocupados
    return horarios.filter(horario => 
      agendamentoUtils.isHorarioDisponivel(horario, agendamentosExistentes)
    );
  }
};

export default AGENDAMENTO_CONFIG;
