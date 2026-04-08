# Tests

Test setup hien tai dung Node built-in test runner de tranh phu thuoc them framework.

## Lenh chay

```bash
npm run test:unit
```

## Pham vi hien tai

- auth schema validation
- goal/milestone/task schema validation
- date helpers
- goal progress utilities
- habit streak utilities
- password hashing / Laravel bcrypt compatibility

## Ghi chu

- Test runner dung loader `tests/node-loader.mjs` de ho tro alias `@/` va stub `server-only`.
- Day la lop unit test nen khong can ket noi database.
