using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComandasController : ControllerBase
{
    private readonly IComandaService _comandaService;
    private readonly ILogger<ComandasController> _logger;
    private readonly IAuthorizationService _authorization;

    public ComandasController(IComandaService comandaService, ILogger<ComandasController> logger, IAuthorizationService authorization)
    {
        _comandaService = comandaService;
        _logger = logger;
        _authorization = authorization;
    }

    /// <summary>
    /// Obtém todas as comandas, opcionalmente filtradas por caixa (para dashboard: caixaId do caixa aberto; para pendentes: caixaId do caixa)
    /// </summary>
    [Authorize(Policy = Permissoes.LerComandas)]
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
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obtém uma comanda por ID com detalhes completos
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoVerComanda))]
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
    [Authorize(Policy = nameof(Usuario.PermissaoCriarComanda))]
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
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Atualiza uma comanda existente
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoAlterarStatusComanda))]
    [HttpPut("{id}")]
    public async Task<ActionResult<ComandaDto>> UpdateComanda(int id, [FromBody] UpdateComandaDto updateComandaDto)
    {
        // O botão da tela só troca o status; os demais campos não têm botão
        var somenteStatus = updateComandaDto.ValorFichas == null && updateComandaDto.ValorBebidas == null
            && updateComandaDto.Tipo == null && updateComandaDto.TorneioId == null
            && updateComandaDto.TorneioNome == null && updateComandaDto.Mesa == null && !updateComandaDto.AtualizarMesa;
        if (!somenteStatus && !(await _authorization.AuthorizeAsync(User, HttpContext, Permissoes.Admin)).Succeeded)
            return Forbid();

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
    [Authorize(Policy = Permissoes.FecharOuQuitarComanda)]
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
            return new ContentResult
            {
                Content = JsonSerializer.Serialize(new { message = ex.Message }),
                ContentType = "application/json",
                StatusCode = 400
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fechar comanda {ComandaId}", id);
            return new ContentResult
            {
                Content = JsonSerializer.Serialize(new { message = "Erro interno do servidor" }),
                ContentType = "application/json",
                StatusCode = 500
            };
        }
    }

    /// <summary>
    /// Registra um pagamento parcial sem fechar a comanda
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoPagamentoParcialComanda))]
    [HttpPost("{id}/pagamento-parcial")]
    public async Task<ActionResult<ComandaDto>> PagamentoParcial(int id, [FromBody] PagamentoParcialDto pagamentoDto)
    {
        try
        {
            var comanda = await _comandaService.RegistrarPagamentoParcialAsync(id, pagamentoDto);
            if (comanda == null)
                return NotFound($"Comanda com ID {id} não encontrada");

            return Ok(comanda);
        }
        catch (InvalidOperationException ex)
        {
            return new ContentResult
            {
                Content = JsonSerializer.Serialize(new { message = ex.Message }),
                ContentType = "application/json",
                StatusCode = 400
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao registrar pagamento parcial na comanda {ComandaId}", id);
            return new ContentResult
            {
                Content = JsonSerializer.Serialize(new { message = "Erro interno do servidor" }),
                ContentType = "application/json",
                StatusCode = 500
            };
        }
    }

    /// <summary>
    /// Adiciona um item (produto) à comanda
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoAdicionarBebidaComanda))]
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
    [Authorize(Policy = nameof(Usuario.PermissaoComandas))]
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

            // Buy-in, Re-buy, Add-on e Fichas usam a mesma rota: o nome do item identifica o botão
            if (!(await _authorization.AuthorizeAsync(User, HttpContext, Permissoes.PoliticaDaFicha(addItemDto.Nome))).Succeeded)
                return Forbid();

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
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Remove um item de uma comanda e reverte a saída de caixa correspondente
    /// </summary>
    [Authorize(Policy = nameof(Usuario.PermissaoRemoverItemComanda))]
    [HttpDelete("{id}/itens/{itemId}")]
    public async Task<ActionResult> RemoveItemFromComanda(int id, int itemId)
    {
        try
        {
            var result = await _comandaService.RemoveItemFromComandaAsync(id, itemId);
            if (!result)
                return NotFound("Item não encontrado na comanda");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao remover item {ItemId} da comanda {ComandaId}", itemId, id);
            return StatusCode(500, "Erro interno do servidor");
        }
    }

    /// <summary>
    /// Remove uma comanda
    /// </summary>
    [Authorize(Policy = Permissoes.Admin)]
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
    [Authorize(Policy = nameof(Usuario.PermissaoComandas))]
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
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
