using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCaixaIdToComanda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6718));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6720));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6722));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 1, 21, 14, 53, 0, 478, DateTimeKind.Utc).AddTicks(6724), new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6739) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(2849));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(2746));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(2748));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6629));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6631));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6633));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6635));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6637));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6764));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6766));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 21, 16, 53, 0, 478, DateTimeKind.Utc).AddTicks(6768));
        }
    }
}
