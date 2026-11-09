using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

/// <summary>
/// Rotas lidas pela landing page. Somente GET e somente dados publicáveis.
/// </summary>
[ApiController]
[Route("api/public")]
[AllowAnonymous]
[EnableCors("PublicRead")]
public class PublicController : ControllerBase
{
    // 30s no servidor + 30s no navegador: uma alteração aparece no site em até 1 minuto
    private const int CacheSegundos = 30;
    private const int LimiteMaximo = 12;

    private readonly IConteudoService _conteudoService;
    private readonly ILogger<PublicController> _logger;

    public PublicController(IConteudoService conteudoService, ILogger<PublicController> logger)
    {
        _conteudoService = conteudoService;
        _logger = logger;
    }

    [HttpGet("torneio-do-dia")]
    [OutputCache(Duration = CacheSegundos)]
    [ResponseCache(Duration = CacheSegundos, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<TorneioDoDiaPublicoDto>> GetTorneioDoDia()
    {
        try
        {
            var torneio = await _conteudoService.GetTorneioDoDiaPublicoAsync();
            if (torneio == null)
                return NoContent();

            return Ok(torneio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar torneio do dia");
            return StatusCode(500, "Erro ao buscar torneio do dia");
        }
    }

    [HttpGet("postagens")]
    [OutputCache(Duration = CacheSegundos)]
    [ResponseCache(Duration = CacheSegundos, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<List<PostagemPublicaDto>>> GetPostagens([FromQuery] int limit = 6)
    {
        try
        {
            var postagens = await _conteudoService.GetPostagensPublicasAsync(Math.Clamp(limit, 1, LimiteMaximo));
            return Ok(postagens);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar postagens");
            return StatusCode(500, "Erro ao buscar postagens");
        }
    }
}
