namespace PokerRvd.Api.Models;

public class ConferenciaCaixa
{
    public int Id { get; set; }
    public DateTime Dia { get; set; }

    // Entradas
    public decimal Rake { get; set; }
    public decimal Caixinhas { get; set; }

    // Saídas
    public decimal Bonus { get; set; }
    public decimal Defesas { get; set; }
    public decimal DespesasPagas { get; set; }
    public decimal Percas { get; set; }

    // Créditos
    public decimal PgtoCartao { get; set; }
    public decimal AReceber { get; set; }
    public decimal SaldoConta { get; set; }

    public string? Observacao { get; set; }

    // Campos calculados (não persistidos no banco)
    public decimal SaldoDia => (Rake + Caixinhas) - Bonus - Defesas - DespesasPagas - Percas;
    public decimal TotalCreditos => PgtoCartao + AReceber + SaldoConta;
    public decimal Diferenca => TotalCreditos - SaldoDia;
}
