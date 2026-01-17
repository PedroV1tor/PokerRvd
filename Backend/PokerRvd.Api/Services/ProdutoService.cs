using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Data;
using PokerRvd.Api.DTOs;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Services;

public class ProdutoService : IProdutoService
{
    private readonly PokerDbContext _context;

    public ProdutoService(PokerDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProdutoDto>> GetAllProdutosAsync()
    {
        var produtos = await _context.Produtos
            .Where(p => p.Ativo)
            .OrderBy(p => p.Nome)
            .ToListAsync();

        return produtos.Select(p => new ProdutoDto
        {
            Id = p.Id,
            Nome = p.Nome,
            ValorCusto = p.ValorCusto,
            ValorComercial = p.ValorComercial,
            QuantidadeEstoque = p.QuantidadeEstoque,
            UnidadeVenda = p.UnidadeVenda,
            Ativo = p.Ativo,
            DataCadastro = p.DataCadastro
        }).ToList();
    }

    public async Task<ProdutoDto?> GetProdutoByIdAsync(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null) return null;

        return new ProdutoDto
        {
            Id = produto.Id,
            Nome = produto.Nome,
            ValorCusto = produto.ValorCusto,
            ValorComercial = produto.ValorComercial,
            QuantidadeEstoque = produto.QuantidadeEstoque,
            UnidadeVenda = produto.UnidadeVenda,
            Ativo = produto.Ativo,
            DataCadastro = produto.DataCadastro
        };
    }

    public async Task<ProdutoDto> CreateProdutoAsync(CreateProdutoDto dto)
    {
        var produto = new Produto
        {
            Nome = dto.Nome,
            ValorCusto = dto.ValorCusto,
            ValorComercial = dto.ValorComercial,
            QuantidadeEstoque = dto.QuantidadeEstoque,
            UnidadeVenda = dto.UnidadeVenda,
            Ativo = true,
            DataCadastro = DateTime.UtcNow
        };

        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();

        return new ProdutoDto
        {
            Id = produto.Id,
            Nome = produto.Nome,
            ValorCusto = produto.ValorCusto,
            ValorComercial = produto.ValorComercial,
            QuantidadeEstoque = produto.QuantidadeEstoque,
            UnidadeVenda = produto.UnidadeVenda,
            Ativo = produto.Ativo,
            DataCadastro = produto.DataCadastro
        };
    }

    public async Task<ProdutoDto?> UpdateProdutoAsync(int id, UpdateProdutoDto dto)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null) return null;

        produto.Nome = dto.Nome;
        produto.ValorCusto = dto.ValorCusto;
        produto.ValorComercial = dto.ValorComercial;
        produto.QuantidadeEstoque = dto.QuantidadeEstoque;
        produto.UnidadeVenda = dto.UnidadeVenda;
        produto.Ativo = dto.Ativo;

        await _context.SaveChangesAsync();

        return new ProdutoDto
        {
            Id = produto.Id,
            Nome = produto.Nome,
            ValorCusto = produto.ValorCusto,
            ValorComercial = produto.ValorComercial,
            QuantidadeEstoque = produto.QuantidadeEstoque,
            UnidadeVenda = produto.UnidadeVenda,
            Ativo = produto.Ativo,
            DataCadastro = produto.DataCadastro
        };
    }

    public async Task<bool> DeleteProdutoAsync(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null) return false;

        produto.Ativo = false; // Soft delete
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> AtualizarEstoqueAsync(int id, int quantidade)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null) return false;

        produto.QuantidadeEstoque += quantidade;
        await _context.SaveChangesAsync();
        return true;
    }
}
