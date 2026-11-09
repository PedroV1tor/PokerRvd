namespace PokerRvd.Api.DTOs;

public class PostagemDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Conteudo { get; set; } = string.Empty;
    public string? ImagemUrl { get; set; }
    public string Status { get; set; } = "RASCUNHO";
    public DateTime? DataPublicacao { get; set; }
    public DateTime DataCadastro { get; set; }
    public DateTime? DataAtualizacao { get; set; }
}

public class SalvarPostagemDto
{
    public string Titulo { get; set; } = string.Empty;
    public string Conteudo { get; set; } = string.Empty;
    public string? ImagemUrl { get; set; }
}

public class TorneioDoDiaDto
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
}

public class SalvarTorneioDoDiaDto
{
    public string Titulo { get; set; } = string.Empty;
    public string Modalidade { get; set; } = string.Empty;
    public DateTimeOffset Inicio { get; set; }
    public DateTimeOffset Fim { get; set; }
    public decimal? BuyIn { get; set; }
    public decimal? Garantido { get; set; }
    public string? Descricao { get; set; }
    public string? ImagemUrl { get; set; }
    public bool Publicado { get; set; }
    public int? TorneioId { get; set; }
}

// ==================== LANDING PAGE ====================
// Só os campos que podem aparecer no site. Não incluir dados financeiros ou operacionais.

public class PostagemPublicaDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Conteudo { get; set; } = string.Empty;
    public string? ImagemUrl { get; set; }
    public DateTime? DataPublicacao { get; set; }
}

public class TorneioDoDiaPublicoDto
{
    public string Titulo { get; set; } = string.Empty;
    public string Modalidade { get; set; } = string.Empty;
    public DateTime Inicio { get; set; }
    public DateTime Fim { get; set; }
    public decimal? BuyIn { get; set; }
    public decimal? Garantido { get; set; }
    public string? Descricao { get; set; }
    public string? ImagemUrl { get; set; }
}
