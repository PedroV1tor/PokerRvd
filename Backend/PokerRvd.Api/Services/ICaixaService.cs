using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface ICaixaService
{
    Task<List<CaixaDto>> GetAllCaixasAsync();
    Task<CaixaDetailsDto?> GetCaixaByIdAsync(int id);
    Task<CaixaDto?> GetCaixaAbertoAsync();
    Task<CaixaDto> AbrirCaixaAsync(CreateCaixaDto dto, string usuarioNome);
    Task<CaixaDto?> FecharCaixaAsync(int id, FecharCaixaDto dto, string usuarioNome);
    Task<bool> AddMovimentacaoAsync(int caixaId, CreateMovimentacaoDto dto, string usuarioNome);
}
