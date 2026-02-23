using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;
using System.Security.Cryptography;
using System.Text;

namespace PokerRvd.Api.Services;

public class AuthService : IAuthService
{
    private readonly PokerDbContext _context;

    public AuthService(PokerDbContext context)
    {
        _context = context;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Buscar usuário por email
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

        if (usuario == null)
        {
            return new AuthResponse 
            { 
                Message = "E-mail ou senha incorretos" 
            };
        }

        // Verificar senha
        if (!VerifyPassword(request.Senha, usuario.SenhaHash))
        {
            return new AuthResponse 
            { 
                Message = "E-mail ou senha incorretos" 
            };
        }

        // Verificar se está ativo
        if (!usuario.Ativo)
        {
            return new AuthResponse 
            { 
                Message = "Usuário inativo. Entre em contato com o administrador." 
            };
        }

        // Atualizar último acesso
        usuario.UltimoAcesso = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Retornar sucesso
        return new AuthResponse
        {
            User = MapToUserDto(usuario),
            Token = GenerateToken(usuario),
            Message = "Login realizado com sucesso"
        };
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Validar dados
        if (string.IsNullOrWhiteSpace(request.Nome) || request.Nome.Length < 3)
        {
            return new AuthResponse 
            { 
                Message = "Nome deve ter no mínimo 3 caracteres" 
            };
        }

        if (!IsValidEmail(request.Email))
        {
            return new AuthResponse 
            { 
                Message = "E-mail inválido" 
            };
        }

        if (request.Senha.Length < 6)
        {
            return new AuthResponse 
            { 
                Message = "Senha deve ter no mínimo 6 caracteres" 
            };
        }

        if (request.Senha != request.ConfirmarSenha)
        {
            return new AuthResponse 
            { 
                Message = "As senhas não coincidem" 
            };
        }

        // Verificar se email já existe
        if (await EmailExistsAsync(request.Email))
        {
            return new AuthResponse 
            { 
                Message = "E-mail já cadastrado" 
            };
        }

        // Criar usuário
        var usuario = new Usuario
        {
            Nome = request.Nome.Trim(),
            Cpf = request.Cpf.Trim(),
            Email = request.Email.ToLower().Trim(),
            SenhaHash = HashPassword(request.Senha),
            Role = UserRole.ATENDENTE, // Padrão
            Ativo = true,
            DataCadastro = DateTime.UtcNow
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return new AuthResponse
        {
            User = MapToUserDto(usuario),
            Token = GenerateToken(usuario),
            Message = "Cadastro realizado com sucesso"
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);
        return usuario != null ? MapToUserDto(usuario) : null;
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Usuarios
            .AnyAsync(u => u.Email.ToLower() == email.ToLower());
    }

    // ==================== HELPERS ====================

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password + "PokerRvd_Salt_Key"); // Salt simples
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private bool VerifyPassword(string password, string hash)
    {
        var passwordHash = HashPassword(password);
        return passwordHash == hash;
    }

    private string GenerateToken(Usuario usuario)
    {
        // Por enquanto, um token simples
        // Em produção, use JWT
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(
            $"{usuario.Id}:{usuario.Email}:{DateTime.UtcNow.Ticks}"
        ));
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private UserDto MapToUserDto(Usuario usuario)
    {
        return new UserDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Cpf = usuario.Cpf,
            Email = usuario.Email,
            Role = usuario.Role.ToString(),
            Ativo = usuario.Ativo,
            DataCadastro = usuario.DataCadastro,
            PermissaoComandas = usuario.PermissaoComandas,
            PermissaoTorneios = usuario.PermissaoTorneios,
            PermissaoProdutos = usuario.PermissaoProdutos,
            PermissaoFuncionarios = usuario.PermissaoFuncionarios,
            PermissaoCaixas = usuario.PermissaoCaixas,
            PermissaoFecharComanda = usuario.PermissaoFecharComanda,
            PermissaoRemoverItemComanda = usuario.PermissaoRemoverItemComanda,
            PermissaoAdicionarEstoque = usuario.PermissaoAdicionarEstoque,
            PermissaoCadastrarProduto = usuario.PermissaoCadastrarProduto
        };
    }
}
