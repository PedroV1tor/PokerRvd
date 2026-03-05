using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Hubs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class TorneioService : ITorneioService
{
    private readonly PokerDbContext _context;
    private readonly IHubContext<PokerHub> _hubContext;

    public TorneioService(PokerDbContext context, IHubContext<PokerHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    private async Task NotificarTorneioAsync(string evento, object? payload = null)
    {
        try
        {
            await _hubContext.Clients.All.SendAsync(evento, payload);
        }
        catch
        {
            // Silencioso - não quebrar fluxo principal
        }
    }

    public async Task<List<TorneioDto>> GetAllTorneiosAsync()
    {
        var torneios = await _context.Torneios
            .OrderByDescending(t => t.DataCadastro)
            .ToListAsync();

        return torneios.Select(MapToDto).ToList();
    }

    public async Task<TorneioDto?> GetTorneioByIdAsync(int id)
    {
        var torneio = await _context.Torneios.FindAsync(id);
        return torneio == null ? null : MapToDto(torneio);
    }

    public async Task<TorneioDto> CreateTorneioAsync(CreateTorneioDto dto)
    {
        var torneio = new Torneio
        {
            Nome = dto.Nome,
            ValorBuyIn = dto.ValorBuyIn,
            ValorRebuySimples = dto.ValorRebuySimples,
            ValorRebuyDuplo = dto.ValorRebuyDuplo,
            ValorAddOn = dto.ValorAddOn,
            Status = "AGUARDANDO",
            Participantes = 0,
            PremioTotal = 0,
            DataCadastro = DateTime.UtcNow
        };

        _context.Torneios.Add(torneio);
        await _context.SaveChangesAsync();

        var result = MapToDto(torneio);
        await NotificarTorneioAsync("TorneioCriado", result);
        return result;
    }

    public async Task<TorneioDto?> UpdateTorneioAsync(int id, UpdateTorneioDto dto)
    {
        var torneio = await _context.Torneios.FindAsync(id);
        if (torneio == null) return null;

        if (dto.Nome != null) torneio.Nome = dto.Nome;
        if (dto.ValorBuyIn.HasValue) torneio.ValorBuyIn = dto.ValorBuyIn.Value;
        if (dto.ValorRebuySimples.HasValue) torneio.ValorRebuySimples = dto.ValorRebuySimples.Value;
        if (dto.ValorRebuyDuplo.HasValue) torneio.ValorRebuyDuplo = dto.ValorRebuyDuplo.Value;
        if (dto.ValorAddOn.HasValue) torneio.ValorAddOn = dto.ValorAddOn.Value;
        if (dto.Status != null) torneio.Status = dto.Status;

        await _context.SaveChangesAsync();

        var result = MapToDto(torneio);
        await NotificarTorneioAsync("TorneioAtualizado", result);
        return result;
    }

    public async Task<bool> DeleteTorneioAsync(int id)
    {
        var torneio = await _context.Torneios.FindAsync(id);
        if (torneio == null) return false;

        _context.Torneios.Remove(torneio);
        await _context.SaveChangesAsync();
        await NotificarTorneioAsync("TorneioRemovido", new { id });
        return true;
    }

    public async Task<TorneioDto?> IniciarTorneioAsync(int id)
    {
        var torneio = await _context.Torneios.FindAsync(id);
        if (torneio == null) return null;

        torneio.Status = "EM_ANDAMENTO";
        if (!torneio.DataInicio.HasValue)
            torneio.DataInicio = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(torneio);
    }

    public async Task<TorneioDto?> FinalizarTorneioAsync(int id)
    {
        var torneio = await _context.Torneios.FindAsync(id);
        if (torneio == null) return null;

        torneio.Status = "FINALIZADO";
        torneio.DataFim = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToDto(torneio);
    }

    public async Task<TorneioDto?> CancelarTorneioAsync(int id)
    {
        return await UpdateTorneioAsync(id, new UpdateTorneioDto { Status = "CANCELADO" });
    }

    private static TorneioDto MapToDto(Torneio t)
    {
        return new TorneioDto
        {
            Id = t.Id,
            Nome = t.Nome,
            ValorBuyIn = t.ValorBuyIn,
            ValorRebuySimples = t.ValorRebuySimples,
            ValorRebuyDuplo = t.ValorRebuyDuplo,
            ValorAddOn = t.ValorAddOn,
            Status = t.Status,
            DataInicio = t.DataInicio,
            DataFim = t.DataFim,
            Participantes = t.Participantes,
            PremioTotal = t.PremioTotal
        };
    }
}
