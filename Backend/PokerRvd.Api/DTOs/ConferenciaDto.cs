namespace PokerRvd.Api.DTOs;

public class ConferenciaDto
{
    public int Id { get; set; }
    public DateTime Dia { get; set; }
    public decimal Rake { get; set; }
    public decimal Caixinhas { get; set; }
    public decimal Bonus { get; set; }
    public decimal Defesas { get; set; }
    public decimal DespesasPagas { get; set; }
    public decimal Percas { get; set; }
    public decimal SaldoDia { get; set; }
    public decimal PgtoCartao { get; set; }
    public decimal AReceber { get; set; }
    public decimal SaldoConta { get; set; }
    public decimal TotalCreditos { get; set; }
    public decimal Diferenca { get; set; }
    public string? Observacao { get; set; }
}

public class CreateConferenciaDto
{
    public DateTime Dia { get; set; }
    public decimal Rake { get; set; }
    public decimal Caixinhas { get; set; }
    public decimal Bonus { get; set; }
    public decimal Defesas { get; set; }
    public decimal DespesasPagas { get; set; }
    public decimal Percas { get; set; }
    public decimal PgtoCartao { get; set; }
    public decimal AReceber { get; set; }
    public decimal SaldoConta { get; set; }
    public string? Observacao { get; set; }
}

public class UpdateConferenciaDto
{
    public DateTime? Dia { get; set; }
    public decimal? Rake { get; set; }
    public decimal? Caixinhas { get; set; }
    public decimal? Bonus { get; set; }
    public decimal? Defesas { get; set; }
    public decimal? DespesasPagas { get; set; }
    public decimal? Percas { get; set; }
    public decimal? PgtoCartao { get; set; }
    public decimal? AReceber { get; set; }
    public decimal? SaldoConta { get; set; }
    public string? Observacao { get; set; }
}
