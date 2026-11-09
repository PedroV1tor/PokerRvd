using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class DesativarContasPadrao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE ""Usuarios"" SET ""Ativo"" = false WHERE ""Email"" IN ('gerente@pokerrvd.com', 'atendente@pokerrvd.com');");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"UPDATE ""Usuarios"" SET ""Ativo"" = true WHERE ""Email"" IN ('gerente@pokerrvd.com', 'atendente@pokerrvd.com');");
        }
    }
}
