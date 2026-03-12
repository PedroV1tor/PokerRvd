using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CaixasController : ControllerBase
{
    private readonly ICaixaService _caixaService;
    private readonly ILogger<CaixasController> _logger;

    public CaixasController(ICaixaService caixaService, ILogger<CaixasController> logger)
    {
        _caixaService = caixaService;
        _logger = logger;
    }

    /// <summary>
    /// Obtém todos os caixas
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<CaixaDto>>> GetAllCaixas()
    {
        try
        {
            var caixas = await _caixaService.GetAllCaixasAsync();
            return Ok(caixas);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar caixas");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obtém um caixa por ID com detalhes completos
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CaixaDetailsDto>> GetCaixa(int id)
    {
        try
        {
            var caixa = await _caixaService.GetCaixaByIdAsync(id);
            if (caixa == null)
                return NotFound(new { message = $"Caixa com ID {id} não encontrado" });

            return Ok(caixa);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar caixa {CaixaId}", id);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Obtém o caixa atualmente aberto
    /// </summary>
    [HttpGet("aberto")]
    public async Task<ActionResult<CaixaDto>> GetCaixaAberto()
    {
        try
        {
            var caixa = await _caixaService.GetCaixaAbertoAsync();
            if (caixa == null)
                return NotFound(new { message = "Nenhum caixa aberto no momento" });

            return Ok(caixa);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar caixa aberto");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Abre um novo caixa
    /// </summary>
    [HttpPost("abrir")]
    public async Task<ActionResult<CaixaDto>> AbrirCaixa([FromBody] CreateCaixaDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var usuarioNome = !string.IsNullOrWhiteSpace(dto.UsuarioNome) ? dto.UsuarioNome : "Sistema";

            var caixa = await _caixaService.AbrirCaixaAsync(dto, usuarioNome);
            return CreatedAtAction(nameof(GetCaixa), new { id = caixa.Id }, caixa);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao abrir caixa");
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Fecha um caixa
    /// </summary>
    [HttpPost("{id}/fechar")]
    public async Task<ActionResult<CaixaDto>> FecharCaixa(int id, [FromBody] FecharCaixaDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Por enquanto usando usuário fixo, depois pegar do token de autenticação
            var usuarioNome = "Administrador";

            var caixa = await _caixaService.FecharCaixaAsync(id, dto, usuarioNome);
            if (caixa == null)
                return NotFound(new { message = $"Caixa com ID {id} não encontrado" });

            return Ok(caixa);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao fechar caixa {CaixaId}", id);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }

    /// <summary>
    /// Adiciona uma movimentação ao caixa
    /// </summary>
    [HttpPost("{id}/movimentacoes")]
    public async Task<ActionResult> AddMovimentacao(int id, [FromBody] CreateMovimentacaoDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Por enquanto usando usuário fixo, depois pegar do token de autenticação
            var usuarioNome = "Administrador";

            var result = await _caixaService.AddMovimentacaoAsync(id, dto, usuarioNome);
            if (!result)
                return BadRequest(new { message = "Não foi possível adicionar a movimentação. Verifique se o caixa está aberto." });

            return Ok(new { message = "Movimentação adicionada com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar movimentação ao caixa {CaixaId}", id);
            return StatusCode(500, new { message = "Erro interno do servidor" });
        }
    }
}
