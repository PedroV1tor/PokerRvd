using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IConteudoService
{
    Task<List<PostagemDto>> GetPostagensAsync();
    Task<PostagemDto> CreatePostagemAsync(SalvarPostagemDto dto, int? autorId);
    Task<PostagemDto?> UpdatePostagemAsync(int id, SalvarPostagemDto dto);
    Task<bool> DeletePostagemAsync(int id);
    Task<PostagemDto?> PublicarPostagemAsync(int id);
    Task<PostagemDto?> DespublicarPostagemAsync(int id);

    Task<List<TorneioDoDiaDto>> GetTorneiosDoDiaAsync();
    Task<TorneioDoDiaDto> CreateTorneioDoDiaAsync(SalvarTorneioDoDiaDto dto);
    Task<TorneioDoDiaDto?> UpdateTorneioDoDiaAsync(int id, SalvarTorneioDoDiaDto dto);
    Task<bool> DeleteTorneioDoDiaAsync(int id);

    Task<List<PostagemPublicaDto>> GetPostagensPublicasAsync(int limite);
    Task<TorneioDoDiaPublicoDto?> GetTorneioDoDiaPublicoAsync();
}
