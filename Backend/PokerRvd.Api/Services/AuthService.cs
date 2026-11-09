using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class AuthService : IAuthService
{
    private readonly PokerDbContext _context;
    private readonly JwtOptions _jwt;

    public AuthService(PokerDbContext context, JwtOptions jwt)
    {
        _context = context;
        _jwt = jwt;
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

    private static string HashPassword(string password) => PasswordHasher.Hash(password);

    private static bool VerifyPassword(string password, string hash) => PasswordHasher.Verify(password, hash);

    private string GenerateToken(Usuario usuario)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
            new Claim("role", usuario.Role.ToString())
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwt.ExpiraHoras),
            signingCredentials: new SigningCredentials(_jwt.ChaveAssinatura, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
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
            PermissaoConferencia = usuario.PermissaoConferencia,
            PermissaoConteudo = usuario.PermissaoConteudo,
            PermissaoFecharComanda = usuario.PermissaoFecharComanda,
            PermissaoRemoverItemComanda = usuario.PermissaoRemoverItemComanda,
            PermissaoAdicionarEstoque = usuario.PermissaoAdicionarEstoque,
            PermissaoCadastrarProduto = usuario.PermissaoCadastrarProduto
        };
    }
}
