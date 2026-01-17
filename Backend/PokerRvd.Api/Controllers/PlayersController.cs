using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly IPokerService _pokerService;
    private readonly ILogger<PlayersController> _logger;

    public PlayersController(IPokerService pokerService, ILogger<PlayersController> logger)
    {
        _pokerService = pokerService;
        _logger = logger;
    }

    /// <summary>
    /// Obtém todos os jogadores ativos
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<PlayerDto>>> GetAllPlayers()
    {
        try
        {
            var players = await _pokerService.GetAllPlayersAsync();
            return Ok(players);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar jogadores");
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém um jogador por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PlayerDto>> GetPlayer(int id)
    {
        try
        {
            var player = await _pokerService.GetPlayerByIdAsync(id);
            if (player == null)
                return NotFound($"Jogador com ID {id} não encontrado");

            return Ok(player);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar jogador {PlayerId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Cria um novo jogador
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<PlayerDto>> CreatePlayer([FromBody] CreatePlayerDto createPlayerDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var player = await _pokerService.CreatePlayerAsync(createPlayerDto);
            return CreatedAtAction(nameof(GetPlayer), new { id = player.Id }, player);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar jogador");
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Atualiza um jogador existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<PlayerDto>> UpdatePlayer(int id, [FromBody] UpdatePlayerDto updatePlayerDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var player = await _pokerService.UpdatePlayerAsync(id, updatePlayerDto);
            if (player == null)
                return NotFound($"Jogador com ID {id} não encontrado");

            return Ok(player);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar jogador {PlayerId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Remove um jogador (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePlayer(int id)
    {
        try
        {
            var result = await _pokerService.DeletePlayerAsync(id);
            if (!result)
                return NotFound($"Jogador com ID {id} não encontrado");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar jogador {PlayerId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }
}
