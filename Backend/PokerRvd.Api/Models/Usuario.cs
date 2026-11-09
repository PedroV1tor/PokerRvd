namespace PokerRvd.Api.Models;

public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.ATENDENTE;
    public bool Ativo { get; set; } = true;
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    public DateTime? UltimoAcesso { get; set; }
    
    // Permissões por módulo
    public bool PermissaoComandas { get; set; } = false;
    public bool PermissaoTorneios { get; set; } = false;
    public bool PermissaoProdutos { get; set; } = false;
    public bool PermissaoFuncionarios { get; set; } = false;
    public bool PermissaoCaixas { get; set; } = false;
    public bool PermissaoConferencia { get; set; } = false;
    public bool PermissaoConteudo { get; set; } = false;

    // Permissões específicas de ações em comandas
    public bool PermissaoFecharComanda { get; set; } = false;
    public bool PermissaoRemoverItemComanda { get; set; } = false;

    // Permissões específicas de ações em produtos
    public bool PermissaoAdicionarEstoque { get; set; } = false;
    public bool PermissaoCadastrarProduto { get; set; } = false;
}

public enum UserRole
{
    ADMIN,
    GERENTE,
    ATENDENTE
}
