using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IProdutoService _produtoService;
    private readonly ILogger<ProdutosController> _logger;

    public ProdutosController(IProdutoService produtoService, ILogger<ProdutosController> logger)
    {
        _produtoService = produtoService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProdutoDto>>> GetAll()
    {
        try
        {
            var produtos = await _produtoService.GetAllProdutosAsync();
            return Ok(produtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar produtos");
            return StatusCode(500, "Erro ao buscar produtos");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProdutoDto>> GetById(int id)
    {
        try
        {
            var produto = await _produtoService.GetProdutoByIdAsync(id);
            if (produto == null)
                return NotFound($"Produto {id} não encontrado");

            return Ok(produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar produto {Id}", id);
            return StatusCode(500, "Erro ao buscar produto");
        }
    }

    [HttpPost]
    public async Task<ActionResult<ProdutoDto>> Create([FromBody] CreateProdutoDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Nome do produto é obrigatório");

            if (dto.ValorComercial <= 0)
                return BadRequest("Valor comercial deve ser maior que zero");

            var produto = await _produtoService.CreateProdutoAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = produto.Id }, produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar produto");
            return StatusCode(500, "Erro ao criar produto");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProdutoDto>> Update(int id, [FromBody] UpdateProdutoDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Nome do produto é obrigatório");

            if (dto.ValorComercial <= 0)
                return BadRequest("Valor comercial deve ser maior que zero");

            var produto = await _produtoService.UpdateProdutoAsync(id, dto);
            if (produto == null)
                return NotFound($"Produto {id} não encontrado");

            return Ok(produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar produto {Id}", id);
            return StatusCode(500, "Erro ao atualizar produto");
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var success = await _produtoService.DeleteProdutoAsync(id);
            if (!success)
                return NotFound($"Produto {id} não encontrado");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar produto {Id}", id);
            return StatusCode(500, "Erro ao deletar produto");
        }
    }

    [HttpPost("{id}/estoque")]
    public async Task<ActionResult> AtualizarEstoque(int id, [FromBody] int quantidade)
    {
        try
        {
            var success = await _produtoService.AtualizarEstoqueAsync(id, quantidade);
            if (!success)
                return NotFound($"Produto {id} não encontrado");

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar estoque do produto {Id}", id);
            return StatusCode(500, "Erro ao atualizar estoque");
        }
    }
}
