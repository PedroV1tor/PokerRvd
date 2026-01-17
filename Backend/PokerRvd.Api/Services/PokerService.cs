using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class PokerService : IPokerService
{
    private readonly PokerDbContext _context;

    public PokerService(PokerDbContext context)
    {
        _context = context;
    }

    // Player methods
    public async Task<List<PlayerDto>> GetAllPlayersAsync()
    {
        return await _context.Players
            .Where(p => p.IsActive)
            .Select(p => new PlayerDto
            {
                Id = p.Id,
                Name = p.Name,
                Email = p.Email,
                Balance = p.Balance,
                IsActive = p.IsActive
            })
            .ToListAsync();
    }

    public async Task<PlayerDto?> GetPlayerByIdAsync(int id)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null) return null;

        return new PlayerDto
        {
            Id = player.Id,
            Name = player.Name,
            Email = player.Email,
            Balance = player.Balance,
            IsActive = player.IsActive
        };
    }

    public async Task<PlayerDto> CreatePlayerAsync(CreatePlayerDto createPlayerDto)
    {
        var player = new Player
        {
            Name = createPlayerDto.Name,
            Email = createPlayerDto.Email,
            Balance = createPlayerDto.InitialBalance,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _context.Players.Add(player);
        await _context.SaveChangesAsync();

        return new PlayerDto
        {
            Id = player.Id,
            Name = player.Name,
            Email = player.Email,
            Balance = player.Balance,
            IsActive = player.IsActive
        };
    }

    public async Task<PlayerDto?> UpdatePlayerAsync(int id, UpdatePlayerDto updatePlayerDto)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null) return null;

        if (updatePlayerDto.Name != null) player.Name = updatePlayerDto.Name;
        if (updatePlayerDto.Balance.HasValue) player.Balance = updatePlayerDto.Balance.Value;
        if (updatePlayerDto.IsActive.HasValue) player.IsActive = updatePlayerDto.IsActive.Value;

        await _context.SaveChangesAsync();

        return new PlayerDto
        {
            Id = player.Id,
            Name = player.Name,
            Email = player.Email,
            Balance = player.Balance,
            IsActive = player.IsActive
        };
    }

    public async Task<bool> DeletePlayerAsync(int id)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null) return false;

        player.IsActive = false;
        await _context.SaveChangesAsync();
        return true;
    }

    // Game methods
    public async Task<List<GameDto>> GetAllGamesAsync()
    {
        return await _context.Games
            .Include(g => g.Players)
            .Select(g => new GameDto
            {
                Id = g.Id,
                Name = g.Name,
                BuyIn = g.BuyIn,
                MaxPlayers = g.MaxPlayers,
                Status = g.Status.ToString(),
                CurrentPlayers = g.Players.Count
            })
            .ToListAsync();
    }

    public async Task<GameDetailsDto?> GetGameByIdAsync(int id)
    {
        var game = await _context.Games
            .Include(g => g.Players)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (game == null) return null;

        return new GameDetailsDto
        {
            Id = game.Id,
            Name = game.Name,
            BuyIn = game.BuyIn,
            MaxPlayers = game.MaxPlayers,
            Status = game.Status.ToString(),
            Players = game.Players.Select(p => new PlayerDto
            {
                Id = p.Id,
                Name = p.Name,
                Email = p.Email,
                Balance = p.Balance,
                IsActive = p.IsActive
            }).ToList()
        };
    }

    public async Task<GameDto> CreateGameAsync(CreateGameDto createGameDto)
    {
        var game = new Game
        {
            Name = createGameDto.Name,
            BuyIn = createGameDto.BuyIn,
            MaxPlayers = createGameDto.MaxPlayers,
            Status = GameStatus.Waiting,
            CreatedAt = DateTime.UtcNow
        };

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        return new GameDto
        {
            Id = game.Id,
            Name = game.Name,
            BuyIn = game.BuyIn,
            MaxPlayers = game.MaxPlayers,
            Status = game.Status.ToString(),
            CurrentPlayers = 0
        };
    }

    public async Task<bool> JoinGameAsync(int gameId, int playerId)
    {
        var game = await _context.Games
            .Include(g => g.Players)
            .FirstOrDefaultAsync(g => g.Id == gameId);

        if (game == null) return false;
        if (game.Players.Count >= game.MaxPlayers) return false;

        var player = await _context.Players.FindAsync(playerId);
        if (player == null || !player.IsActive) return false;

        if (player.Balance < game.BuyIn) return false;

        game.Players.Add(player);
        player.Balance -= game.BuyIn;

        await _context.SaveChangesAsync();
        return true;
    }
}
