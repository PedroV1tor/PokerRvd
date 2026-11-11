# Deploy PokerRvd no Railway

## Resumo das alterações

- **Backend:** Lê `DATABASE_URL` ou `ConnectionStrings__DefaultConnection`. CORS via `CORS__Origins`.
- **Frontend:** Config dinâmica (`/config.json`). Use `API_URL` e `HUB_URL` no deploy.

---

## 1. PostgreSQL

- Adicione **PostgreSQL** ao projeto.
- Copie a variável `DATABASE_URL` (ou use como referência nos outros serviços).

---

## 2. Backend (API) – Deploy com Docker

**Criar serviço:** New → GitHub Repo → selecione o repositório

**Settings → Build:**
| Configuração | Valor |
|--------------|-------|
| **Root Directory** | `Backend/PokerRvd.Api` |
| **Builder** | `Dockerfile` |
| **Dockerfile Path** | `Dockerfile` (ou deixe em branco – o Railway usa o `Dockerfile` da pasta) |
| **Build Command** | *(deixar em branco)* |
| **Start Command** | *(deixar em branco – o Dockerfile define o ENTRYPOINT)* |

**Variáveis:**
- `DATABASE_URL` – referência ao PostgreSQL (ou o connection string completo)
- `Jwt__Key` – **obrigatória**: segredo aleatório de pelo menos 32 caracteres. Sem ela a API não sobe. Trocá-la encerra todas as sessões.
- `Admin__SenhaInicial` – **obrigatória no primeiro deploy**: pelo menos 12 caracteres. Substitui a senha padrão de `admin@pokerrvd.com`; sem ela essa conta fica bloqueada. Depois da troca, a variável não altera mais a senha.
- `CORS__Origins` – **obrigatória**: URL do sistema, ex: `https://poker-rvd-web.up.railway.app` (várias separadas por vírgula, sem a do site)
- `Cloudinary__CloudName`, `Cloudinary__ApiKey`, `Cloudinary__ApiSecret` – envio de imagens das postagens. Sem elas o resto funciona, mas o upload responde que não está configurado.

**Networking:** Generate Domain → ex: `https://poker-rvd-api.up.railway.app`

---

## 3. Frontend (Angular) – Deploy com Docker

**Criar serviço:** New → GitHub Repo → selecione o mesmo repositório

**Settings → Build:**
| Configuração | Valor |
|--------------|-------|
| **Root Directory** | *(vazio – raiz do projeto)* |
| **Builder** | `Dockerfile` |
| **Dockerfile Path** | `Dockerfile.frontend` |
| **Build Command** | *(deixar em branco)* |
| **Start Command** | *(deixar em branco – o Dockerfile define o ENTRYPOINT)* |

**Variáveis:**
- `API_URL` – URL da API, ex: `https://poker-rvd-api.up.railway.app/api`
- `HUB_URL` – URL do Hub SignalR, ex: `https://poker-rvd-api.up.railway.app/hubs/poker`

**Networking:** Generate Domain → ex: `https://poker-rvd-web.up.railway.app`

---

### Onde encontrar as opções de Docker no Railway

1. Clique no **serviço** (API ou Frontend).
2. Vá na aba **Settings**.
3. Na seção **Build**, procure:
   - **Builder** → escolha `Dockerfile` (em vez de Nixpacks).
   - **Dockerfile Path** → informe o caminho do Dockerfile (ex.: `Dockerfile.frontend`).
4. Salve e inicie um novo deploy.

---

## 4. Ordem de deploy

1. Suba PostgreSQL.
2. Suba o backend e gere o domínio.
3. Suba o frontend com `API_URL` e `HUB_URL` apontando para o domínio da API.
4. No backend, ajuste `CORS__Origins` para a URL do frontend.

---

## URLs locais (desenvolvimento)

O `public/config.json` tem valores padrão para desenvolvimento local.  
Em produção, o `entrypoint.sh` gera o `config.json` usando `API_URL` e `HUB_URL`.
