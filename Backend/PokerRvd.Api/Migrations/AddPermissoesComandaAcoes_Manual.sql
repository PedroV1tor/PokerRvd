-- Adiciona as colunas de permissão de comanda na tabela Usuarios (se não existirem).
-- Execute no PostgreSQL (pgAdmin ou psql) no banco da aplicação.
-- Erro 42703 "coluna PermissaoFecharComanda não existe" indica que esta migration não foi aplicada.

ALTER TABLE "Usuarios"
ADD COLUMN IF NOT EXISTS "PermissaoFecharComanda" boolean NOT NULL DEFAULT false;

ALTER TABLE "Usuarios"
ADD COLUMN IF NOT EXISTS "PermissaoRemoverItemComanda" boolean NOT NULL DEFAULT false;
