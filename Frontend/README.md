# 🚀 **SEENTI FRONTEND - SPRINT 04**

## 📋 **VISÃO GERAL**
Frontend da plataforma Seenti - Terapias Integrativas com arquitetura White Label, desenvolvido em React 19 + Vite.

---

## ✨ **MELHORIAS IMPLEMENTADAS - SPRINT 04**

### **🎨 Interface e UX**
- **Barra lateral responsiva** com navegação completa
- **Layout mobile otimizado** para todos os dispositivos
- **Design system consistente** com cores e tipografia padronizadas
- **Animações suaves** e transições elegantes

### **📱 Responsividade**
- **Mobile-first approach** implementado
- **Breakpoints otimizados** para diferentes tamanhos de tela
- **Touch-friendly** para dispositivos móveis
- **Sidebar mobile** com overlay e gestos

### **🔧 Funcionalidades**
- **Sistema de agendamentos** completo e integrado
- **Navegação inteligente** entre módulos
- **Feedback do usuário** com avaliação por estrelas
- **Logout funcional** na barra lateral

---

## 🏗️ **ARQUITETURA**

### **📁 Estrutura de Componentes**
```
src/
├── components/cliente/
│   ├── Login.jsx              ✅ Sistema de autenticação
│   ├── CadastroUsuario.jsx    ✅ Cadastro de usuário
│   ├── TermoUso.jsx           ✅ Termo de uso responsivo
│   ├── CadastroCliente.jsx    ✅ Cadastro com validações
│   ├── PaginaCliente.jsx      ✅ Dashboard principal
│   ├── AnamneseCliente.jsx    ✅ Formulário de anamnese
│   └── AgendamentoCliente.jsx ✅ Sistema de agendamentos
├── layouts/
│   ├── WhiteLabelLayout.jsx   ✅ Layout para autenticação
│   └── PerfilClienteLayout.jsx ✅ Layout com sidebar
├── whiteLabel/
│   ├── config/brandConfig.js  ✅ Configurações de marca
│   ├── themes/index.js        ✅ Temas personalizáveis
│   └── utils/                 ✅ Utilitários
└── services/
    └── api.js                 ✅ Cliente HTTP centralizado
```

### **🎨 Sistema White Label**
- **Múltiplas marcas** suportadas
- **Configurações dinâmicas** de cores e logos
- **Detecção automática** por subdomínio
- **Temas personalizáveis** por parceiro

---

## 🚀 **INSTALAÇÃO E EXECUÇÃO**

### **📋 Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Backend Seenti rodando

### **🔧 Comandos**
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

---

## 🌐 **DEPLOY**

### **📱 Vercel (Recomendado)**
- **Configuração automática** via `vercel.json`
- **Deploy contínuo** do branch main
- **Preview automático** para PRs
- **URL**: [seu-projeto.vercel.app](https://seu-projeto.vercel.app)

### **🔧 Configuração de Ambiente**
```env
VITE_API_BASE_URL=https://seu-backend.com
```

---

## 🧪 **TESTES**

### **✅ Funcionalidades Testadas**
- **Login e autenticação** - Fluxo completo
- **Cadastro de usuário** - Validações funcionando
- **Termo de uso** - Responsivo e funcional
- **Cadastro de cliente** - Validações robustas
- **Dashboard principal** - Navegação funcionando
- **Sistema de agendamentos** - CRUD completo

### **📱 Responsividade Validada**
- **Mobile**: 320px - 768px ✅
- **Tablet**: 768px - 1024px ✅
- **Desktop**: 1024px+ ✅
- **Navegadores**: Chrome, Firefox, Safari ✅

---

## 🎯 **ROADMAP**

### **📅 Sprint 05 (Próxima)**
- [ ] Sistema de notificações
- [ ] Histórico de sessões
- [ ] Avaliações e feedback
- [ ] Dashboard avançado

### **📅 Sprint 06**
- [ ] Módulo terapeuta
- [ ] Sistema de pagamentos
- [ ] Analytics básico

---

## 🔧 **TECNOLOGIAS**

### **⚛️ Frontend**
- **React 19** - Framework principal
- **Vite 6.3.5** - Build tool e dev server
- **Tailwind CSS** - Framework de estilos
- **React Router DOM 7** - Roteamento

### **📦 Dependências**
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **React Icons** - Biblioteca de ícones

---

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **❌ Erro 404 no Login**
- **Causa**: Backend não está rodando
- **Solução**: Iniciar `python app.py` na pasta `dev/`

### **❌ Tela de perfil estourando**
- **Causa**: Problemas de responsividade
- **Solução**: ✅ Corrigido na Sprint 04

### **❌ Ícones enormes**
- **Causa**: Tamanhos não ajustados
- **Solução**: ✅ Substituído por emojis responsivos

---

## 📞 **SUPORTE**

### **👨‍💻 Desenvolvimento**
- **Responsável**: Marcia Alves
- **Email**: [seu-email]
- **Status**: Sprint 04 concluída

### **🔗 Links Úteis**
- **Repositório**: GitHub
- **Deploy**: Vercel
- **Backend**: Render

---

## 🎉 **STATUS ATUAL**

**✅ Sprint 04 CONCLUÍDA COM SUCESSO!**

- **Interface responsiva** implementada
- **Barra lateral funcional** implementada
- **Sistema de agendamentos** completo
- **White Label** funcionando perfeitamente

---

*README atualizado em: 04/08/2025*  
*Sprint 04: Módulo Cliente - Melhorias Visuais e Fluxo*
