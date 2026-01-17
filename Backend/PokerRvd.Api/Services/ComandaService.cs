using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class ComandaService : IComandaService
{
    private readonly PokerDbContext _context;
    private readonly ILogger<ComandaService> _logger;

    public ComandaService(PokerDbContext context, ILogger<ComandaService> logger)
    {
        _context = context;
        _logger = logger;
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
            .FirstOrDefaultAsync(c => c.Id == id);
        
        if (comanda == null) return null;
        
        // Carregar produtos separadamente para itens que têm ProdutoId
        foreach (var item in comanda.Itens.Where(i => i.ProdutoId.HasValue))
        {
            await _context.Entry(item).Reference(i => i.Produto).LoadAsync();
        }

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
                ProdutoId = i.ProdutoId ?? 0,
                ProdutoNome = i.Produto?.Nome ?? i.NomeCustomizado ?? "",
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
        var comanda = await _context.Comandas
            .Include(c => c.Itens)
            .FirstOrDefaultAsync(c => c.Id == id);
        
        if (comanda == null) return null;
        
        // Carregar produtos separadamente para itens que têm ProdutoId
        foreach (var item in comanda.Itens.Where(i => i.ProdutoId.HasValue))
        {
            await _context.Entry(item).Reference(i => i.Produto).LoadAsync();
        }

        // Descontar produtos do estoque ao fechar a comanda
        foreach (var item in comanda.Itens)
        {
            if (item.Produto != null)
            {
                // Verificar se há estoque suficiente
                if (item.Produto.QuantidadeEstoque < item.Quantidade)
                {
                    throw new InvalidOperationException(
                        $"Estoque insuficiente para o produto '{item.Produto.Nome}'. " +
                        $"Disponível: {item.Produto.QuantidadeEstoque}, Necessário: {item.Quantidade}"
                    );
                }

                // Descontar do estoque
                item.Produto.QuantidadeEstoque -= item.Quantidade;
            }
        }

        // Atualizar status para fechado
        comanda.Status = StatusComanda.FECHADO;
        comanda.DataFechamento = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetComandaByIdAsync(id);
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

        // Verificar se há estoque suficiente (sem descontar ainda)
        if (produto.QuantidadeEstoque < addItemDto.Quantidade) return false;

        var item = new ItemComanda
        {
            ComandaId = comandaId,
            ProdutoId = addItemDto.ProdutoId,
            Quantidade = addItemDto.Quantidade,
            ValorUnitario = produto.ValorComercial
        };

        _context.ItensComanda.Add(item);

        // Atualizar valores da comanda (produtos vão para bebidas)
        comanda.ValorBebidas += item.ValorTotal;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AddItemFichasAsync(int comandaId, AddItemFichasDto addItemDto)
    {
        _logger.LogInformation("AddItemFichasAsync: ComandaId={ComandaId}, Nome={Nome}, Valor={Valor}", 
            comandaId, addItemDto.Nome, addItemDto.Valor);

        var comanda = await _context.Comandas.FindAsync(comandaId);
        if (comanda == null)
        {
            _logger.LogWarning("Comanda {ComandaId} não encontrada", comandaId);
            return false;
        }

        _logger.LogInformation("Comanda encontrada: {ComandaId}, Status: {Status}, ValorFichas atual: {ValorFichas}", 
            comanda.Id, comanda.Status, comanda.ValorFichas);

        var item = new ItemComanda
        {
            ComandaId = comandaId,
            ProdutoId = null, // Item de fichas não tem produto
            Produto = null,
            NomeCustomizado = addItemDto.Nome, // Nome customizado (Buy-in, Re-buy, etc)
            Quantidade = 1,
            ValorUnitario = addItemDto.Valor
        };

        _context.ItensComanda.Add(item);

        // Atualizar valores da comanda (fichas vão para ValorFichas)
        comanda.ValorFichas += addItemDto.Valor;

        _logger.LogInformation("Salvando item de fichas. Novo ValorFichas: {ValorFichas}", comanda.ValorFichas);

        await _context.SaveChangesAsync();
        
        _logger.LogInformation("Item de fichas salvo com sucesso");
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
