using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IComandaService
{
    Task<List<ComandaDto>> GetAllComandasAsync();
    Task<ComandaDetailsDto?> GetComandaByIdAsync(int id);
    Task<ComandaDto> CreateComandaAsync(CreateComandaDto createComandaDto);
    Task<ComandaDto?> UpdateComandaAsync(int id, UpdateComandaDto updateComandaDto);
    Task<ComandaDto?> FecharComandaAsync(int id);
    Task<bool> DeleteComandaAsync(int id);
    Task<bool> AddItemToComandaAsync(int comandaId, AddItemComandaDto addItemDto);
    Task<bool> AddItemFichasAsync(int comandaId, AddItemFichasDto addItemDto);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
}
