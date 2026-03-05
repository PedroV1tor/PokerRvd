using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Models;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Data;

/// <summary>
/// Garante usuários padrão seguindo o mesmo padrão do FuncionarioService.CreateFuncionarioAsync.
/// </summary>
public static class DataSeeder
{
    public static async Task EnsureDefaultUsuariosAsync(PokerDbContext db, ILogger logger)
    {
        var defaultUsers = new[]
        {
            (Email: "admin@pokerrvd.com", Nome: "Administrador", Senha: "Admin123", Role: UserRole.ADMIN, Permissoes: TodasPermissoes()),
            (Email: "gerente@pokerrvd.com", Nome: "Gerente Teste", Senha: "Senha123", Role: UserRole.GERENTE, Permissoes: PermissoesGerente()),
            (Email: "atendente@pokerrvd.com", Nome: "Atendente Teste", Senha: "Senha123", Role: UserRole.ATENDENTE, Permissoes: PermissoesAtendente())
        };

        foreach (var (email, nome, senha, role, permissoes) in defaultUsers)
        {
            var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
            var senhaHash = PasswordHasher.Hash(senha);

            if (usuario == null)
            {
                db.Usuarios.Add(new Usuario
                {
                    Nome = nome,
                    Cpf = "",
                    Email = email.ToLowerInvariant(),
                    SenhaHash = senhaHash,
                    Role = role,
                    Ativo = true,
                    DataCadastro = DateTime.UtcNow,
                    PermissaoComandas = permissoes.Comandas,
                    PermissaoTorneios = permissoes.Torneios,
                    PermissaoProdutos = permissoes.Produtos,
                    PermissaoFuncionarios = permissoes.Funcionarios,
                    PermissaoCaixas = permissoes.Caixas,
                    PermissaoFecharComanda = permissoes.FecharComanda,
                    PermissaoRemoverItemComanda = permissoes.RemoverItemComanda,
                    PermissaoAdicionarEstoque = permissoes.AdicionarEstoque,
                    PermissaoCadastrarProduto = permissoes.CadastrarProduto
                });
                logger.LogInformation("Usuário padrão criado: {Email}", email);
            }
            else
            {
                usuario.SenhaHash = senhaHash;
                usuario.Nome = nome;
                usuario.Ativo = true;
                usuario.PermissaoComandas = permissoes.Comandas;
                usuario.PermissaoTorneios = permissoes.Torneios;
                usuario.PermissaoProdutos = permissoes.Produtos;
                usuario.PermissaoFuncionarios = permissoes.Funcionarios;
                usuario.PermissaoCaixas = permissoes.Caixas;
                usuario.PermissaoFecharComanda = permissoes.FecharComanda;
                usuario.PermissaoRemoverItemComanda = permissoes.RemoverItemComanda;
                usuario.PermissaoAdicionarEstoque = permissoes.AdicionarEstoque;
                usuario.PermissaoCadastrarProduto = permissoes.CadastrarProduto;
            }
        }

        await db.SaveChangesAsync();
    }

    private static (bool Comandas, bool Torneios, bool Produtos, bool Funcionarios, bool Caixas, bool FecharComanda, bool RemoverItemComanda, bool AdicionarEstoque, bool CadastrarProduto) TodasPermissoes()
        => (true, true, true, true, true, true, true, true, true);

    private static (bool Comandas, bool Torneios, bool Produtos, bool Funcionarios, bool Caixas, bool FecharComanda, bool RemoverItemComanda, bool AdicionarEstoque, bool CadastrarProduto) PermissoesGerente()
        => (true, true, true, false, true, true, true, true, true);

    private static (bool Comandas, bool Torneios, bool Produtos, bool Funcionarios, bool Caixas, bool FecharComanda, bool RemoverItemComanda, bool AdicionarEstoque, bool CadastrarProduto) PermissoesAtendente()
        => (true, true, true, false, false, false, false, false, false);
}
