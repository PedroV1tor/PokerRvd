namespace PokerRvd.Api.Models;

public class Comanda
{
    public int Id { get; set; }
    public string JogadorNome { get; set; } = string.Empty;
    public string? JogadorFoto { get; set; }
    public string Mesa { get; set; } = string.Empty;
    public TipoComanda Tipo { get; set; }
    public int? TorneioId { get; set; }
    public string? TorneioNome { get; set; }
    public decimal ValorFichas { get; set; }
    public decimal ValorBebidas { get; set; }
    public decimal ValorTotal => ValorFichas + ValorBebidas;
    public StatusComanda Status { get; set; } = StatusComanda.ATIVO;
    public DateTime DataAbertura { get; set; } = DateTime.UtcNow;
    public DateTime? DataFechamento { get; set; }
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
    public int ProdutoId { get; set; }
    public Produto? Produto { get; set; }
    public int Quantidade { get; set; }
    public decimal ValorUnitario { get; set; }
    public decimal ValorTotal => Quantidade * ValorUnitario;
}

public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public CategoriaProduto Categoria { get; set; }
    public int Estoque { get; set; }
    public bool Ativo { get; set; } = true;
}

public enum CategoriaProduto
{
    BEBIDA,
    COMIDA,
    OUTROS
}
