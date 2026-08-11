const { describe, it } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/authMiddleware');

process.env.JWT_SECRET = 'test_jwt_secret_for_middleware_2026';

describe('Auth Middleware (verifyToken)', () => {
  it('debe responder 403 si el encabezado Authorization no existe', () => {
    let statusCode = null;
    let responseBody = null;
    let nextCalled = false;

    const req = { headers: {} };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseBody = data;
        return this;
      },
    };
    const next = () => { nextCalled = true; };

    verifyToken(req, res, next);

    assert.strictEqual(statusCode, 403);
    assert.strictEqual(responseBody.message, 'Se requiere un token de autenticación.');
    assert.strictEqual(nextCalled, false);
  });

  it('debe responder 401 si el Bearer token es inválido o malformado', () => {
    let statusCode = null;
    let responseBody = null;
    let nextCalled = false;

    const req = { headers: { authorization: 'Bearer token_falso_y_malformado' } };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        responseBody = data;
        return this;
      },
    };
    const next = () => { nextCalled = true; };

    verifyToken(req, res, next);

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(responseBody.message, 'Token inválido o expirado.');
    assert.strictEqual(nextCalled, false);
  });

  it('debe adjuntar req.user y ejecutar next() si el token es válido', () => {
    let nextCalled = false;
    const token = jwt.sign({ id: 10, username: 'encuestador_1', rol: 'user' }, process.env.JWT_SECRET);

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {
      status() { return this; },
      json() { return this; },
    };
    const next = () => { nextCalled = true; };

    verifyToken(req, res, next);

    assert.strictEqual(nextCalled, true);
    assert.ok(req.user, 'req.user debe estar presente');
    assert.strictEqual(req.user.id, 10);
    assert.strictEqual(req.user.username, 'encuestador_1');
    assert.strictEqual(req.user.rol, 'user');
  });
});
