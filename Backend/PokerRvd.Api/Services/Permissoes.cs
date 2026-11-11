using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

/// <summary>
/// Regras das políticas de autorização. O nome de cada política é o nome da propriedade em PermissoesBase;
/// as constantes abaixo são regras especiais, para telas de uma seção que leem dados de outra.
/// ADMIN passa em todas as regras e nenhum outro cargo tem acesso implícito.
/// </summary>
public static class Permissoes
{
    public const string Admin = "Admin";
    public const string LerComandas = "LerComandas";
    public const string LerCaixaAberto = "LerCaixaAberto";
    public const string LerTorneios = "LerTorneios";
    public const string LerTorneioDaComanda = "LerTorneioDaComanda";
    public const string LerProdutos = "LerProdutos";
    public const string FecharOuQuitarComanda = "FecharOuQuitarComanda";
    public const string EnviarImagem = "EnviarImagem";

    private static readonly Dictionary<string, string[]> Secoes = new()
    {
        [nameof(Usuario.PermissaoComandas)] = new[]
        {
            nameof(Usuario.PermissaoCriarComanda), nameof(Usuario.PermissaoAlterarStatusComanda),
            nameof(Usuario.PermissaoVerComanda), nameof(Usuario.PermissaoAdicionarBebidaComanda),
            nameof(Usuario.PermissaoBuyInComanda), nameof(Usuario.PermissaoRebuyComanda),
            nameof(Usuario.PermissaoAddOnComanda), nameof(Usuario.PermissaoFichasComanda),
            nameof(Usuario.PermissaoRemoverItemComanda), nameof(Usuario.PermissaoPagamentoParcialComanda),
            nameof(Usuario.PermissaoFecharComanda)
        },
        [nameof(Usuario.PermissaoTorneios)] = new[]
        {
            nameof(Usuario.PermissaoCriarTorneio), nameof(Usuario.PermissaoIniciarTorneio),
            nameof(Usuario.PermissaoFinalizarTorneio), nameof(Usuario.PermissaoExcluirTorneio)
        },
        [nameof(Usuario.PermissaoProdutos)] = new[]
        {
            nameof(Usuario.PermissaoCadastrarProduto), nameof(Usuario.PermissaoAdicionarEstoque),
            nameof(Usuario.PermissaoEditarProduto), nameof(Usuario.PermissaoExcluirProduto)
        },
        [nameof(Usuario.PermissaoFuncionarios)] = new[]
        {
            nameof(Usuario.PermissaoCriarFuncionario), nameof(Usuario.PermissaoEditarFuncionario),
            nameof(Usuario.PermissaoDesativarFuncionario)
        },
        [nameof(Usuario.PermissaoCaixas)] = new[]
        {
            nameof(Usuario.PermissaoAbrirCaixa), nameof(Usuario.PermissaoVerCaixa),
            nameof(Usuario.PermissaoNovaMovimentacaoCaixa), nameof(Usuario.PermissaoCriarCategoriaCaixa),
            nameof(Usuario.PermissaoFecharCaixa), nameof(Usuario.PermissaoQuitarPendenciaCaixa)
        },
        [nameof(Usuario.PermissaoConferencia)] = new[]
        {
            nameof(Usuario.PermissaoNovaConferencia), nameof(Usuario.PermissaoSalvarConferencia),
            nameof(Usuario.PermissaoEditarConferencia), nameof(Usuario.PermissaoExcluirConferencia)
        },
        [nameof(Usuario.PermissaoConteudo)] = new[]
        {
            nameof(Usuario.PermissaoNovaPostagem), nameof(Usuario.PermissaoEditarPostagem),
            nameof(Usuario.PermissaoPublicarPostagem), nameof(Usuario.PermissaoExcluirPostagem),
            nameof(Usuario.PermissaoNovoTorneioAgenda), nameof(Usuario.PermissaoEditarTorneioAgenda),
            nameof(Usuario.PermissaoExcluirTorneioAgenda)
        }
    };

    // Nome gravado no item pelos botões da tela da comanda
    private static readonly Dictionary<string, string> PoliticaPorFicha = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Buy-in"] = nameof(Usuario.PermissaoBuyInComanda),
        ["Buy-in 2"] = nameof(Usuario.PermissaoBuyInComanda),
        ["Re-buy Simples"] = nameof(Usuario.PermissaoRebuyComanda),
        ["Re-buy Duplo"] = nameof(Usuario.PermissaoRebuyComanda),
        ["Re-buy Triplo"] = nameof(Usuario.PermissaoRebuyComanda),
        ["Add-on"] = nameof(Usuario.PermissaoAddOnComanda),
        ["Add-on Duplo"] = nameof(Usuario.PermissaoAddOnComanda)
    };

    public static IReadOnlyDictionary<string, Func<Usuario, bool>> Regras { get; } = MontarRegras();

    /// <summary>Botão responsável por este item de fichas. Nome livre vem do botão Fichas.</summary>
    public static string PoliticaDaFicha(string? nome) =>
        PoliticaPorFicha.GetValueOrDefault(nome?.Trim() ?? string.Empty, nameof(Usuario.PermissaoFichasComanda));

    public static bool Permite(Usuario usuario, Func<Usuario, bool> regra) =>
        usuario.Ativo && (usuario.Role == UserRole.ADMIN || regra(usuario));

    private static Dictionary<string, Func<Usuario, bool>> MontarRegras()
    {
        var regras = new Dictionary<string, Func<Usuario, bool>>();

        foreach (var (secao, acoes) in Secoes)
        {
            var temSecao = Ler(secao);
            regras[secao] = temSecao;
            foreach (var acao in acoes)
            {
                var temAcao = Ler(acao);
                regras[acao] = u => temSecao(u) && temAcao(u);
            }
        }

        bool Tem(Usuario u, string politica) => regras[politica](u);

        regras[Admin] = _ => false;
        regras[LerComandas] = u => Tem(u, nameof(Usuario.PermissaoComandas)) || Tem(u, nameof(Usuario.PermissaoVerCaixa));
        regras[LerCaixaAberto] = u => Tem(u, nameof(Usuario.PermissaoComandas)) || Tem(u, nameof(Usuario.PermissaoCaixas));
        regras[LerTorneios] = u => Tem(u, nameof(Usuario.PermissaoTorneios)) || Tem(u, nameof(Usuario.PermissaoComandas))
            || Tem(u, nameof(Usuario.PermissaoVerCaixa)) || Tem(u, nameof(Usuario.PermissaoConteudo));
        regras[LerTorneioDaComanda] = u => Tem(u, nameof(Usuario.PermissaoTorneios)) || Tem(u, nameof(Usuario.PermissaoVerComanda));
        regras[LerProdutos] = u => Tem(u, nameof(Usuario.PermissaoProdutos)) || Tem(u, nameof(Usuario.PermissaoComandas));
        regras[FecharOuQuitarComanda] = u => Tem(u, nameof(Usuario.PermissaoFecharComanda)) || Tem(u, nameof(Usuario.PermissaoQuitarPendenciaCaixa));
        regras[EnviarImagem] = u => Tem(u, nameof(Usuario.PermissaoNovaPostagem)) || Tem(u, nameof(Usuario.PermissaoEditarPostagem))
            || Tem(u, nameof(Usuario.PermissaoNovoTorneioAgenda)) || Tem(u, nameof(Usuario.PermissaoEditarTorneioAgenda));

        return regras;
    }

    private static Func<Usuario, bool> Ler(string propriedade)
    {
        var info = typeof(PermissoesBase).GetProperty(propriedade)
            ?? throw new InvalidOperationException($"Permissão inexistente: {propriedade}");
        return u => (bool)info.GetValue(u)!;
    }
}
