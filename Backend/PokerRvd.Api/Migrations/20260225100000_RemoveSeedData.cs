using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ""ItensComanda"" WHERE ""ComandaId"" IN (1, 2, 3, 4);");

            migrationBuilder.DeleteData(table: "Comandas", keyColumn: "Id", keyValue: 1);
            migrationBuilder.DeleteData(table: "Comandas", keyColumn: "Id", keyValue: 2);
            migrationBuilder.DeleteData(table: "Comandas", keyColumn: "Id", keyValue: 3);
            migrationBuilder.DeleteData(table: "Comandas", keyColumn: "Id", keyValue: 4);

            migrationBuilder.DeleteData(table: "Produtos", keyColumn: "Id", keyValue: 1);
            migrationBuilder.DeleteData(table: "Produtos", keyColumn: "Id", keyValue: 2);
            migrationBuilder.DeleteData(table: "Produtos", keyColumn: "Id", keyValue: 3);
            migrationBuilder.DeleteData(table: "Produtos", keyColumn: "Id", keyValue: 4);
            migrationBuilder.DeleteData(table: "Produtos", keyColumn: "Id", keyValue: 5);

            migrationBuilder.DeleteData(table: "Usuarios", keyColumn: "Id", keyValue: 1);
            migrationBuilder.DeleteData(table: "Usuarios", keyColumn: "Id", keyValue: 2);
            migrationBuilder.DeleteData(table: "Usuarios", keyColumn: "Id", keyValue: 3);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Ativo", "Cpf", "DataCadastro", "Email", "Nome", "PermissaoAdicionarEstoque", "PermissaoCadastrarProduto", "PermissaoCaixas", "PermissaoComandas", "PermissaoFecharComanda", "PermissaoFuncionarios", "PermissaoProdutos", "PermissaoRemoverItemComanda", "PermissaoTorneios", "Role", "SenhaHash" },
                values: new object[,]
                {
                    { 1, true, "", new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(136), "admin@pokerrvd.com", "Administrador", false, false, false, false, false, false, false, false, false, 0, "nxVhJ8mHRVPQOqKFAc/IH8WzFDxBLy4aTgHNZrg3lRo=" },
                    { 2, true, "", new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(139), "gerente@pokerrvd.com", "Gerente Teste", false, false, false, false, false, false, false, false, false, 1, "g76l+wqJm3oqBPLjjyLqHGVX4SN1aMB5w+QV7gJ8FwM=" },
                    { 3, true, "", new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(141), "atendente@pokerrvd.com", "Atendente Teste", false, false, false, false, false, false, false, false, false, 2, "g76l+wqJm3oqBPLjjyLqHGVX4SN1aMB5w+QV7gJ8FwM=" }
                });

            migrationBuilder.InsertData(
                table: "Produtos",
                columns: new[] { "Id", "Ativo", "DataCadastro", "Nome", "QuantidadeEstoque", "UnidadeVenda", "ValorComercial", "ValorCusto" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2026, 2, 24, 17, 19, 6, 433, DateTimeKind.Utc).AddTicks(9889), "Cerveja", 100, "Unidade", 10.00m, 6.00m },
                    { 2, true, new DateTime(2026, 2, 24, 17, 19, 6, 433, DateTimeKind.Utc).AddTicks(9892), "Refrigerante", 80, "Unidade", 7.00m, 4.00m },
                    { 3, true, new DateTime(2026, 2, 24, 17, 19, 6, 433, DateTimeKind.Utc).AddTicks(9894), "Água", 150, "Unidade", 5.00m, 2.50m },
                    { 4, true, new DateTime(2026, 2, 24, 17, 19, 6, 433, DateTimeKind.Utc).AddTicks(9896), "Porção de Batata", 30, "Porção", 25.00m, 15.00m },
                    { 5, true, new DateTime(2026, 2, 24, 17, 19, 6, 433, DateTimeKind.Utc).AddTicks(9898), "Sanduíche", 40, "Unidade", 15.00m, 8.00m }
                });

            migrationBuilder.InsertData(
                table: "Comandas",
                columns: new[] { "Id", "DataAbertura", "DataFechamento", "JogadorNome", "Mesa", "Status", "Tipo", "ValorBebidas", "ValorFichas" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(88), null, "João Silva", "Mesa 5", 0, 0, 0m, 332.00m },
                    { 2, new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(91), null, "Maria Santos", "Mesa 2", 0, 1, 0m, 555.00m },
                    { 3, new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(94), null, "Pedro Costa", "Bar", 0, 2, 61.00m, 0m },
                    { 4, new DateTime(2026, 2, 24, 15, 19, 6, 434, DateTimeKind.Utc).AddTicks(95), new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(112), "Ana Oliveira", "Mesa 3", 1, 0, 0m, 220.90m }
                });
        }
    }
}
