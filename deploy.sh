#!/bin/bash
# ============================================================
# deploy.sh — Script oficial de actualización del Módulo CRUD
# Usar en el VPS: chmod +x deploy.sh && ./deploy.sh
# Basado en la DocumentacionVPS: github.com/Santiago072/DocumentacionVPS
# ============================================================

set -e  # Detiene el script si cualquier comando falla

echo ""
echo "=========================================="
echo " 🚀 Desplegando Módulo CRUD en el VPS..."
echo "=========================================="
echo ""

# Paso 1: Asegurar permisos para evitar conflictos entre Docker y Git
echo "🔒 Ajustando permisos..."
sudo chown -R $USER:$USER .

# Paso 2: Descargar la versión más reciente desde GitHub
echo "⬇️  Obteniendo código desde GitHub (rama main)..."
git fetch origin
git reset --hard origin/main

# Paso 3: Verificar que el archivo .env existe (no se sube al repo)
if [ ! -f ".env" ]; then
  echo ""
  echo "⚠️  ADVERTENCIA: No se encontró el archivo .env"
  echo "   Copia el ejemplo y configura tus valores:"
  echo "   cp .env.example .env && nano .env"
  echo ""
  exit 1
fi

# Paso 4: Reconstruir imágenes y reiniciar todos los contenedores
echo "🐳 Reconstruyendo y levantando contenedores..."
sudo docker compose up -d --build

# Paso 5: Limpiar imágenes obsoletas para liberar espacio en el VPS
echo "🧹 Limpiando imágenes antiguas..."
sudo docker image prune -f

# Paso 6: Mostrar el estado final de los contenedores
echo ""
echo "📊 Estado de los contenedores:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=========================================="
echo " ✅ ¡Despliegue completado con éxito!"
echo "    🌐 App: http://modulocrud.slscode.online"
echo "    🔌 API: http://modulocrud.slscode.online/api/status"
echo "=========================================="
echo ""
