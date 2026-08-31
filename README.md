# Chasqui Retail POS — API

API de ventas e inventario (backend Node.js/Express + PostgreSQL) usada
como base para el pipeline de CI/CD diseñado con GitHub Actions.

## Estructura del repositorio

```
chasqui-retail-pos/
├── .github/workflows/ci-cd.yml   # Pipeline de CI/CD
├── src/
│   ├── app.js                    # App de Express (rutas + /health)
│   ├── server.js                 # Punto de entrada (levanta el servidor)
│   ├── db.js                     # Conexión a PostgreSQL
│   ├── routes/sales.js           # Endpoint POST /ventas
│   └── services/inventoryService.js  # Lógica de negocio (descuento de stock)
├── tests/
│   ├── unit/inventoryService.test.js       # Pruebas unitarias (Jest)
│   └── integration/sales.test.js           # Pruebas de integración (Supertest)
├── migrations/
│   └── 1700000000000_create-productos.js   # Migración de BD (node-pg-migrate)
├── helm/chasqui-retail/          # Helm chart para desplegar en Kubernetes
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── deployment.yaml
│       └── service.yaml
├── Dockerfile
├── .dockerignore
├── .eslintrc.json
├── .gitignore
└── package.json
```

## Cómo correrlo localmente

```bash
npm install
docker run -d -p 5432:5432 -e POSTGRES_USER=test_user \
  -e POSTGRES_PASSWORD=test_password -e POSTGRES_DB=chasqui_test postgres:16

export DATABASE_URL=postgresql://test_user:test_password@localhost:5432/chasqui_test
npm run migrate
npm run lint
npm run test:unit
npm run test:integration
npm start
```

## Qué funciona en GitHub Actions sin configuración extra

Los jobs `lint`, `test` y `build-and-push` (Dockerfile) funcionan con solo
subir este repositorio a GitHub: no requieren secrets ni servicios externos.

## Qué requiere configuración adicional

- **SonarQube**: crear cuenta en SonarCloud y configurar `SONAR_TOKEN` y
  `SONAR_HOST_URL` como secrets del repositorio.
- **Kubernetes + Helm (deploy-staging / deploy-production)**: requieren un
  clúster real accesible y los secrets `KUBE_CONFIG_STAGING` /
  `KUBE_CONFIG_PRODUCTION`. Si no cuentas con un clúster, estos jobs pueden
  quedar documentados como diseño, sin ejecutarse.
- **Slack**: crear un Incoming Webhook y configurarlo como
  `SLACK_WEBHOOK_URL`.
- **Entorno `production`**: crear en GitHub → Settings → Environments,
  con "required reviewers" para la aprobación manual.
