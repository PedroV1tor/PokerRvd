using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IConferenciaService
{
    Task<List<ConferenciaDto>> GetAllAsync();
    Task<ConferenciaDto?> GetByIdAsync(int id);
    Task<ConferenciaDto> CreateAsync(CreateConferenciaDto dto);
    Task<ConferenciaDto?> UpdateAsync(int id, UpdateConferenciaDto dto);
    Task<bool> DeleteAsync(int id);
}
