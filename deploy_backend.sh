#!/bin/bash
# ===============================================
# Script: deploy_backend.sh
# Descrição: Automatiza commit e push do backend
# Projeto: Seenti
# ===============================================

cd ~/seenti_app/SeentiCliente || exit

echo "\n📦 Atualizando Backend Seenti...\n"

# Verifica alterações
STATUS=$(git status --porcelain)

if [ -z "$STATUS" ]; then
  echo "✅ Nenhuma alteração para subir."
else
  git add dev/ prod/ .env requirements.txt
  git commit -m "🔁 Deploy backend - $(date '+%d/%m/%Y %H:%M')"
  git push origin main
  echo "🚀 Backend atualizado no GitHub. Acompanhe o deploy em: https://dashboard.render.com"
fi
