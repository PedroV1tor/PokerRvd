using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/conteudo")]
[Authorize(Policy = "Conteudo")]
public class ConteudoController : ControllerBase
{
    private const long TamanhoMaximoImagem = 5 * 1024 * 1024;

    private readonly IConteudoService _conteudoService;
    private readonly IImagemService _imagemService;
    private readonly ILogger<ConteudoController> _logger;

    public ConteudoController(
        IConteudoService conteudoService,
        IImagemService imagemService,
        ILogger<ConteudoController> logger)
    {
        _conteudoService = conteudoService;
        _imagemService = imagemService;
        _logger = logger;
    }

    // ==================== POSTAGENS ====================

    [HttpGet("postagens")]
    public async Task<ActionResult<List<PostagemDto>>> GetPostagens()
    {
        try
        {
            return Ok(await _conteudoService.GetPostagensAsync());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar postagens");
            return StatusCode(500, "Erro ao buscar postagens");
        }
    }

    [HttpPost("postagens")]
    public async Task<ActionResult<PostagemDto>> CreatePostagem([FromBody] SalvarPostagemDto dto)
    {
        var erro = Validar(dto);
        if (erro != null) return BadRequest(erro);

        try
        {
            var autorId = int.TryParse(User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value, out var id) ? id : (int?)null;
            return Ok(await _conteudoService.CreatePostagemAsync(dto, autorId));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar postagem");
            return StatusCode(500, "Erro ao criar postagem");
        }
    }

    [HttpPut("postagens/{id}")]
    public async Task<ActionResult<PostagemDto>> UpdatePostagem(int id, [FromBody] SalvarPostagemDto dto)
    {
        var erro = Validar(dto);
        if (erro != null) return BadRequest(erro);

        try
        {
            var postagem = await _conteudoService.UpdatePostagemAsync(id, dto);
            if (postagem == null)
                return NotFound($"Postagem {id} não encontrada");

            return Ok(postagem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar postagem {Id}", id);
            return StatusCode(500, "Erro ao atualizar postagem");
        }
    }

    [HttpDelete("postagens/{id}")]
    public async Task<ActionResult> DeletePostagem(int id)
    {
        try
        {
            var success = await _conteudoService.DeletePostagemAsync(id);
            if (!success)
                return NotFound($"Postagem {id} não encontrada");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar postagem {Id}", id);
            return StatusCode(500, "Erro ao deletar postagem");
        }
    }

    [HttpPost("postagens/{id}/publicar")]
    public async Task<ActionResult<PostagemDto>> PublicarPostagem(int id)
    {
        try
        {
            var postagem = await _conteudoService.PublicarPostagemAsync(id);
            if (postagem == null)
                return NotFound($"Postagem {id} não encontrada");

            return Ok(postagem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao publicar postagem {Id}", id);
            return StatusCode(500, "Erro ao publicar postagem");
        }
    }

    [HttpPost("postagens/{id}/despublicar")]
    public async Task<ActionResult<PostagemDto>> DespublicarPostagem(int id)
    {
        try
        {
            var postagem = await _conteudoService.DespublicarPostagemAsync(id);
            if (postagem == null)
                return NotFound($"Postagem {id} não encontrada");

            return Ok(postagem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao despublicar postagem {Id}", id);
            return StatusCode(500, "Erro ao despublicar postagem");
        }
    }

    // ==================== TORNEIO DO DIA ====================

    [HttpGet("torneios-do-dia")]
    public async Task<ActionResult<List<TorneioDoDiaDto>>> GetTorneiosDoDia()
    {
        try
        {
            return Ok(await _conteudoService.GetTorneiosDoDiaAsync());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar torneios do dia");
            return StatusCode(500, "Erro ao buscar torneios do dia");
        }
    }

    [HttpPost("torneios-do-dia")]
    public async Task<ActionResult<TorneioDoDiaDto>> CreateTorneioDoDia([FromBody] SalvarTorneioDoDiaDto dto)
    {
        var erro = Validar(dto);
        if (erro != null) return BadRequest(erro);

        try
        {
            return Ok(await _conteudoService.CreateTorneioDoDiaAsync(dto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar torneio do dia");
            return StatusCode(500, "Erro ao criar torneio do dia");
        }
    }

    [HttpPut("torneios-do-dia/{id}")]
    public async Task<ActionResult<TorneioDoDiaDto>> UpdateTorneioDoDia(int id, [FromBody] SalvarTorneioDoDiaDto dto)
    {
        var erro = Validar(dto);
        if (erro != null) return BadRequest(erro);

        try
        {
            var torneio = await _conteudoService.UpdateTorneioDoDiaAsync(id, dto);
            if (torneio == null)
                return NotFound($"Torneio do dia {id} não encontrado");

            return Ok(torneio);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar torneio do dia {Id}", id);
            return StatusCode(500, "Erro ao atualizar torneio do dia");
        }
    }

    [HttpDelete("torneios-do-dia/{id}")]
    public async Task<ActionResult> DeleteTorneioDoDia(int id)
    {
        try
        {
            var success = await _conteudoService.DeleteTorneioDoDiaAsync(id);
            if (!success)
                return NotFound($"Torneio do dia {id} não encontrado");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar torneio do dia {Id}", id);
            return StatusCode(500, "Erro ao deletar torneio do dia");
        }
    }

    // ==================== IMAGENS ====================

    [HttpPost("imagens")]
    [RequestSizeLimit(TamanhoMaximoImagem + 1024 * 1024)]
    public async Task<ActionResult<object>> EnviarImagem(IFormFile arquivo, CancellationToken cancellationToken)
    {
        if (arquivo == null || arquivo.Length == 0)
            return BadRequest("Selecione uma imagem");

        if (arquivo.Length > TamanhoMaximoImagem)
            return BadRequest("A imagem deve ter no máximo 5 MB");

        if (!await EhImagemValidaAsync(arquivo, cancellationToken))
            return BadRequest("Envie uma imagem JPG, PNG ou WebP");

        if (!_imagemService.Configurado)
            return StatusCode(503, "Envio de imagens não configurado no servidor");

        try
        {
            var url = await _imagemService.EnviarAsync(arquivo, cancellationToken);
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar imagem");
            return StatusCode(502, "Não foi possível enviar a imagem");
        }
    }

    // ==================== VALIDAÇÃO ====================

    private static string? Validar(SalvarPostagemDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Titulo)) return "Título é obrigatório";
        if (dto.Titulo.Length > 200) return "Título deve ter no máximo 200 caracteres";
        if (string.IsNullOrWhiteSpace(dto.Conteudo)) return "Texto é obrigatório";
        if (dto.Conteudo.Length > 5000) return "Texto deve ter no máximo 5000 caracteres";
        return ValidarImagemUrl(dto.ImagemUrl);
    }

    private static string? Validar(SalvarTorneioDoDiaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Titulo)) return "Título é obrigatório";
        if (dto.Titulo.Length > 200) return "Título deve ter no máximo 200 caracteres";
        if (string.IsNullOrWhiteSpace(dto.Modalidade)) return "Modalidade é obrigatória";
        if (dto.Modalidade.Length > 50) return "Modalidade deve ter no máximo 50 caracteres";
        if (dto.Inicio == default || dto.Fim == default) return "Informe o início e o fim do torneio";
        if (dto.Fim <= dto.Inicio) return "O fim deve ser depois do início";
        if (dto.BuyIn < 0 || dto.Garantido < 0) return "Valores não podem ser negativos";
        if (dto.Descricao?.Length > 1000) return "Descrição deve ter no máximo 1000 caracteres";
        return ValidarImagemUrl(dto.ImagemUrl);
    }

    private static string? ValidarImagemUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url)) return null;
        if (url.Length > 500) return "Endereço da imagem muito longo";

        var valida = Uri.TryCreate(url.Trim(), UriKind.Absolute, out var uri) && uri.Scheme == Uri.UriSchemeHttps;
        return valida ? null : "A imagem deve ser um endereço https válido";
    }

    // Confere o conteúdo real do arquivo, não a extensão informada por quem enviou
    private static async Task<bool> EhImagemValidaAsync(IFormFile arquivo, CancellationToken cancellationToken)
    {
        var cabecalho = new byte[12];
        await using var stream = arquivo.OpenReadStream();
        var lidos = await stream.ReadAtLeastAsync(cabecalho, cabecalho.Length, false, cancellationToken);
        if (lidos < cabecalho.Length) return false;

        var jpg = cabecalho[0] == 0xFF && cabecalho[1] == 0xD8 && cabecalho[2] == 0xFF;
        var png = cabecalho.AsSpan(0, 8).SequenceEqual(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A });
        var webp = cabecalho.AsSpan(0, 4).SequenceEqual("RIFF"u8) && cabecalho.AsSpan(8, 4).SequenceEqual("WEBP"u8);
        return jpg || png || webp;
    }
}
