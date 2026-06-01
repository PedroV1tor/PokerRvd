using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddObservacaoToConferencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Observacao",
                table: "ConferenciasCaixa",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Observacao",
                table: "ConferenciasCaixa");
        }
    }
}
