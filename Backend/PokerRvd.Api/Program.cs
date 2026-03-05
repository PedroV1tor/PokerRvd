using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.Hubs;
using PokerRvd.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Porta para Railway/container (env PORT) - 0.0.0.0 para aceitar conexões externas
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS (origens de env em produção, localhost em dev)
var corsOrigins = builder.Configuration["CORS__Origins"] ?? "http://localhost:4200,http://localhost:4000";
var origins = corsOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
if (origins.Length == 0)
    origins = ["http://localhost:4200", "http://localhost:4000"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
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
builder.Services.AddSignalR();

var app = builder.Build();

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

// Aplicar migrations e verificar conexão na inicialização
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PokerDbContext>();
    try
    {
        await db.Database.MigrateAsync();
        app.Logger.LogInformation("Banco de dados migrado e conectado.");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Erro ao conectar/migrar o banco. Verifique ConnectionStrings ou DATABASE_URL.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");

// Em desenvolvimento, evita redirecionar HTTP->HTTPS (quebra negotiate do SignalR)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();
app.MapHub<PokerHub>("/hubs/poker");

// Rota raiz para verificar se a API está online
app.MapGet("/", () => Results.Json(new { service = "PokerRvd API", status = "online", docs = "/swagger" }));

app.Run();
