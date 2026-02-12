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
    /// Obtém todas as comandas, opcionalmente filtradas por caixa (para dashboard: caixaId do caixa aberto; para pendentes: caixaId do caixa)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<ComandaDto>>> GetAllComandas([FromQuery] int? caixaId = null)
    {
        try
        {
            var comandas = await _comandaService.GetAllComandasAsync(caixaId);
            return Ok(comandas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar comandas");
            var message = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, new { message = message });
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
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Operação inválida ao criar comanda");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar comanda: {@CreateComandaDto}", createComandaDto);
            var message = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, new { message = message });
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
    /// Fecha uma comanda, opcionalmente informando as formas de pagamento
    /// </summary>
    [HttpPost("{id}/fechar")]
    public async Task<ActionResult<ComandaDto>> FecharComanda(int id, [FromBody] FecharComandaDto? fecharComandaDto = null)
    {
        try
        {
            var comanda = await _comandaService.FecharComandaAsync(id, fecharComandaDto);
            if (comanda == null)
                return NotFound($"Comanda com ID {id} não encontrada");

            return Ok(comanda);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
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
    /// Adiciona um item de fichas (Buy-in, Re-buy, Add-on) à comanda
    /// </summary>
    [HttpPost("{id}/fichas")]
    public async Task<ActionResult> AddFichasToComanda(int id, [FromBody] AddItemFichasDto addItemDto)
    {
        try
        {
            _logger.LogInformation("Recebendo requisição para adicionar fichas à comanda {ComandaId}. Nome: {Nome}, Valor: {Valor}", 
                id, addItemDto?.Nome, addItemDto?.Valor);

            if (addItemDto == null)
            {
                _logger.LogWarning("Dados inválidos: addItemDto é nulo");
                return BadRequest("Dados inválidos");
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Modelo inválido: {Errors}", 
                    string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
                return BadRequest(ModelState);
            }

            var result = await _comandaService.AddItemFichasAsync(id, addItemDto);
            if (!result)
            {
                _logger.LogWarning("Falha ao adicionar fichas à comanda {ComandaId}", id);
                return BadRequest("Não foi possível adicionar as fichas à comanda");
            }

            _logger.LogInformation("Fichas adicionadas com sucesso à comanda {ComandaId}", id);
            return Ok(new { message = "Fichas adicionadas com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar fichas à comanda {ComandaId}", id);
            return StatusCode(500, new { message = "Erro interno do servidor", error = ex.Message });
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
    /// Obtém estatísticas do dashboard (opcional: caixaId do caixa aberto para contar só comandas desse caixa)
    /// </summary>
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats([FromQuery] int? caixaId = null)
    {
        try
        {
            var stats = await _comandaService.GetDashboardStatsAsync(caixaId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar estatísticas");
            var message = ex.InnerException?.Message ?? ex.Message;
            return StatusCode(500, new { message = message });
        }
    }
}
