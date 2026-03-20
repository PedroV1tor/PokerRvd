using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface ITorneioService
{
    Task<List<TorneioDto>> GetAllTorneiosAsync();
    Task<TorneioDto?> GetTorneioByIdAsync(int id);
    Task<TorneioDto> CreateTorneioAsync(CreateTorneioDto dto);
    Task<TorneioDto?> UpdateTorneioAsync(int id, UpdateTorneioDto dto);
    Task<bool> DeleteTorneioAsync(int id);
    Task<TorneioDto?> IniciarTorneioAsync(int id);
    Task<TorneioDto?> FinalizarTorneioAsync(int id);
    Task<TorneioDto?> CancelarTorneioAsync(int id);
    Task<TorneioStatsDto?> GetEstatisticasAsync(int id);
}
