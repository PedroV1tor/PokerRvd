namespace PokerRvd.Api.Models;

public class Torneio
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public decimal ValorBuyIn { get; set; }
    public decimal ValorRebuySimples { get; set; }
    public decimal ValorRebuyDuplo { get; set; }
    public decimal ValorRebuyTriplo { get; set; }
    public decimal ValorAddOn { get; set; }
    public decimal ValorAddOnDuplo { get; set; }
    public decimal ValorBuyIn2 { get; set; }
    public string Status { get; set; } = "AGUARDANDO"; // AGUARDANDO, EM_ANDAMENTO, FINALIZADO, CANCELADO
    public DateTime? DataInicio { get; set; }
    public DateTime? DataFim { get; set; }
    public int Participantes { get; set; }
    public decimal PremioTotal { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
}
