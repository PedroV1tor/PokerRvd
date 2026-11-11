using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class ConteudoService : IConteudoService
{
    private const string Rascunho = "RASCUNHO";
    private const string Publicado = "PUBLICADO";
    private const int DiasAgenda = 7;
    private const int LimiteAgenda = 30;

    private readonly PokerDbContext _context;

    public ConteudoService(PokerDbContext context)
    {
        _context = context;
    }

    // ==================== POSTAGENS ====================

    public async Task<List<PostagemDto>> GetPostagensAsync()
    {
        var postagens = await _context.Postagens
            .AsNoTracking()
            .OrderByDescending(p => p.DataCadastro)
            .ToListAsync();

        return postagens.Select(MapToDto).ToList();
    }

    public async Task<PostagemDto> CreatePostagemAsync(SalvarPostagemDto dto, int? autorId)
    {
        var postagem = new Postagem
        {
            Titulo = dto.Titulo.Trim(),
            Conteudo = dto.Conteudo.Trim(),
            ImagemUrl = Limpar(dto.ImagemUrl),
            Status = Rascunho,
            AutorId = autorId,
            DataCadastro = DateTime.UtcNow
        };

        _context.Postagens.Add(postagem);
        await _context.SaveChangesAsync();
        return MapToDto(postagem);
    }

    public async Task<PostagemDto?> UpdatePostagemAsync(int id, SalvarPostagemDto dto)
    {
        var postagem = await _context.Postagens.FindAsync(id);
        if (postagem == null) return null;

        postagem.Titulo = dto.Titulo.Trim();
        postagem.Conteudo = dto.Conteudo.Trim();
        postagem.ImagemUrl = Limpar(dto.ImagemUrl);
        postagem.DataAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(postagem);
    }

    public async Task<bool> DeletePostagemAsync(int id)
    {
        var postagem = await _context.Postagens.FindAsync(id);
        if (postagem == null) return false;

        _context.Postagens.Remove(postagem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<PostagemDto?> PublicarPostagemAsync(int id)
    {
        var postagem = await _context.Postagens.FindAsync(id);
        if (postagem == null) return null;

        postagem.Status = Publicado;
        postagem.DataPublicacao ??= DateTime.UtcNow;
        postagem.DataAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(postagem);
    }

    public async Task<PostagemDto?> DespublicarPostagemAsync(int id)
    {
        var postagem = await _context.Postagens.FindAsync(id);
        if (postagem == null) return null;

        postagem.Status = Rascunho;
        postagem.DataAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(postagem);
    }

    // ==================== TORNEIO DO DIA ====================

    public async Task<List<TorneioDoDiaDto>> GetTorneiosDoDiaAsync()
    {
        var torneios = await _context.TorneiosDoDia
            .AsNoTracking()
            .OrderByDescending(t => t.Inicio)
            .ToListAsync();

        return torneios.Select(MapToDto).ToList();
    }

    public async Task<TorneioDoDiaDto> CreateTorneioDoDiaAsync(SalvarTorneioDoDiaDto dto)
    {
        var torneio = new TorneioDoDia { DataCadastro = DateTime.UtcNow };
        Aplicar(torneio, dto);

        _context.TorneiosDoDia.Add(torneio);
        await _context.SaveChangesAsync();
        return MapToDto(torneio);
    }

    public async Task<TorneioDoDiaDto?> UpdateTorneioDoDiaAsync(int id, SalvarTorneioDoDiaDto dto)
    {
        var torneio = await _context.TorneiosDoDia.FindAsync(id);
        if (torneio == null) return null;

        Aplicar(torneio, dto);
        torneio.DataAtualizacao = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(torneio);
    }

    public async Task<bool> DeleteTorneioDoDiaAsync(int id)
    {
        var torneio = await _context.TorneiosDoDia.FindAsync(id);
        if (torneio == null) return false;

        _context.TorneiosDoDia.Remove(torneio);
        await _context.SaveChangesAsync();
        return true;
    }

    // ==================== LANDING PAGE ====================

    public async Task<List<PostagemPublicaDto>> GetPostagensPublicasAsync(int limite)
    {
        return await _context.Postagens
            .AsNoTracking()
            .Where(p => p.Status == Publicado)
            .OrderByDescending(p => p.DataPublicacao)
            .Take(limite)
            .Select(p => new PostagemPublicaDto
            {
                Id = p.Id,
                Titulo = p.Titulo,
                Conteudo = p.Conteudo,
                ImagemUrl = p.ImagemUrl,
                DataPublicacao = p.DataPublicacao
            })
            .ToListAsync();
    }

    public async Task<List<TorneioDoDiaPublicoDto>> GetAgendaPublicaAsync()
    {
        var agora = DateTime.UtcNow;
        var limite = agora.AddDays(DiasAgenda);

        // O torneio sai do site sozinho quando passa do fim informado por quem publicou
        return await _context.TorneiosDoDia
            .AsNoTracking()
            .Where(t => t.Publicado && t.Fim > agora && t.Inicio < limite)
            .OrderBy(t => t.Inicio)
            .Take(LimiteAgenda)
            .Select(t => new TorneioDoDiaPublicoDto
            {
                Id = t.Id,
                Titulo = t.Titulo,
                Modalidade = t.Modalidade,
                Inicio = t.Inicio,
                Fim = t.Fim,
                BuyIn = t.BuyIn,
                Garantido = t.Garantido,
                Descricao = t.Descricao,
                ImagemUrl = t.ImagemUrl
            })
            .ToListAsync();
    }

    // ==================== HELPERS ====================

    private static string? Limpar(string? valor) =>
        string.IsNullOrWhiteSpace(valor) ? null : valor.Trim();

    private static void Aplicar(TorneioDoDia torneio, SalvarTorneioDoDiaDto dto)
    {
        torneio.Titulo = dto.Titulo.Trim();
        torneio.Modalidade = dto.Modalidade.Trim();
        torneio.Inicio = dto.Inicio.UtcDateTime;
        torneio.Fim = dto.Fim.UtcDateTime;
        torneio.BuyIn = dto.BuyIn;
        torneio.Garantido = dto.Garantido;
        torneio.Descricao = Limpar(dto.Descricao);
        torneio.ImagemUrl = Limpar(dto.ImagemUrl);
        torneio.Publicado = dto.Publicado;
        torneio.TorneioId = dto.TorneioId;
    }

    private static PostagemDto MapToDto(Postagem p) => new()
    {
        Id = p.Id,
        Titulo = p.Titulo,
        Conteudo = p.Conteudo,
        ImagemUrl = p.ImagemUrl,
        Status = p.Status,
        DataPublicacao = p.DataPublicacao,
        DataCadastro = p.DataCadastro,
        DataAtualizacao = p.DataAtualizacao
    };

    private static TorneioDoDiaDto MapToDto(TorneioDoDia t) => new()
    {
        Id = t.Id,
        Titulo = t.Titulo,
        Modalidade = t.Modalidade,
        Inicio = t.Inicio,
        Fim = t.Fim,
        BuyIn = t.BuyIn,
        Garantido = t.Garantido,
        Descricao = t.Descricao,
        ImagemUrl = t.ImagemUrl,
        Publicado = t.Publicado,
        TorneioId = t.TorneioId
    };
}
