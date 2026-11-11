using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class FuncionarioService : IFuncionarioService
{
    private readonly PokerDbContext _context;

    public FuncionarioService(PokerDbContext context)
    {
        _context = context;
    }

    public async Task<List<FuncionarioDto>> GetAllFuncionariosAsync()
    {
        var funcionarios = await _context.Usuarios
            .OrderBy(u => u.Nome)
            .ToListAsync();

        return funcionarios.Select(MapToDto).ToList();
    }

    public async Task<FuncionarioDto?> GetFuncionarioByIdAsync(int id)
    {
        var funcionario = await _context.Usuarios.FindAsync(id);
        return funcionario == null ? null : MapToDto(funcionario);
    }

    public async Task<FuncionarioDto> CreateFuncionarioAsync(CreateFuncionarioDto dto)
    {
        // Validações
        if (await CpfExistsAsync(dto.Cpf))
            throw new InvalidOperationException("CPF já cadastrado");

        if (await EmailExistsAsync(dto.Email))
            throw new InvalidOperationException("Email já cadastrado");

        // Hash da senha
        var senhaHash = PasswordHasher.Hash(dto.Senha);

        var role = LerRole(dto.Role);

        var funcionario = new Usuario
        {
            Nome = dto.Nome,
            Cpf = LimparCpf(dto.Cpf),
            Email = dto.Email.ToLower(),
            SenhaHash = senhaHash,
            Role = role,
            Ativo = true,
            DataCadastro = DateTime.UtcNow
        };
        funcionario.CopiarPermissoesDe(dto);

        _context.Usuarios.Add(funcionario);
        await _context.SaveChangesAsync();

        return MapToDto(funcionario);
    }

    public async Task<FuncionarioDto?> UpdateFuncionarioAsync(int id, UpdateFuncionarioDto dto)
    {
        var funcionario = await _context.Usuarios.FindAsync(id);
        if (funcionario == null) return null;

        // Validar CPF único
        var cpfLimpo = LimparCpf(dto.Cpf);
        var cpfExistente = await _context.Usuarios
            .AnyAsync(u => u.Cpf == cpfLimpo && u.Id != id);
        if (cpfExistente)
            throw new InvalidOperationException("CPF já cadastrado para outro funcionário");

        // Validar Email único
        var emailExistente = await _context.Usuarios
            .AnyAsync(u => u.Email == dto.Email.ToLower() && u.Id != id);
        if (emailExistente)
            throw new InvalidOperationException("Email já cadastrado para outro funcionário");

        var role = LerRole(dto.Role);

        if (!string.IsNullOrEmpty(dto.NovaSenha))
        {
            if (dto.NovaSenha.Length < 8)
                throw new InvalidOperationException("A nova senha deve ter no mínimo 8 caracteres");

            funcionario.SenhaHash = PasswordHasher.Hash(dto.NovaSenha);
        }

        funcionario.Nome = dto.Nome;
        funcionario.Cpf = cpfLimpo;
        funcionario.Email = dto.Email.ToLower();
        funcionario.Role = role;
        funcionario.Ativo = dto.Ativo;
        funcionario.CopiarPermissoesDe(dto);

        await _context.SaveChangesAsync();

        return MapToDto(funcionario);
    }

    public async Task<bool> DeleteFuncionarioAsync(int id)
    {
        var funcionario = await _context.Usuarios.FindAsync(id);
        if (funcionario == null) return false;

        // Soft delete
        funcionario.Ativo = false;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CpfExistsAsync(string cpf)
    {
        var cpfLimpo = LimparCpf(cpf);
        return await _context.Usuarios.AnyAsync(u => u.Cpf == cpfLimpo);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Usuarios.AnyAsync(u => u.Email == email.ToLower());
    }

    private static FuncionarioDto MapToDto(Usuario usuario)
    {
        var dto = new FuncionarioDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Cpf = usuario.Cpf,
            Email = usuario.Email,
            Role = usuario.Role.ToString(),
            Ativo = usuario.Ativo,
            DataCadastro = usuario.DataCadastro,
            UltimoAcesso = usuario.UltimoAcesso
        };
        dto.CopiarPermissoesDe(usuario);
        return dto;
    }

    // ==================== REGRAS CONTRA ESCALONAMENTO DE PRIVILÉGIO ====================
    // Quem gerencia funcionários sem ser ADMIN não cria ADMIN, não mexe em ADMIN
    // e só concede permissões que também possui. Retornam a mensagem de recusa, ou null.

    public async Task<string?> ValidarCriacaoAsync(int editorId, CreateFuncionarioDto dto)
    {
        var editor = await BuscarAsync(editorId);
        return ValidarAlteracao(editor, alvo: null, LerRole(dto.Role), dto);
    }

    public async Task<string?> ValidarEdicaoAsync(int editorId, int alvoId, UpdateFuncionarioDto dto)
    {
        var editor = await BuscarAsync(editorId);
        if (!string.IsNullOrEmpty(dto.NovaSenha) && editor?.Role != UserRole.ADMIN)
            return "Somente administradores podem alterar senhas";

        return ValidarAlteracao(editor, await BuscarAsync(alvoId), LerRole(dto.Role), dto);
    }

    public async Task<string?> ValidarDesativacaoAsync(int editorId, int alvoId)
    {
        var editor = await BuscarAsync(editorId);
        var alvo = await BuscarAsync(alvoId);
        return editor?.Role != UserRole.ADMIN && alvo?.Role == UserRole.ADMIN ? SomenteAdmin : null;
    }

    private const string SomenteAdmin = "Somente administradores podem criar ou alterar administradores";

    private Task<Usuario?> BuscarAsync(int id) =>
        _context.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);

    private static string? ValidarAlteracao(Usuario? editor, Usuario? alvo, UserRole novoRole, PermissoesBase novas)
    {
        if (editor == null) return "Sem permissão";
        if (editor.Role == UserRole.ADMIN) return null;
        if (novoRole == UserRole.ADMIN || alvo?.Role == UserRole.ADMIN) return SomenteAdmin;

        foreach (var permissao in PermissoesBase.Todas)
        {
            var concedendo = (bool)permissao.GetValue(novas)! && !(alvo != null && (bool)permissao.GetValue(alvo)!);
            if (concedendo && !(bool)permissao.GetValue(editor)!)
                return "Você só pode conceder permissões que também possui";
        }

        return null;
    }

    private static UserRole LerRole(string role) =>
        Enum.TryParse<UserRole>(role, true, out var valor) && Enum.IsDefined(valor) ? valor : UserRole.ATENDENTE;

    private static string LimparCpf(string cpf)
    {
        // Remove caracteres não numéricos
        return new string(cpf.Where(char.IsDigit).ToArray());
    }

}
