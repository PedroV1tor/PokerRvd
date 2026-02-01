using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly PokerDbContext _db;

    public HealthController(PokerDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Endpoint para verificar se a API está funcionando
    /// </summary>
    [HttpGet]
    public ActionResult<object> GetHealth()
    {
        return Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            service = "PokerRvd API",
            version = "1.0.0"
        });
    }

    /// <summary>
    /// Verifica a conexão com o banco de dados PostgreSQL
    /// </summary>
    [HttpGet("db")]
    public async Task<ActionResult<object>> GetDatabaseHealth()
    {
        try
        {
            var canConnect = await _db.Database.CanConnectAsync();
            if (!canConnect)
            {
                return StatusCode(500, new
                {
                    status = "unhealthy",
                    database = "PostgreSQL",
                    message = "Não foi possível conectar ao banco de dados.",
                    timestamp = DateTime.UtcNow
                });
            }

            return Ok(new
            {
                status = "healthy",
                database = "PostgreSQL",
                message = "Conexão com o banco de dados OK.",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = "unhealthy",
                database = "PostgreSQL",
                message = "Erro ao conectar ao banco de dados.",
                error = ex.Message,
                timestamp = DateTime.UtcNow
            });
        }
    }
}
