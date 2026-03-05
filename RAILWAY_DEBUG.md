# Debug – Railway – Nada aparece nos links

## 1. Verificar o que cada URL deve mostrar

| URL | O que deve aparecer |
|-----|----------------------|
| **Backend** (ex: `https://xxx-api.up.railway.app`) | Página HTML com "PokerRvd API" e links para Health/Swagger |
| **Backend** + `/api/health` | JSON com `{"status":"healthy",...}` |
| **Backend** + `/swagger` | Swagger UI |
| **Frontend** (ex: `https://xxx-web.up.railway.app`) | App Angular (login/dashboard) |

---

## 2. Se o Backend não mostra nada (502, tela em branco)

1. **Logs no Railway**
   - Serviço da API → **Deployments** → último deploy → **View Logs**
   - Procurar mensagens de erro em vermelho (database, migrations, exceções)

2. **Variáveis do backend**
   - `DATABASE_URL` ou `ConnectionStrings__DefaultConnection` definidas
   - `CORS__Origins` com a URL exata do frontend (ex: `https://xxx-web.up.railway.app`)

3. **Porta**
   - Não defina `PORT` ou use `8080`
   - Backend usa `PORT` do Railway

4. **Rede**
   - API e PostgreSQL no mesmo projeto Railway
   - API ligada ao PostgreSQL (variables reference)

---

## 3. Se o Frontend não mostra nada (502, tela em branco)

1. **Logs no Railway**
   - Serviço do Frontend → **Deployments** → **View Logs**
   - Procurar erros no build ou ao iniciar o container

2. **Variáveis do frontend**
   - `API_URL` = `https://SUA-URL-DA-API.up.railway.app/api`
   - `HUB_URL` = `https://SUA-URL-DA-API.up.railway.app/hubs/poker`
   - Troque `SUA-URL-DA-API` pela URL real do backend

3. **Porta**
   - Se definiu `PORT=8088`, o Nginx já está configurado para usar essa porta
   - Se não definiu `PORT`, o padrão é `80`

4. **Build**
   - Verificar se o build Docker conclui com sucesso

---

## 4. Conferir no navegador (DevTools)

1. Abrir DevTools (F12) → aba **Console**
2. Acessar a URL do frontend
3. Ver se aparecem:
   - Erros em vermelho (CORS, 404, 500)
   - Requisições falhando na aba **Network**

---

## 5. URLs corretas

- **Backend**: sem porta na URL → `https://seu-backend.up.railway.app`
- **Frontend**: sem porta na URL → `https://seu-frontend.up.railway.app`
- As portas 8080/8088 são internas; o Railway roteia automaticamente.

---

## 6. Checklist rápido

- [ ] PostgreSQL adicionado e com variáveis definidas
- [ ] Backend com `DATABASE_URL` ou `ConnectionStrings__DefaultConnection`
- [ ] Backend com domínio público gerado
- [ ] Frontend com domínio público gerado
- [ ] Frontend com `API_URL` e `HUB_URL` apontando para o backend
- [ ] Backend com `CORS__Origins` apontando para o frontend
- [ ] Ambos os deploys em estado **Success** (verde)
