using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComandasController : ControllerBase
{
    private readonly IComandaService _comandaService;
    private readonly ILogger<ComandasController> _logger;

    public ComandasController(IComandaService comandaService, ILogger<ComandasController> logger)
    {
        _comandaService = comandaService;
        _logger = logger;
    }

    /// <summary>
    /// Obtém todas as comandas
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<ComandaDto>>> GetAllComandas()
    {
        try
        {
            var comandas = await _comandaService.GetAllComandasAsync();
            return Ok(comandas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar comandas");
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém uma comanda por ID com detalhes completos
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ComandaDetailsDto>> GetComanda(int id)
    {
        try
        {
            var comanda = await _comandaService.GetComandaByIdAsync(id);
            if (comanda == null)
                return NotFound($"Comanda com ID {id} não encontrada");

            return Ok(comanda);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar comanda {ComandaId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Cria uma nova comanda
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ComandaDto>> CreateComanda([FromBody] CreateComandaDto createComandaDto)
    {
        try
        {
            _logger.LogInformation("Recebendo requisição para criar comanda: {@CreateComandaDto}", createComandaDto);
            
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("ModelState inválido: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            var comanda = await _comandaService.CreateComandaAsync(createComandaDto);
            return CreatedAtAction(nameof(GetComanda), new { id = comanda.Id }, comanda);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar comanda: {@CreateComandaDto}", createComandaDto);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Atualiza uma comanda existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ComandaDto>> UpdateComanda(int id, [FromBody] UpdateComandaDto updateComandaDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var comanda = await _comandaService.UpdateComandaAsync(id, updateComandaDto);
            if (comanda == null)
                return NotFound($"Comanda com ID {id} não encontrada");

            return Ok(comanda);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar comanda {ComandaId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Fecha uma comanda
    /// </summary>
    [HttpPost("{id}/fechar")]
    public async Task<ActionResult<ComandaDto>> FecharComanda(int id)
    {
        try
        {
            var comanda = await _comandaService.FecharComandaAsync(id);
            if (comanda == null)
                return NotFound($"Comanda com ID {id} não encontrada");

            return Ok(comanda);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fechar comanda {ComandaId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Adiciona um item (produto) à comanda
    /// </summary>
    [HttpPost("{id}/itens")]
    public async Task<ActionResult> AddItemToComanda(int id, [FromBody] AddItemComandaDto addItemDto)
    {
        try
        {
            var result = await _comandaService.AddItemToComandaAsync(id, addItemDto);
            if (!result)
                return BadRequest("Não foi possível adicionar o item à comanda");

            return Ok(new { message = "Item adicionado com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar item à comanda {ComandaId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Remove uma comanda
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteComanda(int id)
    {
        try
        {
            var result = await _comandaService.DeleteComandaAsync(id);
            if (!result)
                return NotFound($"Comanda com ID {id} não encontrada");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar comanda {ComandaId}", id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Obtém estatísticas do dashboard
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        try
        {
            var stats = await _comandaService.GetDashboardStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar estatísticas");
            return StatusCode(500, "Erro interno do servidor");
        }
    }
}
