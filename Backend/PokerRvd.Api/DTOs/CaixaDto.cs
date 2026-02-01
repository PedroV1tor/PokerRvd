namespace PokerRvd.Api.DTOs;

public class CaixaDto
{
    public int Id { get; set; }
    public DateTime DataAbertura { get; set; }
    public DateTime? DataFechamento { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal SaldoInicial { get; set; }
    public decimal? SaldoFinal { get; set; }
    public decimal TotalEntradas { get; set; }
    public decimal TotalSaidas { get; set; }
    public string UsuarioAbertura { get; set; } = string.Empty;
    public string? UsuarioFechamento { get; set; }
    public string? ObservacoesAbertura { get; set; }
    public string? ObservacoesFechamento { get; set; }
}

public class CaixaDetailsDto : CaixaDto
{
    public List<MovimentacaoCaixaDto> Movimentacoes { get; set; } = new();
}

public class MovimentacaoCaixaDto
{
    public int Id { get; set; }
    public int CaixaId { get; set; }
    public DateTime DataHora { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public int? ComandaId { get; set; }
    public string? ComandaNome { get; set; }
    public string? FormaPagamento { get; set; }
    public string UsuarioNome { get; set; } = string.Empty;
}

public class CreateCaixaDto
{
    public decimal SaldoInicial { get; set; }
    public string? ObservacoesAbertura { get; set; }
}

public class FecharCaixaDto
{
    public decimal SaldoFinal { get; set; }
    public string? ObservacoesFechamento { get; set; }
}

public class CreateMovimentacaoDto
{
    public string Tipo { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public int? ComandaId { get; set; }
}
