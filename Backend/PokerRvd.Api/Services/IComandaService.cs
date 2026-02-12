using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IComandaService
{
    Task<List<ComandaDto>> GetAllComandasAsync(int? caixaId = null);
    Task<ComandaDetailsDto?> GetComandaByIdAsync(int id);
    Task<ComandaDto> CreateComandaAsync(CreateComandaDto createComandaDto);
    Task<ComandaDto?> UpdateComandaAsync(int id, UpdateComandaDto updateComandaDto);
    Task<ComandaDto?> FecharComandaAsync(int id, FecharComandaDto? fecharComandaDto = null);
    Task<bool> DeleteComandaAsync(int id);
    Task<bool> AddItemToComandaAsync(int comandaId, AddItemComandaDto addItemDto);
    Task<bool> AddItemFichasAsync(int comandaId, AddItemFichasDto addItemDto);
    Task<DashboardStatsDto> GetDashboardStatsAsync(int? caixaId = null);
}
