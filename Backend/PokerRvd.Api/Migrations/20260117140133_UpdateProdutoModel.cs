using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProdutoModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Produtos");

            migrationBuilder.RenameColumn(
                name: "Preco",
                table: "Produtos",
                newName: "ValorCusto");

            migrationBuilder.RenameColumn(
                name: "Estoque",
                table: "Produtos",
                newName: "QuantidadeEstoque");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataCadastro",
                table: "Produtos",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UnidadeVenda",
                table: "Produtos",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ValorComercial",
                table: "Produtos",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(8003));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(8006));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(8008));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 1, 17, 12, 1, 33, 407, DateTimeKind.Utc).AddTicks(8009), new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(8020) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(5749));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(5661));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(5663));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DataCadastro", "UnidadeVenda", "ValorComercial", "ValorCusto" },
                values: new object[] { new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7973), "Unidade", 10.00m, 6.00m });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DataCadastro", "UnidadeVenda", "ValorComercial", "ValorCusto" },
                values: new object[] { new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7975), "Unidade", 7.00m, 4.00m });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DataCadastro", "UnidadeVenda", "ValorComercial", "ValorCusto" },
                values: new object[] { new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7977), "Unidade", 5.00m, 2.50m });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataCadastro", "UnidadeVenda", "ValorComercial", "ValorCusto" },
                values: new object[] { new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7979), "Porção", 25.00m, 15.00m });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "DataCadastro", "UnidadeVenda", "ValorComercial", "ValorCusto" },
                values: new object[] { new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7981), "Unidade", 15.00m, 8.00m });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(8038));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(8040));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(8042));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataCadastro",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "UnidadeVenda",
                table: "Produtos");

            migrationBuilder.DropColumn(
                name: "ValorComercial",
                table: "Produtos");

            migrationBuilder.RenameColumn(
                name: "ValorCusto",
                table: "Produtos",
                newName: "Preco");

            migrationBuilder.RenameColumn(
                name: "QuantidadeEstoque",
                table: "Produtos",
                newName: "Estoque");

            migrationBuilder.AddColumn<int>(
                name: "Categoria",
                table: "Produtos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(439));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(442));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(444));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 1, 17, 10, 29, 11, 323, DateTimeKind.Utc).AddTicks(446), new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(458) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 322, DateTimeKind.Utc).AddTicks(8289));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 322, DateTimeKind.Utc).AddTicks(8193));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 322, DateTimeKind.Utc).AddTicks(8195));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Categoria", "Preco" },
                values: new object[] { 0, 10.00m });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Categoria", "Preco" },
                values: new object[] { 0, 7.00m });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Categoria", "Preco" },
                values: new object[] { 0, 5.00m });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Categoria", "Preco" },
                values: new object[] { 1, 25.00m });

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Categoria", "Preco" },
                values: new object[] { 1, 15.00m });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(477));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(479));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(481));
        }
    }
}
