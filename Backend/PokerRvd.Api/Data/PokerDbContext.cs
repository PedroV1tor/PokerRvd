using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Data;

public class PokerDbContext : DbContext
{
    public PokerDbContext(DbContextOptions<PokerDbContext> options) : base(options)
    {
    }

    public DbSet<Comanda> Comandas { get; set; }
    public DbSet<ItemComanda> ItensComanda { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Caixa> Caixas { get; set; }
    public DbSet<MovimentacaoCaixa> MovimentacoesCaixa { get; set; }
    public DbSet<Torneio> Torneios { get; set; }
    public DbSet<ConferenciaCaixa> ConferenciasCaixa { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações para Comandas
        modelBuilder.Entity<Comanda>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.JogadorNome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Mesa).IsRequired(false).HasMaxLength(50);
            entity.Property(e => e.TorneioNome).HasMaxLength(200);
            entity.Property(e => e.ValorFichas).HasPrecision(18, 2);
            entity.Property(e => e.ValorBebidas).HasPrecision(18, 2);
            entity.Property(e => e.ValorPago).HasPrecision(18, 2);
            entity.Ignore(e => e.ValorTotal);
            entity.Ignore(e => e.ValorRestante);
            entity.Property(e => e.CaixaId);
            entity.HasMany(e => e.Itens).WithOne(i => i.Comanda).HasForeignKey(i => i.ComandaId);
        });

        modelBuilder.Entity<ItemComanda>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ValorUnitario).HasPrecision(18, 2);
            entity.Property(e => e.NomeCustomizado).HasMaxLength(100);
            entity.Ignore(e => e.ValorTotal);
        });

        modelBuilder.Entity<Produto>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ValorCusto).HasPrecision(18, 2);
            entity.Property(e => e.ValorComercial).HasPrecision(18, 2);
            entity.Property(e => e.UnidadeVenda).IsRequired().HasMaxLength(50);
        });

        // Configurações para Usuários
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.SenhaHash).IsRequired();
        });

        // Configurações para Caixas
        modelBuilder.Entity<Caixa>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SaldoInicial).HasPrecision(18, 2);
            entity.Property(e => e.SaldoFinal).HasPrecision(18, 2);
            entity.Property(e => e.TotalEntradas).HasPrecision(18, 2);
            entity.Property(e => e.TotalSaidas).HasPrecision(18, 2);
            entity.HasMany(e => e.Movimentacoes).WithOne(m => m.Caixa).HasForeignKey(m => m.CaixaId);
        });

        modelBuilder.Entity<MovimentacaoCaixa>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Valor).HasPrecision(18, 2);
            entity.Property(e => e.Categoria).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descricao).IsRequired().HasMaxLength(500);
            entity.Property(e => e.FormaPagamento).HasMaxLength(50);
            entity.Property(e => e.Desconto).HasPrecision(18, 2);
            entity.Property(e => e.Taxa).HasPrecision(18, 2);
            entity.Property(e => e.TorneioNome).HasMaxLength(200);
        });

        modelBuilder.Entity<Torneio>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nome).IsRequired().HasMaxLength(200);
            entity.Property(e => e.ValorBuyIn).HasPrecision(18, 2);
            entity.Property(e => e.ValorRebuySimples).HasPrecision(18, 2);
            entity.Property(e => e.ValorRebuyDuplo).HasPrecision(18, 2);
            entity.Property(e => e.ValorAddOn).HasPrecision(18, 2);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PremioTotal).HasPrecision(18, 2);
        });

        // Configurações para Conferência de Caixa
        modelBuilder.Entity<ConferenciaCaixa>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Rake).HasPrecision(18, 2);
            entity.Property(e => e.Caixinhas).HasPrecision(18, 2);
            entity.Property(e => e.Bonus).HasPrecision(18, 2);
            entity.Property(e => e.Defesas).HasPrecision(18, 2);
            entity.Property(e => e.DespesasPagas).HasPrecision(18, 2);
            entity.Property(e => e.Percas).HasPrecision(18, 2);
            entity.Property(e => e.PgtoCartao).HasPrecision(18, 2);
            entity.Property(e => e.AReceber).HasPrecision(18, 2);
            entity.Property(e => e.SaldoConta).HasPrecision(18, 2);
            entity.Property(e => e.Observacao).HasMaxLength(1000);
            entity.Ignore(e => e.SaldoDia);
            entity.Ignore(e => e.TotalCreditos);
            entity.Ignore(e => e.Diferenca);
        });

    }
}
