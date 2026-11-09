namespace PokerRvd.Api.Models;

public class Postagem
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Conteudo { get; set; } = string.Empty;
    public string? ImagemUrl { get; set; }
    public string Status { get; set; } = "RASCUNHO"; // RASCUNHO, PUBLICADO
    public DateTime? DataPublicacao { get; set; }
    public int? AutorId { get; set; }
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;
    public DateTime? DataAtualizacao { get; set; }
}
