# Patentes BR

Aplicacao Next.js estilo Google Patentes para consultar sua API sem CORS no browser.

- API upstream padrao: `https://inpi-rho.vercel.app/api`
- Rotas internas do app:
  - `GET /api/health`
  - `GET /api/search`
  - `GET /api/patents/:numero`

No browser, o frontend chama `/api/*` na mesma origem, e os Route Handlers do Next.js fazem o proxy para a API upstream.

## Produção na Vercel

1. Suba o projeto para um repositório Git.

2. Importe o repositório na Vercel.

3. Configure as variáveis de ambiente do projeto (Settings -> Environment Variables):

- `UPSTREAM_BASE` (obrigatória)
  - Exemplo: `https://inpi-rho.vercel.app/api`
- `UPSTREAM_BEARER_TOKEN` (opcional, se sua API exigir Authorization)
- `UPSTREAM_VERCEL_BYPASS` (opcional, se o upstream usar Vercel Protection Bypass)
- `UPSTREAM_CUSTOM_HEADER_NAME` (opcional)
- `UPSTREAM_CUSTOM_HEADER_VALUE` (opcional)

4. Faça o deploy.

5. Valide no dominio final:

- `/api/health`
- `/api/search?q=energia&page=1&limit=1`


> Para usar o endpoint correto, defina a variável de ambiente:
>
> `UPSTREAM_BASE=https://inpi-rho.vercel.app/api`
>
> na Vercel (ou em `.env.local` para testes locais).

## Desenvolvimento local

1. Instale dependencias:

```bash
npm install
```

2. Rode localmente:

```bash
npm run dev
```

3. Abra `http://localhost:3000`.

## Recursos implementados

- Health check da API no topo
- Busca com filtros:
  - termo livre (`q`)
  - `numero`
  - `titulo`
  - `depositante`
  - `ipc`
- Paginacao (`page`, `limit`)
- Lista de resultados com metadados
- Modal de detalhes (consulta por numero)
- Layout responsivo (desktop e mobile)
  - Proxy via Route Handlers do Next.js em `app/api/*`

## Personalizacao

Se quiser apontar para outra API upstream, altere a variavel `UPSTREAM_BASE` na Vercel.

Se o upstream estiver protegido e retornar 401, configure as variaveis de autenticacao (token/header/bypass) no projeto da Vercel.
