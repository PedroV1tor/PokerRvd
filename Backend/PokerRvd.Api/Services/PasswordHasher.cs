using System.Security.Cryptography;
using System.Text;

namespace PokerRvd.Api.Services;

/// <summary>
/// Hash de senha compartilhado (AuthService, FuncionarioService, DataSeeder).
/// Evita divergência no algoritmo usado para criar/validar usuários.
/// </summary>
public static class PasswordHasher
{
    private const string Salt = "PokerRvd_Salt_Key";

    public static string Hash(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password + Salt);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public static bool Verify(string password, string hash)
    {
        return Hash(password) == hash;
    }
}
