# 🤝 Guía para Colaboradores — Módulo CRUD

Gracias por tu interés en contribuir al proyecto. Esta guía explica cómo configurar
el entorno local, las convenciones que seguimos y el flujo de trabajo con Git.

---

## ⚙️ Configuración del Entorno Local

### Prerrequisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- [Node.js 20+](https://nodejs.org/) (para desarrollo sin Docker)
- [Git](https://git-scm.com/)

### Pasos iniciales

```bash
# 1. Clonar el repositorio
git clone https://github.com/Santiago072/ModuloCRUD.git
cd ModuloCRUD

# 2. Crear el archivo de variables de entorno
cp .env.example .env
```

Edita `.env` con tus valores reales. Las variables **obligatorias** son:

| Variable | Cómo obtenerla |
|---|---|
| `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ALLOWED_ORIGINS` | `http://localhost:8893` para desarrollo local |
| `DB_PASSWORD` | Elige una contraseña segura |

```bash
# 3. Levantar todos los servicios con Docker
bash deploy.sh

# O manualmente:
docker compose up --build -d
```

La aplicación estará disponible en:
- **Frontend (PWA):** `http://localhost:8893`
- **Backend (API):** `http://localhost:8894/api`

---

## 🗂️ Estructura del Proyecto

Consulta la [Documentación Técnica](documentacion-tecnica.md) para ver la arquitectura
de carpetas completa y la [Guía de Arquitectura](ARQUITECTURA.md) para los diagramas
de componentes.

---

## 🌿 Flujo de Trabajo con Git

### Ramas

| Rama | Propósito |
|---|---|
| `main` | Producción. Solo recibe merges revisados. |
| `feature/nombre-feature` | Nuevas funcionalidades |
| `fix/descripcion-bug` | Corrección de errores |
| `docs/descripcion` | Solo cambios de documentación |

```bash
# Crear una rama de trabajo
git checkout -b feature/mi-nueva-funcionalidad

# Al terminar, hacer push y abrir un Pull Request hacia main
git push origin feature/mi-nueva-funcionalidad
```

---

## ✍️ Convención de Commits (en español)

Usamos el formato **Conventional Commits** traducido al español:

```
<tipo>: <descripción corta en imperativo>

<cuerpo opcional — explica el QUÉ y el POR QUÉ, no el CÓMO>

<pie opcional — referencias a issues o hallazgos>
```

### Tipos permitidos

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad para el usuario |
| `fix` | Corrección de un bug |
| `docs` | Solo cambios en documentación |
| `seguridad` | Mejoras o correcciones de seguridad |
| `ci` | Cambios en el pipeline de CI/CD |
| `limpieza` | Refactorización, formato, higiene del repo |
| `build` | Cambios en Docker, Vite, dependencias |
| `test` | Agregar o corregir pruebas |

### Ejemplos

```bash
# ✅ Correcto
git commit -m "feat: agregar exportación en formato PDF al panel admin"
git commit -m "fix: corregir error de sincronización cuando la tabla está vacía"
git commit -m "seguridad: restringir CORS con lista blanca de orígenes"
git commit -m "docs: actualizar README con instrucciones de instalación en Windows"

# ❌ Incorrecto
git commit -m "cambios"
git commit -m "fix bug"
git commit -m "WIP"
```

---

## 🔐 Reglas de Seguridad para Colaboradores

> [!CAUTION]
> **Nunca** subas el archivo `.env` al repositorio. Ya está en `.gitignore`,
> pero es responsabilidad de cada colaborador verificarlo antes de cada commit.

1. **No usar claves hardcodeadas en el código.** Todas las credenciales van en `.env`.
2. **Revisar el diff antes de hacer commit** con `git diff --staged` para asegurarse
   de que no hay secretos incluidos.
3. **Si accidentalmente subiste un secreto**, notifícalo inmediatamente para rotar
   las credenciales y usar `git filter-branch` o `git filter-repo` para limpiar el historial.

---

## 🧪 Pruebas

### Backend

```bash
cd backend
npm ci        # Instalar dependencias reproducibles
npm test      # Ejecutar suite de pruebas
```

> El backend actualmente tiene un script de prueba placeholder. La meta es agregar
> pruebas de integración para los endpoints `/api/sync` y `/api/auth/login`.

### Frontend

```bash
cd frontend
npm ci            # Instalar dependencias reproducibles
npm run lint      # Análisis estático con oxlint
npm run build     # Verificar que el build de producción no falla
```

---

## ✅ Checklist antes de abrir un Pull Request

- [ ] El código sigue las convenciones de commits en español
- [ ] `npm run lint` pasa sin errores en el frontend
- [ ] `npm run build` del frontend compila sin errores
- [ ] No hay archivos `.env`, `node_modules/` o `dist/` en el commit
- [ ] Se actualizó `CHANGELOG.md` si el cambio es visible para el usuario
- [ ] Se actualizó la documentación técnica si se agregaron endpoints o cambios de arquitectura

---

## 📞 Contacto

Este proyecto es mantenido por **Santiago072**.
Para preguntas o sugerencias, abre un [Issue en GitHub](https://github.com/Santiago072/ModuloCRUD/issues).
