using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddDescontoToMovimentacaoCaixa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.AddColumn<decimal>(
                name: "Desconto",
                table: "MovimentacoesCaixa",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Desconto",
                table: "MovimentacoesCaixa");

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Ativo", "Cpf", "DataCadastro", "Email", "Nome", "PermissaoAdicionarEstoque", "PermissaoCadastrarProduto", "PermissaoCaixas", "PermissaoComandas", "PermissaoFecharComanda", "PermissaoFuncionarios", "PermissaoProdutos", "PermissaoRemoverItemComanda", "PermissaoTorneios", "Role", "SenhaHash", "UltimoAcesso" },
                values: new object[,]
                {
                    { 1, true, "", new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(136), "admin@pokerrvd.com", "Administrador", false, false, false, false, false, false, false, false, false, 0, "nxVhJ8mHRVPQOqKFAc/IH8WzFDxBLy4aTgHNZrg3lRo=", null },
                    { 2, true, "", new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(139), "gerente@pokerrvd.com", "Gerente Teste", false, false, false, false, false, false, false, false, false, 1, "g76l+wqJm3oqBPLjjyLqHGVX4SN1aMB5w+QV7gJ8FwM=", null },
                    { 3, true, "", new DateTime(2026, 2, 24, 17, 19, 6, 434, DateTimeKind.Utc).AddTicks(141), "atendente@pokerrvd.com", "Atendente Teste", false, false, false, false, false, false, false, false, false, 2, "g76l+wqJm3oqBPLjjyLqHGVX4SN1aMB5w+QV7gJ8FwM=", null }
                });
        }
    }
}
