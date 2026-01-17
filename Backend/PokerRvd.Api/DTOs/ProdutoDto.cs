namespace PokerRvd.Api.DTOs;

public class ProdutoDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal ValorCusto { get; set; }
    public decimal ValorComercial { get; set; }
    public int QuantidadeEstoque { get; set; }
    public string UnidadeVenda { get; set; } = string.Empty;
    public bool Ativo { get; set; }
    public DateTime DataCadastro { get; set; }
}

public class CreateProdutoDto
{
    public string Nome { get; set; } = string.Empty;
    public decimal ValorCusto { get; set; }
    public decimal ValorComercial { get; set; }
    public int QuantidadeEstoque { get; set; }
    public string UnidadeVenda { get; set; } = string.Empty;
}

public class UpdateProdutoDto
{
    public string Nome { get; set; } = string.Empty;
    public decimal ValorCusto { get; set; }
    public decimal ValorComercial { get; set; }
    public int QuantidadeEstoque { get; set; }
    public string UnidadeVenda { get; set; } = string.Empty;
    public bool Ativo { get; set; }
}
