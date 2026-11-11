using System.Security.Cryptography;
using System.Text;

namespace PokerRvd.Api.Services;

/// <summary>
/// Hash de senha compartilhado (AuthService, FuncionarioService, DataSeeder).
/// Usa PBKDF2 com salt por usuário. Senhas antigas (SHA-256) continuam válidas
/// e são convertidas no próximo login bem-sucedido.
/// </summary>
public static class PasswordHasher
{
    private const string Prefixo = "pbkdf2";
    private const int Iteracoes = 600_000;
    private const int TamanhoSalt = 16;
    private const int TamanhoHash = 32;
    private const string SaltLegado = "PokerRvd_Salt_Key";

    private static readonly Lazy<string> HashFicticio = new(() => Hash(Guid.NewGuid().ToString()));

    public static string Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(TamanhoSalt);
        var hash = Derivar(password, salt, Iteracoes);
        return $"{Prefixo}${Iteracoes}${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";
    }

    public static bool Verify(string password, string hash)
    {
        var partes = hash.Split('$');
        try
        {
            if (partes.Length != 4 || partes[0] != Prefixo)
                return Comparar(HashLegado(password), Convert.FromBase64String(hash));

            var esperado = Convert.FromBase64String(partes[3]);
            return Comparar(Derivar(password, Convert.FromBase64String(partes[2]), int.Parse(partes[1])), esperado);
        }
        catch (FormatException)
        {
            return false;
        }
    }

    public static bool PrecisaAtualizar(string hash) => !hash.StartsWith($"{Prefixo}${Iteracoes}$");

    /// <summary>Gasta o mesmo tempo de uma verificação real, para não revelar quais e-mails existem.</summary>
    public static void SimularVerificacao(string password) => Verify(password, HashFicticio.Value);

    private static byte[] Derivar(string password, byte[] salt, int iteracoes) =>
        Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(password), salt, iteracoes, HashAlgorithmName.SHA256, TamanhoHash);

    private static byte[] HashLegado(string password) =>
        SHA256.HashData(Encoding.UTF8.GetBytes(password + SaltLegado));

    private static bool Comparar(byte[] a, byte[] b) => CryptographicOperations.FixedTimeEquals(a, b);
}
