namespace PokerRvd.Api.Models;

public class Game
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal BuyIn { get; set; }
    public int MaxPlayers { get; set; }
    public GameStatus Status { get; set; } = GameStatus.Waiting;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<Player> Players { get; set; } = new();
}

public enum GameStatus
{
    Waiting,
    InProgress,
    Completed,
    Cancelled
}
