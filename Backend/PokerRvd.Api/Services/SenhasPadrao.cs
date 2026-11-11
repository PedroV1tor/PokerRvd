using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

/// <summary>
/// Senhas das contas de teste, que estão documentadas no repositório.
/// Fora de desenvolvimento elas não abrem sessão.
/// </summary>
public static class SenhasPadrao
{
    private const string EmailAdmin = "admin@pokerrvd.com";
    private const int TamanhoMinimo = 12;

    private static readonly string[] Senhas = { "Admin123", "Senha123" };

    public static bool EhSenhaPadrao(string senha) => Senhas.Contains(senha);

    private static bool UsaSenhaPadrao(string senhaHash) => Senhas.Any(s => PasswordHasher.Verify(s, senhaHash));

    /// <summary>
    /// Substitui a senha padrão do admin por Admin__SenhaInicial. Só age enquanto a senha padrão continuar lá,
    /// então manter a variável configurada não desfaz uma troca feita depois.
    /// </summary>
    public static async Task ProtegerAdminAsync(PokerDbContext db, string? senhaInicial, ILogger logger)
    {
        var admin = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == EmailAdmin && u.Role == UserRole.ADMIN);
        if (admin == null || !UsaSenhaPadrao(admin.SenhaHash)) return;

        if (string.IsNullOrEmpty(senhaInicial) || senhaInicial.Length < TamanhoMinimo)
        {
            logger.LogWarning("A conta {Email} usa senha padrão e está bloqueada. Configure Admin__SenhaInicial com pelo menos {Tamanho} caracteres.", EmailAdmin, TamanhoMinimo);
            return;
        }

        admin.SenhaHash = PasswordHasher.Hash(senhaInicial);
        await db.SaveChangesAsync();
        logger.LogInformation("Senha padrão da conta {Email} substituída por Admin__SenhaInicial.", EmailAdmin);
    }
}
