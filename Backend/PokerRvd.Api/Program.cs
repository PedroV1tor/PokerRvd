using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PokerRvd.Api.Data;
using PokerRvd.Api.Hubs;
using PokerRvd.Api.Models;
using PokerRvd.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Porta: Railway usa PORT; local usa 5000 (igual launchSettings e config.json do frontend)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS__Origins: URLs do sistema separadas por vírgula. Em desenvolvimento libera localhost.
var corsOrigins = (builder.Configuration["CORS:Origins"] ?? string.Empty)
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .Select(origin => origin.TrimEnd('/'))
    .ToHashSet(StringComparer.OrdinalIgnoreCase);
var corsLiberarLocalhost = builder.Environment.IsDevelopment();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
                  corsOrigins.Contains(origin) ||
                  (corsLiberarLocalhost && new Uri(origin).IsLoopback))
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });

    // Landing page (produção e previews da Vercel): somente leitura de dados públicos
    options.AddPolicy("PublicRead", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .WithMethods("GET");
    });
});

// Jwt__Key: segredo de pelo menos 32 caracteres. Obrigatório fora de desenvolvimento.
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    if (!builder.Environment.IsDevelopment())
        throw new InvalidOperationException("Configure a variável Jwt__Key (mínimo de 32 caracteres).");

    jwtKey = Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));
}
if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
    throw new InvalidOperationException("Jwt__Key deve ter no mínimo 32 caracteres.");

var jwtOptions = new JwtOptions(
    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
    builder.Configuration.GetValue("Jwt:ExpiraHoras", 12));
builder.Services.AddSingleton(jwtOptions);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = jwtOptions.ChaveAssinatura,
            ClockSkew = TimeSpan.FromMinutes(1),
            NameClaimType = JwtRegisteredClaimNames.Sub,
            RoleClaimType = "role"
        };

        // WebSocket não envia header Authorization: o SignalR manda o token na query
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(token) && context.HttpContext.Request.Path.StartsWithSegments("/hubs"))
                    context.Token = token;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Toda rota exige login, exceto as marcadas com [AllowAnonymous]
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    // Consulta o banco para valer na hora quando a permissão muda
    foreach (var (nome, regra) in Permissoes.Regras)
        options.AddPolicy(nome, policy => policy.RequireAssertion(context => UsuarioAutorizadoAsync(context, regra)));
});

builder.Services.AddOutputCache();
builder.Services.AddMemoryCache();

// O Railway fica na frente da API: o IP real vem no último valor de X-Forwarded-For, escrito pelo próprio proxy
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.ForwardLimit = 1;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("Login", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "desconhecido",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
    options.OnRejected = (context, cancellationToken) =>
        new ValueTask(context.HttpContext.Response.WriteAsJsonAsync(
            new { message = "Muitas tentativas. Aguarde um minuto e tente novamente." }, cancellationToken));
});

// Connection string: usa DATABASE_URL (formato Railway) ou ConnectionStrings__DefaultConnection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (!string.IsNullOrEmpty(databaseUrl))
        connectionString = ConvertDatabaseUrlToNpgsql(databaseUrl);
}
if (string.IsNullOrEmpty(connectionString))
    throw new InvalidOperationException("Configure ConnectionStrings__DefaultConnection ou DATABASE_URL.");

builder.Services.AddDbContext<PokerDbContext>(options =>
    options.UseNpgsql(connectionString));

static async Task<bool> UsuarioAutorizadoAsync(AuthorizationHandlerContext context, Func<Usuario, bool> regra)
{
    if (context.Resource is not HttpContext http) return false;
    if (!int.TryParse(context.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value, out var usuarioId)) return false;

    var db = http.RequestServices.GetRequiredService<PokerDbContext>();
    var usuario = await db.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.Id == usuarioId);
    return usuario != null && Permissoes.Permite(usuario, regra);
}

static string ConvertDatabaseUrlToNpgsql(string databaseUrl)
{
    if (databaseUrl.StartsWith("postgres://"))
        databaseUrl = "postgresql" + databaseUrl[10..];
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':', 2);
    var host = uri.Host;
    var port = uri.Port > 0 ? uri.Port : 5432;
    var database = uri.AbsolutePath.TrimStart('/');
    var username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "postgres";
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
    return $"Host={host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Prefer;";
}

// Adicionar serviços personalizados
builder.Services.AddScoped<IComandaService, ComandaService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<ICaixaService, CaixaService>();
builder.Services.AddScoped<IFuncionarioService, FuncionarioService>();
builder.Services.AddScoped<ITorneioService, TorneioService>();
builder.Services.AddScoped<IConferenciaService, ConferenciaService>();
builder.Services.AddScoped<IConteudoService, ConteudoService>();
builder.Services.AddHttpClient<IImagemService, ImagemService>();
builder.Services.AddSignalR();

var app = builder.Build();

app.UseForwardedHeaders();

// Em desenvolvimento, capturar exceções não tratadas e retornar mensagem no 500 (ajuda a debugar)
if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new { message = ex.Message, detail = ex.ToString() }));
        }
    });
}

// Aplicar migrations em background (evita 502 por timeout no Railway)
// A API responde imediatamente em / e /api/health; demais rotas podem falhar até migração concluir
_ = Task.Run(async () =>
{
    await Task.Delay(500);
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<PokerDbContext>();
    try
    {
        await db.Database.MigrateAsync();
        app.Logger.LogInformation("Banco de dados migrado e conectado.");
        // O seeder redefine as contas padrão para senhas fixas: nunca rodar em produção
        if (app.Environment.IsDevelopment())
            await DataSeeder.EnsureDefaultUsuariosAsync(db, app.Logger);
        else
            await SenhasPadrao.ProtegerAdminAsync(db, builder.Configuration["Admin:SenhaInicial"], app.Logger);
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Erro ao conectar/migrar o banco. Verifique ConnectionStrings ou DATABASE_URL.");
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (corsOrigins.Count == 0 && !app.Environment.IsDevelopment())
    app.Logger.LogWarning("CORS__Origins não configurado: o sistema não conseguirá chamar a API.");

app.UseCors("AllowAngular");
app.UseRateLimiter();

// Em desenvolvimento, evita redirecionar HTTP->HTTPS (quebra negotiate do SignalR)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseOutputCache();

app.MapControllers();
app.MapHub<PokerHub>("/hubs/poker");

// Rota raiz - HTML simples para ver no navegador
app.MapGet("/", () => Results.Content("""
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>PokerRvd API</title></head>
<body>
<h1>PokerRvd API</h1>
<p><strong>Status:</strong> Online</p>
<p><a href="/api/health">Health Check</a></p>
<p><a href="/swagger">Swagger</a> (apenas em Development)</p>
</body></html>
""", "text/html")).AllowAnonymous();

app.Run();
