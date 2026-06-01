using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPermissaoConferenciaToUsuario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PermissaoConferencia",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermissaoConferencia",
                table: "Usuarios");
        }
    }
}
