using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class ComandaService : IComandaService
{
    private readonly PokerDbContext _context;

    public ComandaService(PokerDbContext context)
    {
        _context = context;
    }

    public async Task<List<ComandaDto>> GetAllComandasAsync()
    {
        return await _context.Comandas
            .OrderByDescending(c => c.DataAbertura)
            .Select(c => new ComandaDto
            {
                Id = c.Id,
                JogadorNome = c.JogadorNome,
                JogadorFoto = c.JogadorFoto,
                Mesa = c.Mesa,
                Tipo = c.Tipo.ToString(),
                TorneioId = c.TorneioId,
                TorneioNome = c.TorneioNome,
                ValorFichas = c.ValorFichas,
                ValorBebidas = c.ValorBebidas,
                ValorTotal = c.ValorTotal,
                Status = c.Status.ToString(),
                DataAbertura = c.DataAbertura,
                DataFechamento = c.DataFechamento
            })
            .ToListAsync();
    }

    public async Task<ComandaDetailsDto?> GetComandaByIdAsync(int id)
    {
        var comanda = await _context.Comandas
            .Include(c => c.Itens)
            .ThenInclude(i => i.Produto)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (comanda == null) return null;

        return new ComandaDetailsDto
        {
            Id = comanda.Id,
            JogadorNome = comanda.JogadorNome,
            JogadorFoto = comanda.JogadorFoto,
            Mesa = comanda.Mesa,
            Tipo = comanda.Tipo.ToString(),
            TorneioId = comanda.TorneioId,
            TorneioNome = comanda.TorneioNome,
            ValorFichas = comanda.ValorFichas,
            ValorBebidas = comanda.ValorBebidas,
            ValorTotal = comanda.ValorTotal,
            Status = comanda.Status.ToString(),
            DataAbertura = comanda.DataAbertura,
            DataFechamento = comanda.DataFechamento,
            Itens = comanda.Itens.Select(i => new ItemComandaDto
            {
                Id = i.Id,
                ProdutoId = i.ProdutoId,
                ProdutoNome = i.Produto?.Nome ?? "",
                Quantidade = i.Quantidade,
                ValorUnitario = i.ValorUnitario,
                ValorTotal = i.ValorTotal
            }).ToList()
        };
    }

    public async Task<ComandaDto> CreateComandaAsync(CreateComandaDto createComandaDto)
    {
        // Converter string para enum
        TipoComanda tipoEnum;
        if (!Enum.TryParse<TipoComanda>(createComandaDto.Tipo, true, out tipoEnum))
        {
            tipoEnum = TipoComanda.TORNEIO; // Valor padrão
        }

        var comanda = new Comanda
        {
            JogadorNome = createComandaDto.JogadorNome,
            Mesa = createComandaDto.Mesa,
            Tipo = tipoEnum,
            TorneioId = createComandaDto.TorneioId,
            TorneioNome = createComandaDto.TorneioNome,
            ValorFichas = createComandaDto.ValorFichas ?? 0,
            ValorBebidas = 0,
            Status = StatusComanda.ATIVO,
            DataAbertura = DateTime.UtcNow
        };

        _context.Comandas.Add(comanda);
        await _context.SaveChangesAsync();

        return new ComandaDto
        {
            Id = comanda.Id,
            JogadorNome = comanda.JogadorNome,
            JogadorFoto = comanda.JogadorFoto,
            Mesa = comanda.Mesa,
            Tipo = comanda.Tipo.ToString(),
            ValorFichas = comanda.ValorFichas,
            ValorBebidas = comanda.ValorBebidas,
            ValorTotal = comanda.ValorTotal,
            Status = comanda.Status.ToString(),
            DataAbertura = comanda.DataAbertura
        };
    }

    public async Task<ComandaDto?> UpdateComandaAsync(int id, UpdateComandaDto updateComandaDto)
    {
        var comanda = await _context.Comandas.FindAsync(id);
        if (comanda == null) return null;

        if (updateComandaDto.ValorFichas.HasValue)
            comanda.ValorFichas = updateComandaDto.ValorFichas.Value;

        if (updateComandaDto.ValorBebidas.HasValue)
            comanda.ValorBebidas = updateComandaDto.ValorBebidas.Value;

        if (updateComandaDto.Status.HasValue)
        {
            comanda.Status = updateComandaDto.Status.Value;
            if (comanda.Status == StatusComanda.FECHADO)
                comanda.DataFechamento = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return new ComandaDto
        {
            Id = comanda.Id,
            JogadorNome = comanda.JogadorNome,
            JogadorFoto = comanda.JogadorFoto,
            Mesa = comanda.Mesa,
            Tipo = comanda.Tipo.ToString(),
            ValorFichas = comanda.ValorFichas,
            ValorBebidas = comanda.ValorBebidas,
            ValorTotal = comanda.ValorTotal,
            Status = comanda.Status.ToString(),
            DataAbertura = comanda.DataAbertura,
            DataFechamento = comanda.DataFechamento
        };
    }

    public async Task<ComandaDto?> FecharComandaAsync(int id)
    {
        return await UpdateComandaAsync(id, new UpdateComandaDto
        {
            Status = StatusComanda.FECHADO
        });
    }

    public async Task<bool> DeleteComandaAsync(int id)
    {
        var comanda = await _context.Comandas.FindAsync(id);
        if (comanda == null) return false;

        _context.Comandas.Remove(comanda);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddItemToComandaAsync(int comandaId, AddItemComandaDto addItemDto)
    {
        var comanda = await _context.Comandas.FindAsync(comandaId);
        if (comanda == null) return false;

        var produto = await _context.Produtos.FindAsync(addItemDto.ProdutoId);
        if (produto == null || !produto.Ativo) return false;

        if (produto.Estoque < addItemDto.Quantidade) return false;

        var item = new ItemComanda
        {
            ComandaId = comandaId,
            ProdutoId = addItemDto.ProdutoId,
            Quantidade = addItemDto.Quantidade,
            ValorUnitario = produto.Preco
        };

        _context.ItensComanda.Add(item);
        produto.Estoque -= addItemDto.Quantidade;

        // Atualizar valores da comanda
        if (produto.Categoria == CategoriaProduto.BEBIDA)
            comanda.ValorBebidas += item.ValorTotal;
        else
            comanda.ValorFichas += item.ValorTotal;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var comandasAbertas = await _context.Comandas
            .Where(c => c.Status == StatusComanda.ATIVO)
            .ToListAsync();

        return new DashboardStatsDto
        {
            ComandasAbertas = comandasAbertas.Count,
            TotalFichas = comandasAbertas.Sum(c => c.ValorFichas),
            TotalBebidas = comandasAbertas.Sum(c => c.ValorBebidas),
            FaturamentoTotal = comandasAbertas.Sum(c => c.ValorTotal)
        };
    }
}
