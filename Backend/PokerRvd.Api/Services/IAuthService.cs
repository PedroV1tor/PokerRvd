using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<UserDto?> GetUserByIdAsync(int id);
    Task<bool> EmailExistsAsync(string email);
}
