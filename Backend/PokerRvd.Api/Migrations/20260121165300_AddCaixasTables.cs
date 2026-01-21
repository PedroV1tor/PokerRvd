using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCaixasTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Caixas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DataAbertura = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataFechamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    SaldoInicial = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    SaldoFinal = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    TotalEntradas = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    TotalSaidas = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    UsuarioAbertura = table.Column<string>(type: "text", nullable: false),
                    UsuarioFechamento = table.Column<string>(type: "text", nullable: true),
                    ObservacoesAbertura = table.Column<string>(type: "text", nullable: true),
                    ObservacoesFechamento = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Caixas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MovimentacoesCaixa",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CaixaId = table.Column<int>(type: "integer", nullable: false),
                    DataHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Tipo = table.Column<string>(type: "text", nullable: false),
                    Categoria = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Descricao = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Valor = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ComandaId = table.Column<int>(type: "integer", nullable: true),
                    ComandaNome = table.Column<string>(type: "text", nullable: true),
                    UsuarioNome = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovimentacoesCaixa", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MovimentacoesCaixa_Caixas_CaixaId",
                        column: x => x.CaixaId,
                        principalTable: "Caixas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_MovimentacoesCaixa_CaixaId",
                table: "MovimentacoesCaixa",
                column: "CaixaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovimentacoesCaixa");

            migrationBuilder.DropTable(
                name: "Caixas");

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
        }
    }
}
