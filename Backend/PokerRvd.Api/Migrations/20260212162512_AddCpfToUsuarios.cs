using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCpfToUsuarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Cpf",
                table: "Usuarios",
                type: "text",
                nullable: false,
                defaultValue: "");

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
                columns: new[] { "Cpf", "DataCadastro" },
                values: new object[] { "", new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7665) });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Cpf", "DataCadastro" },
                values: new object[] { "", new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7667) });

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Cpf", "DataCadastro" },
                values: new object[] { "", new DateTime(2026, 2, 12, 16, 25, 12, 475, DateTimeKind.Utc).AddTicks(7669) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cpf",
                table: "Usuarios");

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
    }
}
