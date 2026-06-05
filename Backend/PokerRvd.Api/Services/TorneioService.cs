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
            ValorRebuyTriplo = dto.ValorRebuyTriplo,
            ValorAddOn = dto.ValorAddOn,
            ValorAddOnDuplo = dto.ValorAddOnDuplo,
            ValorBuyIn2 = dto.ValorBuyIn2,
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
        if (dto.ValorRebuyTriplo.HasValue) torneio.ValorRebuyTriplo = dto.ValorRebuyTriplo.Value;
        if (dto.ValorAddOn.HasValue) torneio.ValorAddOn = dto.ValorAddOn.Value;
        if (dto.ValorAddOnDuplo.HasValue) torneio.ValorAddOnDuplo = dto.ValorAddOnDuplo.Value;
        if (dto.ValorBuyIn2.HasValue) torneio.ValorBuyIn2 = dto.ValorBuyIn2.Value;
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

    public async Task<TorneioStatsDto?> GetEstatisticasAsync(int id)
    {
        var torneio = await _context.Torneios.FindAsync(id);
        if (torneio == null) return null;

        var itens = await _context.ItensComanda
            .Where(i => i.Comanda!.TorneioId == id)
            .ToListAsync();

        var qtdBuyIn       = itens.Count(i => i.NomeCustomizado != null && i.NomeCustomizado.StartsWith("Buy-in",      StringComparison.OrdinalIgnoreCase) && !i.NomeCustomizado.StartsWith("Buy-in 2", StringComparison.OrdinalIgnoreCase));
        var qtdBuyIn2      = itens.Count(i => i.NomeCustomizado != null && i.NomeCustomizado.StartsWith("Buy-in 2",    StringComparison.OrdinalIgnoreCase));
        var qtdRebuySimp   = itens.Count(i => i.NomeCustomizado != null && i.NomeCustomizado.StartsWith("Re-buy Simples", StringComparison.OrdinalIgnoreCase));
        var qtdRebuyDuplo  = itens.Count(i => i.NomeCustomizado != null && i.NomeCustomizado.StartsWith("Re-buy Duplo",   StringComparison.OrdinalIgnoreCase));
        var qtdRebuyTriplo = itens.Count(i => i.NomeCustomizado != null && i.NomeCustomizado.StartsWith("Re-buy Triplo",  StringComparison.OrdinalIgnoreCase));
        var qtdAddOn       = itens.Count(i => i.NomeCustomizado != null && i.NomeCustomizado.StartsWith("Add-on",        StringComparison.OrdinalIgnoreCase) && !i.NomeCustomizado.StartsWith("Add-on Duplo", StringComparison.OrdinalIgnoreCase));
        var qtdAddOnDuplo  = itens.Count(i => i.NomeCustomizado != null && i.NomeCustomizado.StartsWith("Add-on Duplo",  StringComparison.OrdinalIgnoreCase));

        var totalJogadores = await _context.Comandas
            .Where(c => c.TorneioId == id)
            .CountAsync();

        var totalBebidas = await _context.Comandas
            .Where(c => c.TorneioId == id && c.Status == StatusComanda.FECHADO)
            .SumAsync(c => c.ValorBebidas);

        var totalPremiacao = await _context.MovimentacoesCaixa
            .Where(m => m.TorneioId == id && m.Categoria == "Premiação")
            .SumAsync(m => m.Valor);

        var totalPgtoFuncionarios = await _context.MovimentacoesCaixa
            .Where(m => m.TorneioId == id && m.Categoria == "Pgto Funcionários")
            .SumAsync(m => m.Valor);

        return new TorneioStatsDto
        {
            TorneioId              = id,
            TorneioNome            = torneio.Nome,
            TotalJogadores         = totalJogadores,
            QtdBuyIn               = qtdBuyIn,
            ValorTotalBuyIn        = qtdBuyIn * torneio.ValorBuyIn,
            QtdRebuySimples        = qtdRebuySimp,
            ValorTotalRebuySimples = qtdRebuySimp * torneio.ValorRebuySimples,
            QtdRebuyDuplo          = qtdRebuyDuplo,
            ValorTotalRebuyDuplo   = qtdRebuyDuplo * torneio.ValorRebuyDuplo,
            QtdRebuyTriplo         = qtdRebuyTriplo,
            ValorTotalRebuyTriplo  = qtdRebuyTriplo * torneio.ValorRebuyTriplo,
            QtdAddOn               = qtdAddOn,
            ValorTotalAddOn        = qtdAddOn * torneio.ValorAddOn,
            QtdAddOnDuplo          = qtdAddOnDuplo,
            ValorTotalAddOnDuplo   = qtdAddOnDuplo * torneio.ValorAddOnDuplo,
            QtdBuyIn2              = qtdBuyIn2,
            ValorTotalBuyIn2       = qtdBuyIn2 * torneio.ValorBuyIn2,
            TotalArrecadado        = (qtdBuyIn * torneio.ValorBuyIn)
                                   + (qtdRebuySimp * torneio.ValorRebuySimples)
                                   + (qtdRebuyDuplo * torneio.ValorRebuyDuplo)
                                   + (qtdRebuyTriplo * torneio.ValorRebuyTriplo)
                                   + (qtdAddOn * torneio.ValorAddOn)
                                   + (qtdAddOnDuplo * torneio.ValorAddOnDuplo)
                                   + (qtdBuyIn2 * torneio.ValorBuyIn2),
            TotalBebidas           = totalBebidas,
            TotalPremiacao         = totalPremiacao,
            TotalPgtoFuncionarios  = totalPgtoFuncionarios
        };
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
            ValorRebuyTriplo = t.ValorRebuyTriplo,
            ValorAddOn = t.ValorAddOn,
            ValorAddOnDuplo = t.ValorAddOnDuplo,
            ValorBuyIn2 = t.ValorBuyIn2,
            Status = t.Status,
            DataInicio = t.DataInicio,
            DataFim = t.DataFim,
            Participantes = t.Participantes,
            PremioTotal = t.PremioTotal
        };
    }
}
