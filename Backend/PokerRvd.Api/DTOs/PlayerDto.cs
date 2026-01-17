namespace PokerRvd.Api.DTOs;

public class PlayerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

public class CreatePlayerDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal InitialBalance { get; set; } = 1000m;
}

public class UpdatePlayerDto
{
    public string? Name { get; set; }
    public decimal? Balance { get; set; }
    public bool? IsActive { get; set; }
}
