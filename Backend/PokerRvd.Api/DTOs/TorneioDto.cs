namespace PokerRvd.Api.DTOs;

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
