using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <summary>
    /// Garante que o usuário admin existe e está com a senha correta (mesmo algoritmo do AuthService).
    /// Login admin: admin@pokerrvd.com / Admin123
    /// </summary>
    public partial class EnsureAdminUsuario : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var hash = HashPassword("Admin123");
            var hashEscaped = hash.Replace("'", "''");
            migrationBuilder.Sql($@"
UPDATE ""Usuarios""
SET ""SenhaHash"" = '{hashEscaped}', ""Ativo"" = true
WHERE ""Email"" = 'admin@pokerrvd.com';

INSERT INTO ""Usuarios"" (""Nome"", ""Email"", ""Cpf"", ""SenhaHash"", ""Role"", ""Ativo"", ""DataCadastro"", ""PermissaoComandas"", ""PermissaoTorneios"", ""PermissaoProdutos"", ""PermissaoFuncionarios"", ""PermissaoCaixas"", ""PermissaoFecharComanda"", ""PermissaoRemoverItemComanda"")
SELECT 'Administrador', 'admin@pokerrvd.com', '', '{hashEscaped}', 0, true, NOW(), false, false, false, false, false, false, false
WHERE NOT EXISTS (SELECT 1 FROM ""Usuarios"" WHERE ""Email"" = 'admin@pokerrvd.com');
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Não desfazemos alteração no admin (segurança)
        }

        /// <summary>
        /// Mesmo algoritmo usado em AuthService e FuncionarioService (salt PokerRvd_Salt_Key).
        /// </summary>
        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password + "PokerRvd_Salt_Key");
            var hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }
    }
}
