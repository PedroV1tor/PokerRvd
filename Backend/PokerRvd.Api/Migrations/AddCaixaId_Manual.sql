-- Execute este script no PostgreSQL se aparecer erro "coluna c.CaixaId não existe".
-- Adiciona a coluna CaixaId na tabela Comandas.
--
-- COMO RODAR:
-- 1. Abra o pgAdmin ou terminal com psql conectado ao banco PokerRVD.
-- 2. Execute o bloco abaixo (DO $$ ... END $$;).
--
-- Ou pelo terminal (na pasta do projeto):
--   psql -U postgres -d PokerRVD -f Backend/PokerRvd.Api/Migrations/AddCaixaId_Manual.sql

DO $$
BEGIN
  ALTER TABLE "Comandas" ADD COLUMN "CaixaId" integer NULL;
EXCEPTION
  WHEN duplicate_column THEN NULL; -- coluna já existe, ignorar
END $$;
