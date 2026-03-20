using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Hubs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class CaixaService : ICaixaService
{
    private readonly PokerDbContext _context;
    private readonly ILogger<CaixaService> _logger;
    private readonly IHubContext<PokerHub> _hubContext;

    public CaixaService(PokerDbContext context, ILogger<CaixaService> logger, IHubContext<PokerHub> hubContext)
    {
        _context = context;
        _logger = logger;
        _hubContext = hubContext;
    }

    private async Task NotificarCaixaAsync(string evento, object? payload = null)
    {
        try
        {
            await _hubContext.Clients.All.SendAsync(evento, payload);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Falha ao enviar evento SignalR {Evento}", evento);
        }
    }

    public async Task<List<CaixaDto>> GetAllCaixasAsync()
    {
        var caixas = await _context.Caixas
            .OrderByDescending(c => c.DataAbertura)
            .ToListAsync();

        return caixas.Select(MapToCaixaDto).ToList();
    }

    public async Task<CaixaDetailsDto?> GetCaixaByIdAsync(int id)
    {
        var caixa = await _context.Caixas
            .Include(c => c.Movimentacoes)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (caixa == null)
            return null;

        return MapToCaixaDetailsDto(caixa);
    }

    public async Task<CaixaDto?> GetCaixaAbertoAsync()
    {
        var caixa = await _context.Caixas
            .FirstOrDefaultAsync(c => c.Status == "ABERTO");

        return caixa == null ? null : MapToCaixaDto(caixa);
    }

    public async Task<CaixaDto> AbrirCaixaAsync(CreateCaixaDto dto, string usuarioNome)
    {
        // Verificar se já existe um caixa aberto
        var caixaAberto = await _context.Caixas
            .FirstOrDefaultAsync(c => c.Status == "ABERTO");

        if (caixaAberto != null)
        {
            throw new InvalidOperationException("Já existe um caixa aberto. Feche-o antes de abrir um novo.");
        }

        var caixa = new Caixa
        {
            DataAbertura = DateTime.UtcNow,
            Status = "ABERTO",
            SaldoInicial = dto.SaldoInicial,
            TotalEntradas = 0,
            TotalSaidas = 0,
            UsuarioAbertura = usuarioNome,
            ObservacoesAbertura = dto.ObservacoesAbertura
        };

        _context.Caixas.Add(caixa);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Caixa {CaixaId} aberto por {Usuario}", caixa.Id, usuarioNome);
        await NotificarCaixaAsync("CaixaAberto", MapToCaixaDto(caixa));

        return MapToCaixaDto(caixa);
    }

    public async Task<CaixaDto?> FecharCaixaAsync(int id, FecharCaixaDto dto, string usuarioNome)
    {
        var caixa = await _context.Caixas.FindAsync(id);

        if (caixa == null)
            return null;

        if (caixa.Status == "FECHADO")
        {
            throw new InvalidOperationException("Este caixa já está fechado.");
        }

        caixa.DataFechamento = DateTime.UtcNow;
        caixa.Status = "FECHADO";
        caixa.SaldoFinal = dto.SaldoFinal;
        caixa.UsuarioFechamento = usuarioNome;
        caixa.ObservacoesFechamento = dto.ObservacoesFechamento;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Caixa {CaixaId} fechado por {Usuario}", id, usuarioNome);
        await NotificarCaixaAsync("CaixaFechado", MapToCaixaDto(caixa));

        return MapToCaixaDto(caixa);
    }

    public async Task<bool> AddMovimentacaoAsync(int caixaId, CreateMovimentacaoDto dto, string usuarioNome)
    {
        var caixa = await _context.Caixas.FindAsync(caixaId);

        if (caixa == null || caixa.Status != "ABERTO")
            return false;

        var movimentacao = new MovimentacaoCaixa
        {
            CaixaId = caixaId,
            DataHora = DateTime.UtcNow,
            Tipo = dto.Tipo,
            Categoria = dto.Categoria,
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            ComandaId = dto.ComandaId,
            UsuarioNome = usuarioNome
        };

        // Se tiver comandaId, buscar o nome
        if (dto.ComandaId.HasValue)
        {
            var comanda = await _context.Comandas.FindAsync(dto.ComandaId.Value);
            movimentacao.ComandaNome = comanda?.JogadorNome;
        }

        _context.MovimentacoesCaixa.Add(movimentacao);

        // Atualizar totais do caixa
        if (dto.Tipo == "ENTRADA")
        {
            caixa.TotalEntradas += dto.Valor;
        }
        else
        {
            caixa.TotalSaidas += dto.Valor;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Movimentação {Tipo} de R$ {Valor} adicionada ao caixa {CaixaId}", 
            dto.Tipo, dto.Valor, caixaId);
        await NotificarCaixaAsync("MovimentacaoAdicionada", new { caixaId });

        return true;
    }

    private static CaixaDto MapToCaixaDto(Caixa caixa)
    {
        return new CaixaDto
        {
            Id = caixa.Id,
            DataAbertura = caixa.DataAbertura,
            DataFechamento = caixa.DataFechamento,
            Status = caixa.Status,
            SaldoInicial = caixa.SaldoInicial,
            SaldoFinal = caixa.SaldoFinal,
            TotalEntradas = caixa.TotalEntradas,
            TotalSaidas = caixa.TotalSaidas,
            UsuarioAbertura = caixa.UsuarioAbertura,
            UsuarioFechamento = caixa.UsuarioFechamento,
            ObservacoesAbertura = caixa.ObservacoesAbertura,
            ObservacoesFechamento = caixa.ObservacoesFechamento
        };
    }

    private static CaixaDetailsDto MapToCaixaDetailsDto(Caixa caixa)
    {
        return new CaixaDetailsDto
        {
            Id = caixa.Id,
            DataAbertura = caixa.DataAbertura,
            DataFechamento = caixa.DataFechamento,
            Status = caixa.Status,
            SaldoInicial = caixa.SaldoInicial,
            SaldoFinal = caixa.SaldoFinal,
            TotalEntradas = caixa.TotalEntradas,
            TotalSaidas = caixa.TotalSaidas,
            UsuarioAbertura = caixa.UsuarioAbertura,
            UsuarioFechamento = caixa.UsuarioFechamento,
            ObservacoesAbertura = caixa.ObservacoesAbertura,
            ObservacoesFechamento = caixa.ObservacoesFechamento,
            Movimentacoes = caixa.Movimentacoes.Select(m => new MovimentacaoCaixaDto
            {
                Id = m.Id,
                CaixaId = m.CaixaId,
                DataHora = m.DataHora,
                Tipo = m.Tipo,
                Categoria = m.Categoria,
                Descricao = m.Descricao,
                Valor = m.Valor,
                ComandaId = m.ComandaId,
                ComandaNome = m.ComandaNome,
                FormaPagamento = m.FormaPagamento,
                Desconto = m.Desconto,
                Taxa = m.Taxa,
                UsuarioNome = m.UsuarioNome
            }).OrderByDescending(m => m.DataHora).ToList()
        };
    }
}
