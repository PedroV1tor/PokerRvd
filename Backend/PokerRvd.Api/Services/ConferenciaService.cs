using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class ConferenciaService : IConferenciaService
{
    private readonly PokerDbContext _context;

    public ConferenciaService(PokerDbContext context)
    {
        _context = context;
    }

    public async Task<List<ConferenciaDto>> GetAllAsync()
    {
        var items = await _context.ConferenciasCaixa
            .OrderByDescending(c => c.Dia)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<ConferenciaDto?> GetByIdAsync(int id)
    {
        var item = await _context.ConferenciasCaixa.FindAsync(id);
        return item == null ? null : MapToDto(item);
    }

    public async Task<ConferenciaDto> CreateAsync(CreateConferenciaDto dto)
    {
        var entity = new ConferenciaCaixa
        {
            Dia = dto.Dia.ToUniversalTime(),
            Rake = dto.Rake,
            Caixinhas = dto.Caixinhas,
            Bonus = dto.Bonus,
            Defesas = dto.Defesas,
            DespesasPagas = dto.DespesasPagas,
            Percas = dto.Percas,
            PgtoCartao = dto.PgtoCartao,
            AReceber = dto.AReceber,
            SaldoConta = dto.SaldoConta,
            Observacao = dto.Observacao
        };

        _context.ConferenciasCaixa.Add(entity);
        await _context.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task<ConferenciaDto?> UpdateAsync(int id, UpdateConferenciaDto dto)
    {
        var entity = await _context.ConferenciasCaixa.FindAsync(id);
        if (entity == null) return null;

        if (dto.Dia.HasValue) entity.Dia = dto.Dia.Value.ToUniversalTime();
        if (dto.Rake.HasValue) entity.Rake = dto.Rake.Value;
        if (dto.Caixinhas.HasValue) entity.Caixinhas = dto.Caixinhas.Value;
        if (dto.Bonus.HasValue) entity.Bonus = dto.Bonus.Value;
        if (dto.Defesas.HasValue) entity.Defesas = dto.Defesas.Value;
        if (dto.DespesasPagas.HasValue) entity.DespesasPagas = dto.DespesasPagas.Value;
        if (dto.Percas.HasValue) entity.Percas = dto.Percas.Value;
        if (dto.PgtoCartao.HasValue) entity.PgtoCartao = dto.PgtoCartao.Value;
        if (dto.AReceber.HasValue) entity.AReceber = dto.AReceber.Value;
        if (dto.SaldoConta.HasValue) entity.SaldoConta = dto.SaldoConta.Value;
        entity.Observacao = dto.Observacao;

        await _context.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.ConferenciasCaixa.FindAsync(id);
        if (entity == null) return false;

        _context.ConferenciasCaixa.Remove(entity);
        await _context.SaveChangesAsync();

        return true;
    }

    private static ConferenciaDto MapToDto(ConferenciaCaixa entity)
    {
        return new ConferenciaDto
        {
            Id = entity.Id,
            Dia = entity.Dia,
            Rake = entity.Rake,
            Caixinhas = entity.Caixinhas,
            Bonus = entity.Bonus,
            Defesas = entity.Defesas,
            DespesasPagas = entity.DespesasPagas,
            Percas = entity.Percas,
            SaldoDia = entity.SaldoDia,
            PgtoCartao = entity.PgtoCartao,
            AReceber = entity.AReceber,
            SaldoConta = entity.SaldoConta,
            TotalCreditos = entity.TotalCreditos,
            Diferenca = entity.Diferenca,
            Observacao = entity.Observacao
        };
    }
}
