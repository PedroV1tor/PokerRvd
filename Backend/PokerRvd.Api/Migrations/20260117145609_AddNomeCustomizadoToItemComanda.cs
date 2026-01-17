using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNomeCustomizadoToItemComanda : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItensComanda_Produtos_ProdutoId",
                table: "ItensComanda");

            migrationBuilder.AlterColumn<int>(
                name: "ProdutoId",
                table: "ItensComanda",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "NomeCustomizado",
                table: "ItensComanda",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8612));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8615));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataAbertura",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8617));

            migrationBuilder.UpdateData(
                table: "Comandas",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DataAbertura", "DataFechamento" },
                values: new object[] { new DateTime(2026, 1, 17, 12, 56, 8, 999, DateTimeKind.Utc).AddTicks(8619), new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8635) });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(6154));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(6057));

            migrationBuilder.UpdateData(
                table: "Players",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(6059));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8579));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8582));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8584));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8586));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8588));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8655));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8657));

            migrationBuilder.UpdateData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 56, 8, 999, DateTimeKind.Utc).AddTicks(8659));

            migrationBuilder.AddForeignKey(
                name: "FK_ItensComanda_Produtos_ProdutoId",
                table: "ItensComanda",
                column: "ProdutoId",
                principalTable: "Produtos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItensComanda_Produtos_ProdutoId",
                table: "ItensComanda");

            migrationBuilder.DropColumn(
                name: "NomeCustomizado",
                table: "ItensComanda");

            migrationBuilder.AlterColumn<int>(
                name: "ProdutoId",
                table: "ItensComanda",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

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
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7973));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 2,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7975));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 3,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7977));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 4,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7979));

            migrationBuilder.UpdateData(
                table: "Produtos",
                keyColumn: "Id",
                keyValue: 5,
                column: "DataCadastro",
                value: new DateTime(2026, 1, 17, 14, 1, 33, 407, DateTimeKind.Utc).AddTicks(7981));

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

            migrationBuilder.AddForeignKey(
                name: "FK_ItensComanda_Produtos_ProdutoId",
                table: "ItensComanda",
                column: "ProdutoId",
                principalTable: "Produtos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
