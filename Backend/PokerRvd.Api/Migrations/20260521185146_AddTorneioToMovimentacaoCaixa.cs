using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTorneioToMovimentacaoCaixa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TorneioId",
                table: "MovimentacoesCaixa",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TorneioNome",
                table: "MovimentacoesCaixa",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TorneioId",
                table: "MovimentacoesCaixa");

            migrationBuilder.DropColumn(
                name: "TorneioNome",
                table: "MovimentacoesCaixa");
        }
    }
}
