using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IPokerService
{
    Task<List<PlayerDto>> GetAllPlayersAsync();
    Task<PlayerDto?> GetPlayerByIdAsync(int id);
    Task<PlayerDto> CreatePlayerAsync(CreatePlayerDto createPlayerDto);
    Task<PlayerDto?> UpdatePlayerAsync(int id, UpdatePlayerDto updatePlayerDto);
    Task<bool> DeletePlayerAsync(int id);
    
    Task<List<GameDto>> GetAllGamesAsync();
    Task<GameDetailsDto?> GetGameByIdAsync(int id);
    Task<GameDto> CreateGameAsync(CreateGameDto createGameDto);
    Task<bool> JoinGameAsync(int gameId, int playerId);
}
