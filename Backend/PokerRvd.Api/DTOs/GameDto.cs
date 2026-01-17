using PokerRvd.Api.Models;

namespace PokerRvd.Api.DTOs;

public class GameDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal BuyIn { get; set; }
    public int MaxPlayers { get; set; }
    public string Status { get; set; } = string.Empty;
    public int CurrentPlayers { get; set; }
}

public class CreateGameDto
{
    public string Name { get; set; } = string.Empty;
    public decimal BuyIn { get; set; }
    public int MaxPlayers { get; set; } = 9;
}

public class GameDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal BuyIn { get; set; }
    public int MaxPlayers { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<PlayerDto> Players { get; set; } = new();
}
