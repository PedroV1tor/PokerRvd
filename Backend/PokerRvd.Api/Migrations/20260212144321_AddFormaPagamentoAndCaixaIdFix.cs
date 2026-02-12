using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFormaPagamentoAndCaixaIdFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Adicionar coluna CaixaId se não existir
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name='Comandas' AND column_name='CaixaId'
                    ) THEN
                        ALTER TABLE ""Comandas"" ADD COLUMN ""CaixaId"" integer NULL;
                    END IF;
                END $$;
            ");

            // Adicionar coluna FormaPagamento se não existir  
            migrationBuilder.Sql(@"
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 
                        FROM information_schema.columns 
                        WHERE table_name='MovimentacoesCaixa' AND column_name='FormaPagamento'
                    ) THEN
                        ALTER TABLE ""MovimentacoesCaixa"" ADD COLUMN ""FormaPagamento"" character varying(50) NULL;
                    END IF;
                END $$;
            ");

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9814));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9817));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9819));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 2, 12, 12, 43, 21, 187, DateTimeKind.Utc).AddTicks(9820), new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9833) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(6489));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(6312));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(6314));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9780));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9783));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9785));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9787));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9789));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9855));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9857));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 43, 21, 187, DateTimeKind.Utc).AddTicks(9859));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2860));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2862));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2864));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 2, 12, 12, 31, 9, 904, DateTimeKind.Utc).AddTicks(2866), new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2878) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 903, DateTimeKind.Utc).AddTicks(9884));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 903, DateTimeKind.Utc).AddTicks(9792));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 903, DateTimeKind.Utc).AddTicks(9794));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2826));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2829));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2831));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2833));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2835));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2897));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2900));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 14, 31, 9, 904, DateTimeKind.Utc).AddTicks(2901));
        }
    }
}
