using Microsoft.AspNetCore.SignalR;

namespace PokerRvd.Api.Hubs;

/// <summary>
/// Hub central para eventos em tempo real. Todos os clientes conectados recebem as atualizações.
/// </summary>
public class PokerHub : Hub
{
    // Clientes podem conectar e receber broadcasts - não precisam chamar métodos do hub
    // O servidor emite via IHubContext<PokerHub>
}
