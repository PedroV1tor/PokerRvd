namespace PokerRvd.Api.Models;

public class Comanda
{
    public int Id { get; set; }
    public string JogadorNome { get; set; } = string.Empty;
    public string? JogadorFoto { get; set; }
    public string? Mesa { get; set; }
    public TipoComanda Tipo { get; set; }
    public int? TorneioId { get; set; }
    public string? TorneioNome { get; set; }
    public decimal ValorFichas { get; set; }
    public decimal ValorBebidas { get; set; }
    public decimal ValorTotal => ValorFichas + ValorBebidas;
    /// <summary>Soma de todos os pagamentos parciais já registrados nesta comanda.</summary>
    public decimal ValorPago { get; set; }
    /// <summary>Valor ainda em aberto: Total - Pago. Calculado, não persistido.</summary>
    public decimal ValorRestante => ValorTotal - ValorPago;
    public StatusComanda Status { get; set; } = StatusComanda.ATIVO;
    public DateTime DataAbertura { get; set; } = DateTime.UtcNow;
    public DateTime? DataFechamento { get; set; }
    /// <summary>Caixa em que a comanda foi criada (pendente fica vinculada a esse caixa ao fechá-lo)</summary>
    public int? CaixaId { get; set; }
    public List<ItemComanda> Itens { get; set; } = new();
}

public enum StatusComanda
{
    ATIVO,
    FECHADO
}

public enum TipoComanda
{
    TORNEIO,
    CASH,
    BAR
}

public class ItemComanda
{
    public int Id { get; set; }
    public int ComandaId { get; set; }
    public Comanda? Comanda { get; set; }
    public int? ProdutoId { get; set; } // Nullable para itens de fichas
    public Produto? Produto { get; set; }
    public string? NomeCustomizado { get; set; } // Para itens de fichas (Buy-in, Re-buy, etc)
    public int Quantidade { get; set; }
    public decimal ValorUnitario { get; set; }
    public decimal ValorTotal => Quantidade * ValorUnitario;
}
