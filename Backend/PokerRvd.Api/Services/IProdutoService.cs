using PokerRvd.Api.DTOs;

namespace PokerRvd.Api.Services;

public interface IProdutoService
{
    Task<List<ProdutoDto>> GetAllProdutosAsync();
    Task<ProdutoDto?> GetProdutoByIdAsync(int id);
    Task<ProdutoDto> CreateProdutoAsync(CreateProdutoDto dto);
    Task<ProdutoDto?> UpdateProdutoAsync(int id, UpdateProdutoDto dto);
    Task<bool> DeleteProdutoAsync(int id);
    Task<bool> AtualizarEstoqueAsync(int id, int quantidade);
}
