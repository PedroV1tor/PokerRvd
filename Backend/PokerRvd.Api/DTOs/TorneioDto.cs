namespace PokerRvd.Api.DTOs;

public class TorneioStatsDto
{
    public int TorneioId { get; set; }
    public string TorneioNome { get; set; } = string.Empty;
    public int TotalJogadores { get; set; }

    public int QtdBuyIn { get; set; }
    public decimal ValorTotalBuyIn { get; set; }

    public int QtdRebuySimples { get; set; }
    public decimal ValorTotalRebuySimples { get; set; }

    public int QtdRebuyDuplo { get; set; }
    public decimal ValorTotalRebuyDuplo { get; set; }

    public int QtdAddOn { get; set; }
    public decimal ValorTotalAddOn { get; set; }

    public decimal TotalArrecadado { get; set; }
    public decimal TotalBebidas { get; set; }
    public decimal TotalPremiacao { get; set; }
}

public class TorneioDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal ValorBuyIn { get; set; }
    public decimal ValorRebuySimples { get; set; }
    public decimal ValorRebuyDuplo { get; set; }
    public decimal ValorAddOn { get; set; }
    public string Status { get; set; } = "AGUARDANDO";
    public DateTime? DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public int Participantes { get; set; }
    public decimal PremioTotal { get; set; }
}

public class CreateTorneioDto
{
    public string Nome { get; set; } = string.Empty;
    public decimal ValorBuyIn { get; set; }
    public decimal ValorRebuySimples { get; set; }
    public decimal ValorRebuyDuplo { get; set; }
    public decimal ValorAddOn { get; set; }
}

public class UpdateTorneioDto
{
    public string? Nome { get; set; }
    public decimal? ValorBuyIn { get; set; }
    public decimal? ValorRebuySimples { get; set; }
    public decimal? ValorRebuyDuplo { get; set; }
    public decimal? ValorAddOn { get; set; }
    public string? Status { get; set; }
}
