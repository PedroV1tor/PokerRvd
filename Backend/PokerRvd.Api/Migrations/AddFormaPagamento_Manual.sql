-- Execute este script no PostgreSQL se o caixa não carregar (coluna FormaPagamento não existe).
-- Adiciona a coluna FormaPagamento na tabela MovimentacoesCaixa.
--
-- COMO RODAR:
-- 1. Abra o terminal (PowerShell ou CMD).
-- 2. Vá até esta pasta:  Backend\PokerRvd.Api\Migrations
--    Exemplo:  cd "c:\Users\pedro vitor\Documents\PokerRvd\Backend\PokerRvd.Api\Migrations"
-- 3. Execute (use a senha do usuário postgres quando pedir):
--    psql -U postgres -d PokerRVD -f AddFormaPagamento_Manual.sql
--
-- Se o psql não for reconhecido, use o pgAdmin: abra o banco PokerRVD e execute o DO $$ ... END $$; abaixo.

DO $$
BEGIN
  ALTER TABLE "MovimentacoesCaixa" ADD COLUMN "FormaPagamento" character varying(50) NULL;
EXCEPTION
  WHEN duplicate_column THEN NULL; -- coluna já existe, ignorar
END $$;
