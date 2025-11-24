#!/bin/bash

# Script para iniciar el servidor del frontend
# Uso: ./start-frontend.sh

cd "/Users/sdforero/Desktop/copia web /Copia de WEB 2/Integrales/frontend"

echo "🚀 Iniciando servidor del frontend en http://localhost:5500"
echo ""
echo "Para detener el servidor, presiona Ctrl+C"
echo ""

python3 -m http.server 5500

