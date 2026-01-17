using Microsoft.AspNetCore.Mvc;

namespace PokerRvd.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
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
}
