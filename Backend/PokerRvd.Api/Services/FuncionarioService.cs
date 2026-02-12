using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;
using System.Security.Cryptography;
using System.Text;

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
        var senhaHash = HashPassword(dto.Senha);

        // Parse do Role
        if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
            role = UserRole.ATENDENTE;

        var funcionario = new Usuario
        {
            Nome = dto.Nome,
            Cpf = LimparCpf(dto.Cpf),
            Email = dto.Email.ToLower(),
            SenhaHash = senhaHash,
            Role = role,
            Ativo = true,
            DataCadastro = DateTime.UtcNow,
            PermissaoComandas = dto.PermissaoComandas,
            PermissaoTorneios = dto.PermissaoTorneios,
            PermissaoProdutos = dto.PermissaoProdutos,
            PermissaoFuncionarios = dto.PermissaoFuncionarios,
            PermissaoCaixas = dto.PermissaoCaixas
        };

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

        // Parse do Role
        if (!Enum.TryParse<UserRole>(dto.Role, true, out var role))
            role = UserRole.ATENDENTE;

        funcionario.Nome = dto.Nome;
        funcionario.Cpf = cpfLimpo;
        funcionario.Email = dto.Email.ToLower();
        funcionario.Role = role;
        funcionario.Ativo = dto.Ativo;
        funcionario.PermissaoComandas = dto.PermissaoComandas;
        funcionario.PermissaoTorneios = dto.PermissaoTorneios;
        funcionario.PermissaoProdutos = dto.PermissaoProdutos;
        funcionario.PermissaoFuncionarios = dto.PermissaoFuncionarios;
        funcionario.PermissaoCaixas = dto.PermissaoCaixas;

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
        return new FuncionarioDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Cpf = usuario.Cpf,
            Email = usuario.Email,
            Role = usuario.Role.ToString(),
            Ativo = usuario.Ativo,
            DataCadastro = usuario.DataCadastro,
            UltimoAcesso = usuario.UltimoAcesso,
            PermissaoComandas = usuario.PermissaoComandas,
            PermissaoTorneios = usuario.PermissaoTorneios,
            PermissaoProdutos = usuario.PermissaoProdutos,
            PermissaoFuncionarios = usuario.PermissaoFuncionarios,
            PermissaoCaixas = usuario.PermissaoCaixas
        };
    }

    private static string LimparCpf(string cpf)
    {
        // Remove caracteres não numéricos
        return new string(cpf.Where(char.IsDigit).ToArray());
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password + "PokerRvd_Salt_Key"); // Salt simples
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}
