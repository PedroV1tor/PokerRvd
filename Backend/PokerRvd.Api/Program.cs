using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.Hubs;
using PokerRvd.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS para permitir chamadas do Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Adicionar DbContext (usando PostgreSQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<PokerDbContext>(options =>
    options.UseNpgsql(connectionString));

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

// Verificar conexão com o banco na inicialização (apenas log, não bloqueia)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PokerDbContext>();
    try
    {
        if (await db.Database.CanConnectAsync())
            app.Logger.LogInformation("Conexão com o banco de dados PostgreSQL OK.");
        else
            app.Logger.LogWarning("Não foi possível conectar ao banco de dados.");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Erro ao conectar ao banco de dados. Verifique ConnectionStrings:DefaultConnection em appsettings.json (Host, Port, Database, Username, Password) e se o PostgreSQL está rodando.");
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

app.Run();
