using PokerRvd.Api.Models;

namespace PokerRvd.Api.DTOs;

public class FuncionarioDto : PermissoesBase
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime DataCadastro { get; set; }
    public DateTime? UltimoAcesso { get; set; }
}

public class CreateFuncionarioDto : PermissoesBase
{
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string Role { get; set; } = "ATENDENTE";
}

public class UpdateFuncionarioDto : PermissoesBase
{
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool Ativo { get; set; }

    // Opcional: quando preenchida, substitui a senha. Somente ADMIN.
    public string? NovaSenha { get; set; }
}
