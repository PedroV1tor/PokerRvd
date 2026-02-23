-- Adiciona as colunas de permissão de produto na tabela Usuarios (se não existirem).
-- Execute no PostgreSQL (pgAdmin ou psql) no banco da aplicação.

ALTER TABLE "Usuarios"
ADD COLUMN IF NOT EXISTS "PermissaoAdicionarEstoque" boolean NOT NULL DEFAULT false;

ALTER TABLE "Usuarios"
ADD COLUMN IF NOT EXISTS "PermissaoCadastrarProduto" boolean NOT NULL DEFAULT false;
