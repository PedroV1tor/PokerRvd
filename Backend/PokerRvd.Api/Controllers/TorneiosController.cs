using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TorneiosController : ControllerBase
{
    private readonly ITorneioService _torneioService;
    private readonly ILogger<TorneiosController> _logger;

    public TorneiosController(ITorneioService torneioService, ILogger<TorneiosController> logger)
    {
        _torneioService = torneioService;
        _logger = logger;
    }

    [Authorize(Policy = Permissoes.LerTorneios)]
    [HttpGet]
    public async Task<ActionResult<List<TorneioDto>>> GetAll()
    {
        try
        {
            var torneios = await _torneioService.GetAllTorneiosAsync();
            return Ok(torneios);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar torneios");
            return StatusCode(500, "Erro ao buscar torneios");
        }
    }

    [Authorize(Policy = Permissoes.LerTorneioDaComanda)]
    [HttpGet("{id}")]
    public async Task<ActionResult<TorneioDto>> GetById(int id)
    {
        try
        {
            var torneio = await _torneioService.GetTorneioByIdAsync(id);
            if (torneio == null)
                return NotFound($"Torneio {id} não encontrado");

            return Ok(torneio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar torneio {Id}", id);
            return StatusCode(500, "Erro ao buscar torneio");
        }
    }

    [Authorize(Policy = nameof(Usuario.PermissaoCriarTorneio))]
    [HttpPost]
    public async Task<ActionResult<TorneioDto>> Create([FromBody] CreateTorneioDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Nome do torneio é obrigatório");

            var torneio = await _torneioService.CreateTorneioAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = torneio.Id }, torneio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar torneio");
            return StatusCode(500, "Erro ao criar torneio");
        }
    }

    [Authorize(Policy = Permissoes.Admin)]
    [HttpPut("{id}")]
    public async Task<ActionResult<TorneioDto>> Update(int id, [FromBody] UpdateTorneioDto dto)
    {
        try
        {
            var torneio = await _torneioService.UpdateTorneioAsync(id, dto);
            if (torneio == null)
                return NotFound($"Torneio {id} não encontrado");

            return Ok(torneio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar torneio {Id}", id);
            return StatusCode(500, "Erro ao atualizar torneio");
        }
    }

    [Authorize(Policy = nameof(Usuario.PermissaoExcluirTorneio))]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var success = await _torneioService.DeleteTorneioAsync(id);
            if (!success)
                return NotFound($"Torneio {id} não encontrado");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar torneio {Id}", id);
            return StatusCode(500, "Erro ao deletar torneio");
        }
    }

    [Authorize(Policy = nameof(Usuario.PermissaoIniciarTorneio))]
    [HttpPost("{id}/iniciar")]
    public async Task<ActionResult<TorneioDto>> Iniciar(int id)
    {
        try
        {
            var torneio = await _torneioService.IniciarTorneioAsync(id);
            if (torneio == null)
                return NotFound($"Torneio {id} não encontrado");

            return Ok(torneio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao iniciar torneio {Id}", id);
            return StatusCode(500, "Erro ao iniciar torneio");
        }
    }

    [Authorize(Policy = nameof(Usuario.PermissaoFinalizarTorneio))]
    [HttpPost("{id}/finalizar")]
    public async Task<ActionResult<TorneioDto>> Finalizar(int id)
    {
        try
        {
            var torneio = await _torneioService.FinalizarTorneioAsync(id);
            if (torneio == null)
                return NotFound($"Torneio {id} não encontrado");

            return Ok(torneio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao finalizar torneio {Id}", id);
            return StatusCode(500, "Erro ao finalizar torneio");
        }
    }

    [Authorize(Policy = nameof(Usuario.PermissaoTorneios))]
    [HttpGet("{id}/stats")]
    public async Task<ActionResult<TorneioStatsDto>> GetStats(int id)
    {
        try
        {
            var stats = await _torneioService.GetEstatisticasAsync(id);
            if (stats == null)
                return NotFound($"Torneio {id} não encontrado");

            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar estatísticas do torneio {Id}", id);
            return StatusCode(500, "Erro ao buscar estatísticas do torneio");
        }
    }

    [Authorize(Policy = Permissoes.Admin)]
    [HttpPost("{id}/cancelar")]
    public async Task<ActionResult<TorneioDto>> Cancelar(int id)
    {
        try
        {
            var torneio = await _torneioService.CancelarTorneioAsync(id);
            if (torneio == null)
                return NotFound($"Torneio {id} não encontrado");

            return Ok(torneio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao cancelar torneio {Id}", id);
            return StatusCode(500, "Erro ao cancelar torneio");
        }
    }
}
