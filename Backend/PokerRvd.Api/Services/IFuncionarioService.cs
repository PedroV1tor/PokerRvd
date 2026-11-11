using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IFuncionarioService
{
    Task<List<FuncionarioDto>> GetAllFuncionariosAsync();
    Task<FuncionarioDto?> GetFuncionarioByIdAsync(int id);
    Task<FuncionarioDto> CreateFuncionarioAsync(CreateFuncionarioDto dto);
    Task<FuncionarioDto?> UpdateFuncionarioAsync(int id, UpdateFuncionarioDto dto);
    Task<bool> DeleteFuncionarioAsync(int id);
    Task<string?> ValidarCriacaoAsync(int editorId, CreateFuncionarioDto dto);
    Task<string?> ValidarEdicaoAsync(int editorId, int alvoId, UpdateFuncionarioDto dto);
    Task<string?> ValidarDesativacaoAsync(int editorId, int alvoId);
    Task<bool> CpfExistsAsync(string cpf);
    Task<bool> EmailExistsAsync(string email);
}
