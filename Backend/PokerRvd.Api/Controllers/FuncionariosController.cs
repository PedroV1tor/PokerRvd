using Microsoft.AspNetCore.Mvc;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Services;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FuncionariosController : ControllerBase
{
    private readonly IFuncionarioService _funcionarioService;
    private readonly ILogger<FuncionariosController> _logger;

    public FuncionariosController(IFuncionarioService funcionarioService, ILogger<FuncionariosController> logger)
    {
        _funcionarioService = funcionarioService;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os funcionários
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<FuncionarioDto>>> GetAll()
    {
        try
        {
            var funcionarios = await _funcionarioService.GetAllFuncionariosAsync();
            return Ok(funcionarios);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar funcionários");
            return StatusCode(500, "Erro ao buscar funcionários");
        }
    }

    /// <summary>
    /// Busca um funcionário por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<FuncionarioDto>> GetById(int id)
    {
        try
        {
            var funcionario = await _funcionarioService.GetFuncionarioByIdAsync(id);
            if (funcionario == null)
                return NotFound($"Funcionário {id} não encontrado");

            return Ok(funcionario);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar funcionário {Id}", id);
            return StatusCode(500, "Erro ao buscar funcionário");
        }
    }

    /// <summary>
    /// Cria um novo funcionário
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<FuncionarioDto>> Create([FromBody] CreateFuncionarioDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Nome é obrigatório");

            if (string.IsNullOrWhiteSpace(dto.Cpf))
                return BadRequest("CPF é obrigatório");

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email é obrigatório");

            if (string.IsNullOrWhiteSpace(dto.Senha))
                return BadRequest("Senha é obrigatória");

            var funcionario = await _funcionarioService.CreateFuncionarioAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = funcionario.Id }, funcionario);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Erro de validação ao criar funcionário");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar funcionário");
            return StatusCode(500, "Erro ao criar funcionário");
        }
    }

    /// <summary>
    /// Atualiza um funcionário existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<FuncionarioDto>> Update(int id, [FromBody] UpdateFuncionarioDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Nome é obrigatório");

            if (string.IsNullOrWhiteSpace(dto.Cpf))
                return BadRequest("CPF é obrigatório");

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email é obrigatório");

            var funcionario = await _funcionarioService.UpdateFuncionarioAsync(id, dto);
            if (funcionario == null)
                return NotFound($"Funcionário {id} não encontrado");

            return Ok(funcionario);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Erro de validação ao atualizar funcionário {Id}", id);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar funcionário {Id}", id);
            return StatusCode(500, "Erro ao atualizar funcionário");
        }
    }

    /// <summary>
    /// Desativa um funcionário (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            var success = await _funcionarioService.DeleteFuncionarioAsync(id);
            if (!success)
                return NotFound($"Funcionário {id} não encontrado");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao deletar funcionário {Id}", id);
            return StatusCode(500, "Erro ao deletar funcionário");
        }
    }

    /// <summary>
    /// Verifica se um CPF já está cadastrado
    /// </summary>
    [HttpGet("check-cpf/{cpf}")]
    public async Task<ActionResult<bool>> CheckCpf(string cpf)
    {
        try
        {
            var exists = await _funcionarioService.CpfExistsAsync(cpf);
            return Ok(new { exists });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar CPF");
            return StatusCode(500, "Erro ao verificar CPF");
        }
    }

    /// <summary>
    /// Verifica se um email já está cadastrado
    /// </summary>
    [HttpGet("check-email/{email}")]
    public async Task<ActionResult<bool>> CheckEmail(string email)
    {
        try
        {
            var exists = await _funcionarioService.EmailExistsAsync(email);
            return Ok(new { exists });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao verificar email");
            return StatusCode(500, "Erro ao verificar email");
        }
    }
}
