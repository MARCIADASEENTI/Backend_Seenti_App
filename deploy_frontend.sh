#!/bin/bash

# Nome do script: deploy_frontend.sh
# Local: SeentiCliente/Frontend
# Objetivo: Automatizar push para o repositório do Frontend

echo "🚀 Iniciando atualização do repositório Frontend..."

# Caminho do projeto (ajuste se necessário)
cd "$(dirname "$0")"

# Adiciona alterações
git add .

# Cria commit com timestamp
COMMIT_MESSAGE="atualização automática: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MESSAGE"

# Realiza o push
git push origin main

# Verifica status do push
if [ $? -eq 0 ]; then
  echo "✅ Frontend atualizado com sucesso no GitHub."
  echo "🌐 Acompanhe o deploy no painel Vercel: https://vercel.com/dashboard"
else
  echo "❌ Falha ao atualizar o repositório Frontend."
fi
