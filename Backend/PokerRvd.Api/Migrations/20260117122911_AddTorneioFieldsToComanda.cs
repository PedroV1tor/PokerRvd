using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTorneioFieldsToComanda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TorneioId",
                table: "Comandas",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TorneioNome",
                table: "Comandas",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DataAbertura", "TorneioId", "TorneioNome" },
                values: new object[] { new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(439), null, null });

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DataAbertura", "TorneioId", "TorneioNome" },
                values: new object[] { new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(442), null, null });

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DataAbertura", "TorneioId", "TorneioNome" },
                values: new object[] { new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(444), null, null });

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento", "TorneioId", "TorneioNome" },
                values: new object[] { new DateTime(2026, 1, 17, 10, 29, 11, 323, DateTimeKind.Utc).AddTicks(446), new DateTime(2026, 1, 17, 12, 29, 11, 323, DateTimeKind.Utc).AddTicks(458), null, null });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TorneioId",
                table: "Comandas");

            migrationBuilder.DropColumn(
                name: "TorneioNome",
                table: "Comandas");

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2345));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2348));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2350));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 1, 17, 9, 45, 6, 398, DateTimeKind.Utc).AddTicks(2352), new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2364) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(236));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(134));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(136));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2385));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2387));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2388));
        }
    }
}
