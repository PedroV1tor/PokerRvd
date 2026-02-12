-- Script manual para adicionar a coluna CaixaId na tabela Comandas
-- Execute este script no PostgreSQL

-- Adicionar coluna CaixaId se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='Comandas' AND column_name='CaixaId'
    ) THEN
        ALTER TABLE "Comandas" ADD COLUMN "CaixaId" integer NULL;
        RAISE NOTICE 'Coluna CaixaId adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna CaixaId já existe';
    END IF;
END $$;

-- Adicionar coluna FormaPagamento se não existir  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='MovimentacoesCaixa' AND column_name='FormaPagamento'
    ) THEN
        ALTER TABLE "MovimentacoesCaixa" ADD COLUMN "FormaPagamento" character varying(50) NULL;
        RAISE NOTICE 'Coluna FormaPagamento adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna FormaPagamento já existe';
    END IF;
END $$;
