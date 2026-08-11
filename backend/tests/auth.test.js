const { describe, it } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TEST_SECRET = 'test_supersecret_jwt_key_12345';

describe('Auth & Criptografía (Bcrypt & JWT)', () => {
  it('debe generar un hash bcrypt válido y verificarlo correctamente', async () => {
    const password = 'PasswordSeguro2026!';
    const hash = await bcrypt.hash(password, 10);

    assert.ok(hash.startsWith('$2'), 'El hash debe iniciar con prefijo de bcrypt');
    assert.strictEqual(await bcrypt.compare(password, hash), true, 'La contraseña correcta debe coincidir');
    assert.strictEqual(await bcrypt.compare('PasswordIncorrecto', hash), false, 'Una contraseña errónea debe ser rechazada');
  });

  it('debe firmar un token JWT con payload y verificar su contenido', () => {
    const userPayload = { id: 1, username: 'admin', rol: 'admin' };
    const token = jwt.sign(userPayload, TEST_SECRET, { expiresIn: '1h' });

    assert.ok(token && typeof token === 'string', 'El token generado debe ser un string no vacío');

    const decoded = jwt.verify(token, TEST_SECRET);
    assert.strictEqual(decoded.id, 1);
    assert.strictEqual(decoded.username, 'admin');
    assert.strictEqual(decoded.rol, 'admin');
    assert.ok(decoded.exp > decoded.iat, 'La expiración debe ser posterior a la emisión');
  });

  it('debe rechazar tokens alterados con clave incorrecta', () => {
    const token = jwt.sign({ id: 99, username: 'hacker' }, TEST_SECRET);
    const wrongSecret = 'clave_totalmente_distinta';

    assert.throws(() => {
      jwt.verify(token, wrongSecret);
    }, /invalid signature/);
  });

  it('debe rechazar tokens expirados', () => {
    const expiredToken = jwt.sign({ id: 5, username: 'caducado' }, TEST_SECRET, { expiresIn: '-1s' });

    assert.throws(() => {
      jwt.verify(expiredToken, TEST_SECRET);
    }, /jwt expired/);
  });
});
