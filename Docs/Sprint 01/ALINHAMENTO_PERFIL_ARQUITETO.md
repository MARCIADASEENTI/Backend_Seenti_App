# Alinhamento - Melhorias Tela de Perfil

## 📋 Contexto

A Sprint 01 foi concluída com sucesso, implementando a funcionalidade básica da tela de perfil do cliente. Agora precisamos alinhar com o Arquiteto para definir as melhorias e funcionalidades adicionais para a Sprint 02.

## 🎯 Estado Atual da Tela de Perfil

### ✅ Funcionalidades Implementadas

**Rota:** `/perfil` (anteriormente `/cliente`)

**Componentes Funcionais:**
- ✅ Exibição de dados pessoais do cliente
- ✅ Formulário de anamnese completo
- ✅ Navegação entre seções
- ✅ Validações de formulário
- ✅ Integração com backend

**Dados Exibidos:**
- Nome completo e nome social
- CPF e data de nascimento
- Gênero
- Informações de contato (telefone, email)
- Endereço completo
- Dados da anamnese

## 🔍 Análise de Melhorias Necessárias

### 1. **Visualização de Dados**
**Problema:** A tela atual mostra apenas dados básicos
**Sugestão:** Implementar dashboard com:
- Histórico de anamneses
- Progresso do tratamento
- Próximas consultas agendadas
- Métricas de evolução

### 2. **Funcionalidades Interativas**
**Problema:** Apenas visualização, sem interação
**Sugestão:** Adicionar:
- Edição de dados pessoais
- Upload de documentos médicos
- Chat com terapeuta
- Agendamento de consultas

### 3. **Experiência do Usuário**
**Problema:** Interface básica, sem elementos visuais
**Sugestão:** Implementar:
- Gráficos de progresso
- Cards informativos
- Notificações
- Modo escuro/claro

## 📊 Requisitos Técnicos Identificados

### Backend - Novos Endpoints Necessários

```python
# Endpoints sugeridos para Sprint 02
GET /clientes/{id}/historico          # Histórico de anamneses
GET /clientes/{id}/progresso          # Dados de progresso
PUT /clientes/{id}/dados              # Atualizar dados pessoais
POST /clientes/{id}/documentos        # Upload de documentos
GET /clientes/{id}/consultas          # Próximas consultas
POST /clientes/{id}/mensagens         # Sistema de chat
```

### Frontend - Novos Componentes

```jsx
// Componentes sugeridos
<DashboardCliente />           // Dashboard principal
<HistoricoAnamneses />         // Lista de anamneses
<ProgressoTratamento />        // Gráficos de progresso
<AgendamentoConsultas />       // Calendário de consultas
<ChatTerapeuta />              // Sistema de mensagens
<UploadDocumentos />           // Upload de arquivos
```

## 🎨 Proposta de Design

### Layout Sugerido

```
┌─────────────────────────────────────────────────────────┐
│ Header: Logo + Menu + Notificações                      │
├─────────────────────────────────────────────────────────┤
│ Sidebar: Navegação rápida                               │
├─────────────────────────────────────────────────────────┤
│ Main Content:                                           │
│ ┌─────────────────┐ ┌─────────────────┐                │
│ │ Dashboard       │ │ Próximas        │                │
│ │ - Progresso     │ │ Consultas       │                │
│ │ - Métricas      │ │ - Calendário    │                │
│ └─────────────────┘ └─────────────────┘                │
│ ┌─────────────────┐ ┌─────────────────┐                │
│ │ Histórico       │ │ Chat            │                │
│ │ Anamneses       │ │ Terapeuta       │                │
│ └─────────────────┘ └─────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

### Elementos Visuais

- **Cards informativos** com métricas
- **Gráficos de linha** para progresso
- **Calendário interativo** para consultas
- **Chat em tempo real** com terapeuta
- **Upload drag-and-drop** para documentos

## 🔄 Fluxo de Usuário Proposto

### 1. **Primeiro Acesso**
```
Login → Dashboard → Onboarding → Perfil Completo
```

### 2. **Acesso Regular**
```
Login → Dashboard → Navegação por Seções
```

### 3. **Interação com Terapeuta**
```
Perfil → Chat → Agendamento → Documentos
```

## 📋 Perguntas para o Arquiteto

### 1. **Prioridades**
- Quais funcionalidades são críticas para Sprint 02?
- Qual a ordem de implementação sugerida?
- Existem restrições de tempo ou recursos?

### 2. **Design e UX**
- Qual o padrão visual a ser seguido?
- Existem componentes de UI já definidos?
- Como deve ser a responsividade mobile?

### 3. **Funcionalidades**
- Sistema de chat é necessário na Sprint 02?
- Upload de documentos é prioritário?
- Agendamento de consultas deve ser implementado?

### 4. **Integração**
- Como integrar com sistema de terapeutas?
- Existem APIs externas a serem consumidas?
- Como implementar notificações em tempo real?

## 🎯 Próximos Passos

### 1. **Alinhamento com Arquiteto**
- Revisar proposta de melhorias
- Definir escopo da Sprint 02
- Estabelecer critérios de aceitação

### 2. **Documentação Técnica**
- Criar especificações detalhadas
- Definir APIs necessárias
- Estabelecer padrões de código

### 3. **Planejamento Sprint 02**
- Dividir tarefas em stories
- Estimar esforço de desenvolvimento
- Definir milestones

## 📊 Métricas de Sucesso Propostas

- **Performance:** Carregamento < 2s
- **Usabilidade:** Navegação intuitiva
- **Funcionalidade:** 100% dos requisitos atendidos
- **Qualidade:** 0 bugs críticos
- **Acessibilidade:** Conformidade WCAG 2.1

---

**Data:** 06/07/2025  
**Responsável:** Dev1  
**Próximo:** Alinhamento com Arquiteto  
**Status:** Aguardando definição de escopo 