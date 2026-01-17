namespace PokerRvd.Api.Models;

public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.ATENDENTE;
    public bool Ativo { get; set; } = true;
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    public DateTime? UltimoAcesso { get; set; }
}

public enum UserRole
{
    ADMIN,
    GERENTE,
    ATENDENTE
}
