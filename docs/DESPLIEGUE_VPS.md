# 🌐 Manual de Despliegue — VPS (modulocrud.slscode.online)

Este documento detalla los pasos exactos para desplegar el Módulo CRUD en el VPS.
Se basa en los patrones documentados en [DocumentacionVPS](https://github.com/Santiago072/DocumentacionVPS).

---

## ✅ Requisitos previos del VPS
- Ubuntu 20.04+ con acceso SSH / CMD
- Docker y Docker Compose instalados (`docker compose` con espacio, no guion)
- Nginx nativo instalado
- Git instalado
- Dominio `modulocrud.slscode.online` apuntando a la IP del VPS (ya configurado en Hostinger)

---

## 🚀 Paso a Paso — Primera Instalación

### 1. Conectarse al VPS y clonar el repositorio
```bash
ssh usuario@IP_DEL_VPS
cd ~
git clone https://github.com/Santiago072/ModuloCRUD.git
cd ModuloCRUD
```

### 2. Configurar las variables de entorno
El archivo `.env` **no está en GitHub**. Debes crearlo manualmente:
```bash
cp .env.example .env
nano .env
```
Edita los valores reales (contraseña de BD, etc.) y guarda con `Ctrl+O` → `Enter` → `Ctrl+X`.

### 3. Dar permisos al script de despliegue (solo una vez)
```bash
chmod +x deploy.sh
```

### 4. Ejecutar el primer despliegue
```bash
./deploy.sh
```
Esto construirá las imágenes Docker e iniciará los 3 contenedores:
`modulocrud_db` · `modulocrud_backend` · `modulocrud_frontend`

### 5. Configurar Nginx como Proxy Inverso
Copia el archivo de configuración al directorio de Nginx:
```bash
sudo cp nginx/modulocrud.conf /etc/nginx/sites-available/modulocrud.conf
sudo ln -s /etc/nginx/sites-available/modulocrud.conf /etc/nginx/sites-enabled/
sudo nginx -t          # Verificar que no hay errores de sintaxis
sudo systemctl reload nginx
```

### 6. Activar HTTPS con Certbot (obligatorio para PWA y Service Worker)
```bash
sudo certbot --nginx -d modulocrud.slscode.online
```
> Cuando pregunte, elige la opción **1** (Attempt to reinstall this existing certificate).

---

## 🔄 Actualizar el Proyecto (Cada vez que haya cambios en GitHub)
Simplemente ejecuta:
```bash
cd ~/ModuloCRUD
./deploy.sh
```

---

## 🔍 Comandos útiles de diagnóstico en el VPS

### Ver estado de los contenedores
```bash
sudo docker ps
```

### Ver logs en tiempo real (para errores)
```bash
sudo docker compose logs -f backend    # Logs del backend Node.js
sudo docker compose logs -f frontend   # Logs del Nginx del contenedor
sudo docker compose logs -f db         # Logs de MariaDB
```

### Entrar a la consola de la Base de Datos
```bash
sudo docker exec -it modulocrud_db mariadb -u crud_user -p modulocrud
```

### Restaurar la base de datos manualmente
```bash
sudo docker exec -i modulocrud_db mariadb -u crud_user -p modulocrud < BD.txt
```

### Reiniciar solo el backend (si cambias .env sin rebuild)
```bash
sudo docker compose up -d backend
```

---

## 🔒 Seguridad: Variables que NUNCA deben subirse a GitHub
| Variable | Descripción |
|---|---|
| `DB_PASSWORD` | Contraseña de la base de datos |
| `.env` | Archivo completo de variables de entorno |

El archivo `.gitignore` ya excluye `.env`. Solo sube `.env.example` como plantilla.

---

## 🌐 URLs del Sistema en Producción
| Servicio | URL |
|---|---|
| Aplicación (PWA) | https://modulocrud.slscode.online |
| API — Estado | https://modulocrud.slscode.online/api/status |
| API — Personas | https://modulocrud.slscode.online/api/personas |
| API — Sync | https://modulocrud.slscode.online/api/sync |
