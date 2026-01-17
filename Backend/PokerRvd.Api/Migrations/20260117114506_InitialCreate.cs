using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Comandas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    JogadorNome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    JogadorFoto = table.Column<string>(type: "text", nullable: true),
                    Mesa = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Tipo = table.Column<int>(type: "integer", nullable: false),
                    ValorFichas = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ValorBebidas = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    DataAbertura = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DataFechamento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comandas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BuyIn = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    MaxPlayers = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Produtos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Preco = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Categoria = table.Column<int>(type: "integer", nullable: false),
                    Estoque = table.Column<int>(type: "integer", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produtos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nome = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SenhaHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    Ativo = table.Column<bool>(type: "boolean", nullable: false),
                    DataCadastro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UltimoAcesso = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Balance = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    GameId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Players_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ItensComanda",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ComandaId = table.Column<int>(type: "integer", nullable: false),
                    ProdutoId = table.Column<int>(type: "integer", nullable: false),
                    Quantidade = table.Column<int>(type: "integer", nullable: false),
                    ValorUnitario = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItensComanda", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItensComanda_Comandas_ComandaId",
                        column: x => x.ComandaId,
                        principalTable: "Comandas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItensComanda_Produtos_ProdutoId",
                        column: x => x.ProdutoId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Comandas",
                columns: new[] { "Id", "DataAbertura", "DataFechamento", "JogadorFoto", "JogadorNome", "Mesa", "Status", "Tipo", "ValorBebidas", "ValorFichas" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2345), null, null, "João Silva", "Mesa 5", 0, 0, 0m, 332.00m },
                    { 2, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2348), null, null, "Maria Santos", "Mesa 2", 0, 1, 0m, 555.00m },
                    { 3, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2350), null, null, "Pedro Costa", "Bar", 0, 2, 61.00m, 0m },
                    { 4, new DateTime(2026, 1, 17, 9, 45, 6, 398, DateTimeKind.Utc).AddTicks(2352), new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2364), null, "Ana Oliveira", "Mesa 3", 1, 0, 0m, 220.90m }
                });

            migrationBuilder.InsertData(
                table: "Games",
                columns: new[] { "Id", "BuyIn", "CreatedAt", "MaxPlayers", "Name", "Status" },
                values: new object[] { 1, 100m, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(236), 9, "Mesa Principal", 0 });

            migrationBuilder.InsertData(
                table: "Players",
                columns: new[] { "Id", "Balance", "CreatedAt", "Email", "GameId", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, 1000m, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(134), "jogador1@poker.com", null, true, "Jogador 1" },
                    { 2, 1500m, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(136), "jogador2@poker.com", null, true, "Jogador 2" }
                });

            migrationBuilder.InsertData(
                table: "Produtos",
                columns: new[] { "Id", "Ativo", "Categoria", "Estoque", "Nome", "Preco" },
                values: new object[,]
                {
                    { 1, true, 0, 100, "Cerveja", 10.00m },
                    { 2, true, 0, 80, "Refrigerante", 7.00m },
                    { 3, true, 0, 150, "Água", 5.00m },
                    { 4, true, 1, 30, "Porção de Batata", 25.00m },
                    { 5, true, 1, 40, "Sanduíche", 15.00m }
                });

            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Id", "Ativo", "DataCadastro", "Email", "Nome", "Role", "SenhaHash", "UltimoAcesso" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2385), "admin@pokerrvd.com", "Administrador", 0, "nxVhJ8mHRVPQOqKFAc/IH8WzFDxBLy4aTgHNZrg3lRo=", null },
                    { 2, true, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2387), "gerente@pokerrvd.com", "Gerente Teste", 1, "g76l+wqJm3oqBPLjjyLqHGVX4SN1aMB5w+QV7gJ8FwM=", null },
                    { 3, true, new DateTime(2026, 1, 17, 11, 45, 6, 398, DateTimeKind.Utc).AddTicks(2388), "atendente@pokerrvd.com", "Atendente Teste", 2, "g76l+wqJm3oqBPLjjyLqHGVX4SN1aMB5w+QV7gJ8FwM=", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItensComanda_ComandaId",
                table: "ItensComanda",
                column: "ComandaId");

            migrationBuilder.CreateIndex(
                name: "IX_ItensComanda_ProdutoId",
                table: "ItensComanda",
                column: "ProdutoId");

            migrationBuilder.CreateIndex(
                name: "IX_Players_GameId",
                table: "Players",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItensComanda");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Comandas");

            migrationBuilder.DropTable(
                name: "Produtos");

            migrationBuilder.DropTable(
                name: "Games");
        }
    }
}
