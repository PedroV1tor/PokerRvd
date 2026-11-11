using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConferenciasController : ControllerBase
{
    private readonly IConferenciaService _conferenciaService;
    private readonly ILogger<ConferenciasController> _logger;

    public ConferenciasController(IConferenciaService conferenciaService, ILogger<ConferenciasController> logger)
    {
        _conferenciaService = conferenciaService;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os lançamentos de conferência
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoConferencia))]
    [HttpGet]
    public async Task<ActionResult<List<ConferenciaDto>>> GetAll()
    {
        try
        {
            var items = await _conferenciaService.GetAllAsync();
            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar conferências");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obtém um lançamento por ID
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoConferencia))]
    [HttpGet("{id}")]
    public async Task<ActionResult<ConferenciaDto>> GetById(int id)
    {
        try
        {
            var item = await _conferenciaService.GetByIdAsync(id);
            if (item == null)
                return NotFound(new { message = $"Conferência com ID {id} não encontrada" });

            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar conferência {Id}", id);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Cria um novo lançamento
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoNovaConferencia))]
    [Authorize(Policy = nameof(Usuario.PermissaoSalvarConferencia))]
    [HttpPost]
    public async Task<ActionResult<ConferenciaDto>> Create([FromBody] CreateConferenciaDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = await _conferenciaService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar conferência");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Atualiza um lançamento existente
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoEditarConferencia))]
    [Authorize(Policy = nameof(Usuario.PermissaoSalvarConferencia))]
    [HttpPut("{id}")]
    public async Task<ActionResult<ConferenciaDto>> Update(int id, [FromBody] UpdateConferenciaDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var item = await _conferenciaService.UpdateAsync(id, dto);
            if (item == null)
                return NotFound(new { message = $"Conferência com ID {id} não encontrada" });

            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar conferência {Id}", id);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Exclui um lançamento
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoExcluirConferencia))]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var success = await _conferenciaService.DeleteAsync(id);
            if (!success)
                return NotFound(new { message = $"Conferência com ID {id} não encontrada" });

            return Ok(new { message = "Conferência excluída com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao excluir conferência {Id}", id);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
