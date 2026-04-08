# Tests

Test setup hien tai dung Node built-in test runner de tranh phu thuoc them framework.

## Lenh chay

```bash
npm run test:unit
```

```bash
npm run test:integration
```

## Pham vi hien tai

- auth schema validation
- goal/milestone/task schema validation
- date helpers
- goal progress utilities
- habit streak utilities
- password hashing / Laravel bcrypt compatibility
- legacy API payload/token helpers
- legacy API integration smoke flow

## Ghi chu

- Test runner dung loader `tests/node-loader.mjs` de ho tro alias `@/` va stub `server-only`.
- Day la lop unit test nen khong can ket noi database.
- Integration smoke test la opt-in. De chay that:

```bash
ENABLE_INTEGRATION_TESTS=1 npm run test:integration
```

- Smoke test can `DATABASE_URL` va `NEXTAUTH_SECRET`. Neu thieu, test se `skip` kem ly do ro rang thay vi fail mo ho.

- Mac dinh smoke test se tu spawn `next dev` o port `3105`. Co the doi bang:

```bash
INTEGRATION_PORT=3200 ENABLE_INTEGRATION_TESTS=1 npm run test:integration
```

- Neu ban da co `next dev` chay san tren `:3000`, dung lai server do bang:

```bash
INTEGRATION_SPAWN_SERVER=0 \
INTEGRATION_BASE_URL=http://127.0.0.1:3000 \
ENABLE_INTEGRATION_TESTS=1 \
npm run test:integration
```
