#!/bin/bash

echo "🔄 Iniciando backup para o GitHub..."

# Confere se há arquivos sensíveis no stage
if git diff --cached | grep -E "gh[pous]_[0-9A-Za-z]{36,}" > /dev/null; then
  echo "🚫 Possível token detectado em arquivos preparados para commit. Backup cancelado!"
  echo "⚠️ Revise os arquivos antes de subir para o GitHub."
  exit 1
fi

# Adiciona alterações e faz o commit
git add .
git commit -m "Melhoria Anamnese mais completa em $(date +'%Y-%m-%d %H:%M:%S')"

# Envia para o GitHub
git push origin main

echo "✅ Backup realizado com sucesso!"
