#!/bin/bash

# Script para iniciar backend y frontend
# Uso: ./iniciar-todo.sh

PROJECT_DIR="/Users/sdforero/Desktop/copia web /Copia de WEB 2/Integrales"

echo "🚀 Iniciando servidores de Anita Integrales..."
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Iniciar Backend
echo "📡 Iniciando Backend (puerto 3000)..."
cd "$PROJECT_DIR/backend"
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Esperar a que el backend inicie
sleep 3

# Verificar que el backend esté funcionando
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Backend iniciado correctamente"
else
    echo "⚠️  Backend puede no estar listo aún, espera unos segundos..."
fi

# Iniciar Frontend
echo "🌐 Iniciando Frontend (puerto 5500)..."
cd "$PROJECT_DIR/frontend"
python3 -m http.server 5500 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

sleep 2

echo ""
echo "✅ Servidores iniciados:"
echo "   📡 Backend:  http://localhost:3000"
echo "   🌐 Frontend: http://localhost:5500"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/backend.log"
echo "   Frontend: tail -f /tmp/frontend.log"
echo ""
echo "🛑 Presiona Ctrl+C para detener ambos servidores"
echo ""

# Esperar
wait

