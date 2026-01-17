using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IPokerService _pokerService;
    private readonly ILogger<GamesController> _logger;

    public GamesController(IPokerService pokerService, ILogger<GamesController> logger)
    {
        _pokerService = pokerService;
        _logger = logger;
    }

    /// <summary>
    /// Obtém todas as mesas de jogo
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<GameDto>>> GetAllGames()
    {
        try
        {
            var games = await _pokerService.GetAllGamesAsync();
            return Ok(games);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar mesas");
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém detalhes de uma mesa específica
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<GameDetailsDto>> GetGame(int id)
    {
        try
        {
            var game = await _pokerService.GetGameByIdAsync(id);
            if (game == null)
                return NotFound($"Mesa com ID {id} não encontrada");

            return Ok(game);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar mesa {GameId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Cria uma nova mesa de jogo
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<GameDto>> CreateGame([FromBody] CreateGameDto createGameDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var game = await _pokerService.CreateGameAsync(createGameDto);
            return CreatedAtAction(nameof(GetGame), new { id = game.Id }, game);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar mesa");
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Permite que um jogador entre em uma mesa
    /// </summary>
    [HttpPost("{gameId}/join/{playerId}")]
    public async Task<ActionResult> JoinGame(int gameId, int playerId)
    {
        try
        {
            var result = await _pokerService.JoinGameAsync(gameId, playerId);
            if (!result)
                return BadRequest("Não foi possível entrar na mesa. Verifique se a mesa existe, tem vagas disponíveis e se o jogador tem saldo suficiente.");

            return Ok(new { message = "Jogador adicionado à mesa com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar jogador {PlayerId} à mesa {GameId}", playerId, gameId);
            return StatusCode(500, "Erro interno do servidor");
        }
    }
}
