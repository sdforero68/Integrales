#!/bin/bash

echo "🔍 Verificando servidores..."
echo ""

# Verificar Backend
echo "📡 Backend (puerto 3000):"
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "   ✅ Backend está corriendo"
    curl -s http://localhost:3000/api/health | head -1
else
    echo "   ❌ Backend NO está corriendo"
    echo "   💡 Ejecuta: cd backend && npm run dev"
fi

echo ""

# Verificar Frontend
echo "🌐 Frontend (puerto 5500):"
if curl -s http://localhost:5500 > /dev/null 2>&1; then
    echo "   ✅ Frontend está corriendo"
    echo "   💡 Abre: http://localhost:5500"
else
    echo "   ❌ Frontend NO está corriendo"
    echo "   💡 Ejecuta: cd frontend && python3 -m http.server 5500"
fi

echo ""

# Verificar procesos
echo "🔧 Procesos activos:"
BACKEND_PID=$(lsof -ti:3000 2>/dev/null)
FRONTEND_PID=$(lsof -ti:5500 2>/dev/null)

if [ -n "$BACKEND_PID" ]; then
    echo "   ✅ Backend (PID: $BACKEND_PID)"
else
    echo "   ❌ Backend no encontrado"
fi

if [ -n "$FRONTEND_PID" ]; then
    echo "   ✅ Frontend (PID: $FRONTEND_PID)"
else
    echo "   ❌ Frontend no encontrado"
fi

echo ""

