using PokerRvd.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace PokerRvd.Api.DTOs;

public class ComandaDto
{
    public int Id { get; set; }
    public string JogadorNome { get; set; } = string.Empty;
    public string? JogadorFoto { get; set; }
    public string Mesa { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public int? TorneioId { get; set; }
    public string? TorneioNome { get; set; }
    public decimal ValorFichas { get; set; }
    public decimal ValorBebidas { get; set; }
    public decimal ValorTotal { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime DataAbertura { get; set; }
    public DateTime? DataFechamento { get; set; }
}

public class CreateComandaDto
{
    [Required(ErrorMessage = "Nome do jogador é obrigatório")]
    [MaxLength(100, ErrorMessage = "Nome do jogador deve ter no máximo 100 caracteres")]
    public string JogadorNome { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Mesa é obrigatória")]
    [MaxLength(50, ErrorMessage = "Mesa deve ter no máximo 50 caracteres")]
    public string Mesa { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Tipo é obrigatório")]
    public string Tipo { get; set; } = string.Empty;
    
    public int? TorneioId { get; set; }
    
    [MaxLength(200, ErrorMessage = "Nome do torneio deve ter no máximo 200 caracteres")]
    public string? TorneioNome { get; set; }
    
    public decimal? ValorFichas { get; set; }
}

public class UpdateComandaDto
{
    public decimal? ValorFichas { get; set; }
    public decimal? ValorBebidas { get; set; }
    public StatusComanda? Status { get; set; }
}

public class ComandaDetailsDto : ComandaDto
{
    public List<ItemComandaDto> Itens { get; set; } = new();
}

public class ItemComandaDto
{
    public int Id { get; set; }
    public int ProdutoId { get; set; }
    public string ProdutoNome { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal ValorUnitario { get; set; }
    public decimal ValorTotal { get; set; }
}

public class AddItemComandaDto
{
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
}

public class AddItemFichasDto
{
    [Required(ErrorMessage = "Nome do item de ficha é obrigatório")]
    [MaxLength(50, ErrorMessage = "Nome deve ter no máximo 50 caracteres")]
    public string Nome { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Valor é obrigatório")]
    [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "Valor deve ser maior que zero")]
    public decimal Valor { get; set; }
}

public class DashboardStatsDto
{
    public int ComandasAbertas { get; set; }
    public decimal TotalFichas { get; set; }
    public decimal TotalBebidas { get; set; }
    public decimal FaturamentoTotal { get; set; }
}

/// <summary>
/// Forma de pagamento e valor ao fechar a comanda
/// </summary>
public class FormaPagamentoValorDto
{
    public string FormaPagamento { get; set; } = string.Empty; // Dinheiro, PIX, Cartão Débito, Cartão Crédito, etc.
    public decimal Valor { get; set; }
}

/// <summary>
/// DTO para fechar comanda informando as formas de pagamento
/// </summary>
public class FecharComandaDto
{
    public List<FormaPagamentoValorDto> FormasPagamento { get; set; } = new();
}
