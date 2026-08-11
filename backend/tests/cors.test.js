const { describe, it } = require('node:test');
const assert = require('node:assert');

const ALLOWED_ORIGINS_STR = 'https://modulocrud.slscode.online,http://localhost:8893,http://localhost:5173,http://localhost:3000';
const allowedOrigins = ALLOWED_ORIGINS_STR.split(',').map((o) => o.trim());

// Lógica de validación de origen idéntica a backend/index.js
function checkCorsOrigin(origin, allowedList) {
  if (!origin) return { allowed: true };
  if (allowedList.includes(origin)) {
    return { allowed: true };
  }
  const err = new Error(`Origen no permitido por política CORS: ${origin}`);
  err.status = 403;
  return { allowed: false, error: err };
}

describe('Políticas de Seguridad CORS (Whitelist de Orígenes)', () => {
  it('debe permitir peticiones desde dominios de producción autorizados', () => {
    const res = checkCorsOrigin('https://modulocrud.slscode.online', allowedOrigins);
    assert.strictEqual(res.allowed, true);
  });

  it('debe permitir peticiones desde entornos locales autorizados (Vite / Docker)', () => {
    assert.strictEqual(checkCorsOrigin('http://localhost:8893', allowedOrigins).allowed, true);
    assert.strictEqual(checkCorsOrigin('http://localhost:5173', allowedOrigins).allowed, true);
    assert.strictEqual(checkCorsOrigin('http://localhost:3000', allowedOrigins).allowed, true);
  });

  it('debe permitir peticiones sin origen (apps móviles / curl / Postman)', () => {
    const res = checkCorsOrigin(undefined, allowedOrigins);
    assert.strictEqual(res.allowed, true);
  });

  it('debe rechazar con error 403 orígenes no autorizados / maliciosos', () => {
    const res = checkCorsOrigin('https://sitio-malicioso-hacker.com', allowedOrigins);
    assert.strictEqual(res.allowed, false);
    assert.ok(res.error, 'Debe devolver un error de seguridad');
    assert.strictEqual(res.error.status, 403);
    assert.match(res.error.message, /Origen no permitido por política CORS/);
  });
});
