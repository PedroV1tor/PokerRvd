-- Garante usuário admin com senha correta (mesmo algoritmo do AuthService).
-- Execute no PostgreSQL (pgAdmin ou psql) no banco da aplicação se preferir não rodar a migration.
--
-- LOGIN ADMIN:
--   E-mail: admin@pokerrvd.com
--   Senha:  Admin123

-- Hash de "Admin123" com salt "PokerRvd_Salt_Key" (SHA256 + Base64)
UPDATE "Usuarios"
SET "SenhaHash" = 'pyWN+Y6fNjYNBy7v7yPg7CJLbEe+bTxwmnk5iGXstOg=', "Ativo" = true
WHERE "Email" = 'admin@pokerrvd.com';

-- Se o admin não existir, insere (ajuste o Id se necessário)
INSERT INTO "Usuarios" ("Nome", "Email", "Cpf", "SenhaHash", "Role", "Ativo", "DataCadastro", "PermissaoComandas", "PermissaoTorneios", "PermissaoProdutos", "PermissaoFuncionarios", "PermissaoCaixas", "PermissaoFecharComanda", "PermissaoRemoverItemComanda")
SELECT 'Administrador', 'admin@pokerrvd.com', '', 'pyWN+Y6fNjYNBy7v7yPg7CJLbEe+bTxwmnk5iGXstOg=', 0, true, NOW(), false, false, false, false, false, false, false
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE "Email" = 'admin@pokerrvd.com');
