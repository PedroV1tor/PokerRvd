using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPermissoesToUsuarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PermissaoCaixas",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoComandas",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoFuncionarios",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoProdutos",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoTorneios",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1161));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1164));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1166));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 2, 12, 15, 22, 3, 936, DateTimeKind.Utc).AddTicks(1168), new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1181) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 935, DateTimeKind.Utc).AddTicks(8033));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 935, DateTimeKind.Utc).AddTicks(7934));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 935, DateTimeKind.Utc).AddTicks(7936));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1127));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1130));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1132));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1134));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1136));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DataCadastro", "PermissaoCaixas", "PermissaoComandas", "PermissaoFuncionarios", "PermissaoProdutos", "PermissaoTorneios" },
                values: new object[] { new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1231), false, false, false, false, false });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DataCadastro", "PermissaoCaixas", "PermissaoComandas", "PermissaoFuncionarios", "PermissaoProdutos", "PermissaoTorneios" },
                values: new object[] { new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1234), false, false, false, false, false });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DataCadastro", "PermissaoCaixas", "PermissaoComandas", "PermissaoFuncionarios", "PermissaoProdutos", "PermissaoTorneios" },
                values: new object[] { new DateTime(2026, 2, 12, 17, 22, 3, 936, DateTimeKind.Utc).AddTicks(1236), false, false, false, false, false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermissaoCaixas",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoComandas",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoFuncionarios",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoProdutos",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoTorneios",
                table: "Usuarios");

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7622));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7625));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7627));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 2, 12, 14, 25, 12, 475, DateTimeKind.Utc).AddTicks(7629), new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7642) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(4588));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(4482));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(4485));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7589));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7591));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7594));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7596));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7598));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7665));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7667));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7669));
        }
    }
}
