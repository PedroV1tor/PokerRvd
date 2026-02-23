using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly IWebHostEnvironment _env;

    public AuthController(IAuthService authService, ILogger<AuthController> logger, IWebHostEnvironment env)
    {
        _authService = authService;
        _logger = logger;
        _env = env;
    }

    /// <summary>
    /// Realiza login do usuário
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (request == null)
                return BadRequest(new AuthResponse { Message = "Dados de login não informados." });

            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new AuthResponse { Message = "E-mail é obrigatório." });

            if (string.IsNullOrWhiteSpace(request.Senha))
                return BadRequest(new AuthResponse { Message = "Senha é obrigatória." });

            var response = await _authService.LoginAsync(request);

            if (response.User == null)
                return Unauthorized(response);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fazer login");
            var message = _env.IsDevelopment() ? ex.Message : "Erro interno do servidor";
            return StatusCode(500, new AuthResponse
            {
                Message = message
            });
        }
    }

    /// <summary>
    /// Registra um novo usuário
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _authService.RegisterAsync(request);

            if (response.User == null)
                return BadRequest(response);

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao registrar usuário");
            return StatusCode(500, new AuthResponse 
            { 
                Message = "Erro interno do servidor" 
            });
        }
    }

    /// <summary>
    /// Verifica se um email já está cadastrado
    /// </summary>
    [HttpGet("check-email/{email}")]
    public async Task<ActionResult<bool>> CheckEmail(string email)
    {
        try
        {
            var exists = await _authService.EmailExistsAsync(email);
            return Ok(new { exists });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar email");
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém informações do usuário logado
    /// </summary>
    [HttpGet("me/{id}")]
    public async Task<ActionResult<UserDto>> GetMe(int id)
    {
        try
        {
            var user = await _authService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound("Usuário não encontrado");

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar usuário");
            return StatusCode(500, "Erro interno do servidor");
        }
    }
}
