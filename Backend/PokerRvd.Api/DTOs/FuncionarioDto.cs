using PokerRvd.Api.Models;

namespace PokerRvd.Api.DTOs;

public class FuncionarioDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime DataCadastro { get; set; }
    public DateTime? UltimoAcesso { get; set; }
    
    // Permissões por módulo
    public bool PermissaoComandas { get; set; }
    public bool PermissaoTorneios { get; set; }
    public bool PermissaoProdutos { get; set; }
    public bool PermissaoFuncionarios { get; set; }
    public bool PermissaoCaixas { get; set; }

    // Permissões específicas de ações em comandas
    public bool PermissaoFecharComanda { get; set; }
    public bool PermissaoRemoverItemComanda { get; set; }

    // Permissões específicas de ações em produtos
    public bool PermissaoAdicionarEstoque { get; set; }
    public bool PermissaoCadastrarProduto { get; set; }
}

public class CreateFuncionarioDto
{
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string Role { get; set; } = "ATENDENTE";
    
    // Permissões
    public bool PermissaoComandas { get; set; } = false;
    public bool PermissaoTorneios { get; set; } = false;
    public bool PermissaoProdutos { get; set; } = false;
    public bool PermissaoFuncionarios { get; set; } = false;
    public bool PermissaoCaixas { get; set; } = false;

    // Permissões específicas de ações em comandas
    public bool PermissaoFecharComanda { get; set; } = false;
    public bool PermissaoRemoverItemComanda { get; set; } = false;

    // Permissões específicas de ações em produtos
    public bool PermissaoAdicionarEstoque { get; set; } = false;
    public bool PermissaoCadastrarProduto { get; set; } = false;
}

public class UpdateFuncionarioDto
{
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    
    // Permissões
    public bool PermissaoComandas { get; set; }
    public bool PermissaoTorneios { get; set; }
    public bool PermissaoProdutos { get; set; }
    public bool PermissaoFuncionarios { get; set; }
    public bool PermissaoCaixas { get; set; }

    // Permissões específicas de ações em comandas
    public bool PermissaoFecharComanda { get; set; }
    public bool PermissaoRemoverItemComanda { get; set; }

    // Permissões específicas de ações em produtos
    public bool PermissaoAdicionarEstoque { get; set; }
    public bool PermissaoCadastrarProduto { get; set; }
}
