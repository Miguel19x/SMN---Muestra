# CI/CD Setup - NoMásSecuestros

## 🚀 GitHub Actions Pipeline

El proyecto ahora incluye un pipeline de CI/CD completamente configurado en `.github/workflows/ci.yml`.

### Jobs Configurados

#### 1. **Test**
- Ejecuta todos los tests unitarios (27 tests)
- Genera reporte de coverage
- Sube coverage a Codecov (opcional)

#### 2. **Type Check**
- Valida tipos TypeScript con `astro check`
- Asegura 0 errores TypeScript

#### 3. **Build**
- Build de producción con Astro
- Solo se ejecuta si tests y type-check pasan
- Requiere variables de entorno en GitHub Secrets

### Configuración de Secrets

Para que el build funcione en CI, configura los siguientes secrets en GitHub:

1. Ve a **Settings → Secrets and variables → Actions**
2. Agrega los siguientes secrets:

```
MONGODB_URI=mongodb+srv://...
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx  
R2_BUCKET_NAME=xxx
```

### Triggers

El pipeline se ejecuta en:
- ✅ Push a `main` o `develop`
- ✅ Pull Requests a `main` o `develop`

### Status Badges

Agrega badges al README principal:

```markdown
![CI Status](https://github.com/USUARIO/REPO/actions/workflows/ci.yml/badge.svg)
![Coverage](https://codecov.io/gh/USUARIO/REPO/branch/main/graph/badge.svg)
```

### Resultados Actuales

```
Tests:     27/27 pasando (100%)
Coverage:  53% (objetivo: >70%)
Build:     ⚠️ Requiere secrets configurados
```

### Próximos Pasos

1. Push este commit para activar el pipeline
2. Configurar secrets en GitHub
3. Monitorear el primer run en la tab "Actions"
4. Configurar branch protection rules (opcional)

## 📊 Coverage Gates (Futuro)

Para enforcer coverage mínimo, agregar a `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70
  }
}
```

## 🔒 Branch Protection (Recomendado)

En **Settings → Branches → Add rule** para `main`:

- ✅ Require status checks to pass
  - ✅ test
  - ✅ type-check
- ✅ Require branches to be up to date
- ✅ Include administrators (opcional)
