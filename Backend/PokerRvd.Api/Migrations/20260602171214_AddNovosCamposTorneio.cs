using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNovosCamposTorneio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ValorAddOnDuplo",
                table: "Torneios",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ValorBuyIn2",
                table: "Torneios",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ValorRebuyTriplo",
                table: "Torneios",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValorAddOnDuplo",
                table: "Torneios");

            migrationBuilder.DropColumn(
                name: "ValorBuyIn2",
                table: "Torneios");

            migrationBuilder.DropColumn(
                name: "ValorRebuyTriplo",
                table: "Torneios");
        }
    }
}
