# Login do sistema

> Estas senhas valem somente em desenvolvimento. Fora dele, contas com senha padrão não abrem sessão: configure `Admin__SenhaInicial` (veja `DEPLOY_RAILWAY.md`).

## Usuário administrador (após migration ou script manual)

- **E-mail:** `admin@pokerrvd.com`
- **Senha:** `Admin123`

## Outros usuários de teste (se existirem no banco)

- **Gerente:** `gerente@pokerrvd.com` / `Senha123`
- **Atendente:** `atendente@pokerrvd.com` / `Senha123`

## Aplicar a correção do admin

1. **Via migration (recomendado):** pare a API, depois execute:
   ```bash
   cd Backend/PokerRvd.Api
   dotnet ef database update
   ```
2. **Via SQL manual:** execute o conteúdo do arquivo `Migrations/EnsureAdminUsuario_Manual.sql` no seu banco (pgAdmin ou psql).
