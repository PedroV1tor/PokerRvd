using System.Reflection;

namespace PokerRvd.Api.Models;

/// <summary>
/// Uma permissão por botão, agrupadas pelas seções do header do sistema.
/// A permissão da seção libera a tela; cada ação exige a seção e o próprio botão.
/// Para criar uma nova: adicionar aqui, em Permissoes.Secoes e em permissoes.model.ts (frontend).
/// </summary>
public abstract class PermissoesBase
{
    // Seção Comandas
    public bool PermissaoComandas { get; set; }
    public bool PermissaoCriarComanda { get; set; }
    public bool PermissaoAlterarStatusComanda { get; set; }
    public bool PermissaoVerComanda { get; set; }
    public bool PermissaoAdicionarBebidaComanda { get; set; }
    public bool PermissaoBuyInComanda { get; set; }
    public bool PermissaoRebuyComanda { get; set; }
    public bool PermissaoAddOnComanda { get; set; }
    public bool PermissaoFichasComanda { get; set; }
    public bool PermissaoRemoverItemComanda { get; set; }
    public bool PermissaoPagamentoParcialComanda { get; set; }
    public bool PermissaoFecharComanda { get; set; }

    // Seção Torneios
    public bool PermissaoTorneios { get; set; }
    public bool PermissaoCriarTorneio { get; set; }
    public bool PermissaoIniciarTorneio { get; set; }
    public bool PermissaoFinalizarTorneio { get; set; }
    public bool PermissaoExcluirTorneio { get; set; }

    // Seção Produtos
    public bool PermissaoProdutos { get; set; }
    public bool PermissaoCadastrarProduto { get; set; }
    public bool PermissaoAdicionarEstoque { get; set; }
    public bool PermissaoEditarProduto { get; set; }
    public bool PermissaoExcluirProduto { get; set; }

    // Seção Funcionários
    public bool PermissaoFuncionarios { get; set; }
    public bool PermissaoCriarFuncionario { get; set; }
    public bool PermissaoEditarFuncionario { get; set; }
    public bool PermissaoDesativarFuncionario { get; set; }

    // Seção Caixas
    public bool PermissaoCaixas { get; set; }
    public bool PermissaoAbrirCaixa { get; set; }
    public bool PermissaoVerCaixa { get; set; }
    public bool PermissaoNovaMovimentacaoCaixa { get; set; }
    public bool PermissaoCriarCategoriaCaixa { get; set; }
    public bool PermissaoFecharCaixa { get; set; }
    public bool PermissaoQuitarPendenciaCaixa { get; set; }

    // Seção Conferência
    public bool PermissaoConferencia { get; set; }
    public bool PermissaoNovaConferencia { get; set; }
    public bool PermissaoSalvarConferencia { get; set; }
    public bool PermissaoEditarConferencia { get; set; }
    public bool PermissaoExcluirConferencia { get; set; }

    // Seção Conteúdo
    public bool PermissaoConteudo { get; set; }
    public bool PermissaoNovaPostagem { get; set; }
    public bool PermissaoEditarPostagem { get; set; }
    public bool PermissaoPublicarPostagem { get; set; }
    public bool PermissaoExcluirPostagem { get; set; }
    public bool PermissaoNovoTorneioAgenda { get; set; }
    public bool PermissaoEditarTorneioAgenda { get; set; }
    public bool PermissaoExcluirTorneioAgenda { get; set; }

    public static IReadOnlyList<PropertyInfo> Todas { get; } =
        typeof(PermissoesBase).GetProperties().Where(p => p.PropertyType == typeof(bool)).ToArray();

    public void CopiarPermissoesDe(PermissoesBase origem)
    {
        foreach (var permissao in Todas)
            permissao.SetValue(this, permissao.GetValue(origem));
    }
}
