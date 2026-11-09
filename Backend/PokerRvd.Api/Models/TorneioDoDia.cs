namespace PokerRvd.Api.Models;

/// <summary>
/// Divulgação do torneio na landing page. É separado de Torneio (operacional/financeiro):
/// o início e o fim são informados por quem publica e definem até quando ele fica no site.
/// </summary>
public class TorneioDoDia
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Modalidade { get; set; } = string.Empty;
    public DateTime Inicio { get; set; }
    public DateTime Fim { get; set; }
    public decimal? BuyIn { get; set; }
    public decimal? Garantido { get; set; }
    public string? Descricao { get; set; }
    public string? ImagemUrl { get; set; }
    public bool Publicado { get; set; }
    public int? TorneioId { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    public DateTime? DataAtualizacao { get; set; }
}
