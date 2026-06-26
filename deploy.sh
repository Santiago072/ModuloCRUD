#!/bin/bash
# Script de despliegue automático para el VPS (ModuloCRUD)

echo "🚀 Iniciando proceso de actualización del proyecto..."

# 1. Asegurar permisos para evitar problemas con Docker y Git
sudo chown -R $USER:$USER .

# 2. Descargar los últimos cambios desde la rama main en GitHub
echo "⬇️ Obteniendo código desde GitHub..."
git fetch origin
git reset --hard origin/main

# 3. Reconstruir imágenes y reiniciar contenedores
echo "🐳 Reconstruyendo contenedores y aplicando cambios..."
sudo docker compose up -d --build

# 4. Limpiar imágenes colgadas (opcional, para liberar espacio)
sudo docker image prune -f

echo "✅ ¡Actualización completada con éxito!"
