namespace PokerRvd.Api.Models;

public class Caixa
{
    public int Id { get; set; }
    public DateTime DataAbertura { get; set; }
    public DateTime? DataFechamento { get; set; }
    public string Status { get; set; } = "ABERTO"; // ABERTO, FECHADO
    public decimal SaldoInicial { get; set; }
    public decimal? SaldoFinal { get; set; }
    public decimal TotalEntradas { get; set; }
    public decimal TotalSaidas { get; set; }
    public string UsuarioAbertura { get; set; } = string.Empty;
    public string? UsuarioFechamento { get; set; }
    public string? ObservacoesAbertura { get; set; }
    public string? ObservacoesFechamento { get; set; }
    
    // Navegação
    public ICollection<MovimentacaoCaixa> Movimentacoes { get; set; } = new List<MovimentacaoCaixa>();
}

public class MovimentacaoCaixa
{
    public int Id { get; set; }
    public int CaixaId { get; set; }
    public DateTime DataHora { get; set; }
    public string Tipo { get; set; } = string.Empty; // ENTRADA, SAIDA
    public string Categoria { get; set; } = string.Empty; // Fichas, Bebidas, Despesas, etc
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public int? ComandaId { get; set; }
    public string? ComandaNome { get; set; }
    public string? FormaPagamento { get; set; } // Dinheiro, PIX, Cartão Débito, Cartão Crédito, etc.
    public string UsuarioNome { get; set; } = string.Empty;
    
    // Navegação
    public Caixa Caixa { get; set; } = null!;
}
