namespace PokerRvd.Api.Models;

public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal ValorCusto { get; set; }
    public decimal ValorComercial { get; set; }
    public int QuantidadeEstoque { get; set; }
    public string UnidadeVenda { get; set; } = string.Empty; // Ex: "Unidade", "Caixa", "Litro", etc.
    public bool Ativo { get; set; } = true;
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
}
