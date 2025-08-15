#!/bin/bash
# Navega até a pasta correta
cd ~/seenti_app/SeentiCliente/dev || exit

# Ativa o ambiente virtual
source ../e/bin/activate

# Executa o app
python3 app.py
