# ✅ Checklist – Retomada do Projeto Seenti (08/05/2025)

## 🟢 1. Testar o Endpoint `/usuarios`
- [ x] Usar `curl`, Postman ou navegador para testar o cadastro de usuário
- [ x] Verificar no MongoDB se o documento foi criado corretamente
- [ x] Confirmar resposta e código `201 Created` com ID retornado

## 🟡 2. Criar e Testar o Endpoint `/clientes`
- [x ] Implementar rota no Flask para cadastrar um cliente vinculado a um `usuario_id`
- [ x] Testar com dados reais (endereço, telefone etc.)
- [x ] Verificar inserção correta no MongoDB

## 🟠 3. Revisar a Estrutura da Coleção `anamneses`
- [ ] Criar o modelo em Python com os campos definidos
- [ ] Implementar endpoint `/anamnese`
- [ ] Testar inserção de um documento completo

## 🔵 4. Documentação
- [ ] Criar um `README.md` com:
  - Objetivo do app
  - Tecnologias utilizadas
  - Como rodar localmente
  - Como testar as rotas
- [ ] Criar um `docs/api.md` com os endpoints definidos

## 🧰 5. Ferramentas de Apoio a instalar/configurar
- [ ] Postman ou Insomnia (para testes das APIs)
- [ ] Git + GitHub ou GitLab (versionamento)
- [ ] MongoDB Compass (opcional, visualização de dados)

---

📅 **Meta**: Até 20/05/2025 — rodar o primeiro fluxo completo no app:  
**Cadastro → Cliente → Anamnese**
###

---

## 📄 2. `DOCUMENTACAO_APP.md` — Estrutura do App e Banco de Dados

```markdown
# 📚 Documentação do Projeto Seenti App

## 🧠 Visão Geral

O Seenti App é um sistema de acompanhamento terapêutico com foco em fitoterápicos e terapias integrativas, orientado por anamnese completa do cliente.

---

## 🗂️ Estrutura das Coleções (MongoDB)

### 1. `usuarios`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `_id` | ObjectId | Gerado automaticamente |
| `email` | String | E-mail do usuário |
| `cpf` | String | CPF |
| `senha` | String | Senha hash |
| `consentimento` | Boolean | LGPD |

---

### 2. `clientes`

| Campo | Tipo |
|-------|------|
| `_id` | ObjectId |
| `usuario_id` | ObjectId |
| `nome_completo` | String |
| `telefone` | String |
| `data_nascimento` | Date |
| `endereco` | Subdocumento com rua, número, bairro, etc. |

---

### 3. `terapias`

| Campo | Tipo |
|-------|------|
| `_id` | ObjectId |
| `codigo` | String |
| `nome` | String |
| `protocolo_execucao` | String |

---

### 4. `anamneses`

> Ver estrutura completa da anamnese [aqui](#)

---

### 5. `fitoterapicos`

| Campo | Tipo |
|-------|------|
| `_id` | ObjectId |
| `nome` | String |
| `tipo` | String |
| `grupos_quimicos` | Array |
| `efeitos_terapeuticos` | Array |
| `contraindicacoes` | Array |
| `interacoes` | Array |
| `uso_recomendado` | String |

---

### 6. `recomendacoes_fitoterapicos`

| Campo | Tipo |
|-------|------|
| `_id` | ObjectId |
| `anamnese_id` | ObjectId |
| `fitoterapico_id` | ObjectId |
| `motivo` | String |

---

## 🧪 Testes

Todos os endpoints foram testados localmente via `curl`.

---

## 🔐 Segurança

- Senha armazenada com hash `bcrypt`
- Consentimento (LGPD) obrigatório

---

