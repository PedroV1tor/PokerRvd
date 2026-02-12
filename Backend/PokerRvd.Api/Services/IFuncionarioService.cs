using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IFuncionarioService
{
    Task<List<FuncionarioDto>> GetAllFuncionariosAsync();
    Task<FuncionarioDto?> GetFuncionarioByIdAsync(int id);
    Task<FuncionarioDto> CreateFuncionarioAsync(CreateFuncionarioDto dto);
    Task<FuncionarioDto?> UpdateFuncionarioAsync(int id, UpdateFuncionarioDto dto);
    Task<bool> DeleteFuncionarioAsync(int id);
    Task<bool> CpfExistsAsync(string cpf);
    Task<bool> EmailExistsAsync(string email);
}
