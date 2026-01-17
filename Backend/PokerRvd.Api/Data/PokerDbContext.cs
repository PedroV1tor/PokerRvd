using Microsoft.EntityFrameworkCore;
using PokerRvd.Api.Models;

namespace PokerRvd.Api.Data;

public class PokerDbContext : DbContext
{
    public PokerDbContext(DbContextOptions<PokerDbContext> options) : base(options)
    {
    }

    public DbSet<Player> Players { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Comanda> Comandas { get; set; }
    public DbSet<ItemComanda> ItensComanda { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações adicionais do modelo
        modelBuilder.Entity<Player>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Balance).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Game>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.BuyIn).HasPrecision(18, 2);
        });

        // Seed data para desenvolvimento
        modelBuilder.Entity<Player>().HasData(
            new Player { Id = 1, Name = "Jogador 1", Email = "jogador1@poker.com", Balance = 1000, CreatedAt = DateTime.UtcNow },
            new Player { Id = 2, Name = "Jogador 2", Email = "jogador2@poker.com", Balance = 1500, CreatedAt = DateTime.UtcNow }
        );

        modelBuilder.Entity<Game>().HasData(
            new Game { Id = 1, Name = "Mesa Principal", BuyIn = 100, MaxPlayers = 9, Status = GameStatus.Waiting, CreatedAt = DateTime.UtcNow }
        );

        // Configurações para Comandas
        modelBuilder.Entity<Comanda>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.JogadorNome).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Mesa).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TorneioNome).HasMaxLength(200);
            entity.Property(e => e.ValorFichas).HasPrecision(18, 2);
            entity.Property(e => e.ValorBebidas).HasPrecision(18, 2);
            entity.Ignore(e => e.ValorTotal);
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

        // Seed data para Produtos
        modelBuilder.Entity<Produto>().HasData(
            new Produto { Id = 1, Nome = "Cerveja", ValorCusto = 6.00m, ValorComercial = 10.00m, QuantidadeEstoque = 100, UnidadeVenda = "Unidade", Ativo = true, DataCadastro = DateTime.UtcNow },
            new Produto { Id = 2, Nome = "Refrigerante", ValorCusto = 4.00m, ValorComercial = 7.00m, QuantidadeEstoque = 80, UnidadeVenda = "Unidade", Ativo = true, DataCadastro = DateTime.UtcNow },
            new Produto { Id = 3, Nome = "Água", ValorCusto = 2.50m, ValorComercial = 5.00m, QuantidadeEstoque = 150, UnidadeVenda = "Unidade", Ativo = true, DataCadastro = DateTime.UtcNow },
            new Produto { Id = 4, Nome = "Porção de Batata", ValorCusto = 15.00m, ValorComercial = 25.00m, QuantidadeEstoque = 30, UnidadeVenda = "Porção", Ativo = true, DataCadastro = DateTime.UtcNow },
            new Produto { Id = 5, Nome = "Sanduíche", ValorCusto = 8.00m, ValorComercial = 15.00m, QuantidadeEstoque = 40, UnidadeVenda = "Unidade", Ativo = true, DataCadastro = DateTime.UtcNow }
        );

        // Seed data para Comandas
        modelBuilder.Entity<Comanda>().HasData(
            new Comanda
            {
                Id = 1,
                JogadorNome = "João Silva",
                Mesa = "Mesa 5",
                Tipo = TipoComanda.TORNEIO,
                ValorFichas = 332.00m,
                ValorBebidas = 0,
                Status = StatusComanda.ATIVO,
                DataAbertura = DateTime.UtcNow
            },
            new Comanda
            {
                Id = 2,
                JogadorNome = "Maria Santos",
                Mesa = "Mesa 2",
                Tipo = TipoComanda.CASH,
                ValorFichas = 555.00m,
                ValorBebidas = 0,
                Status = StatusComanda.ATIVO,
                DataAbertura = DateTime.UtcNow
            },
            new Comanda
            {
                Id = 3,
                JogadorNome = "Pedro Costa",
                Mesa = "Bar",
                Tipo = TipoComanda.BAR,
                ValorFichas = 0,
                ValorBebidas = 61.00m,
                Status = StatusComanda.ATIVO,
                DataAbertura = DateTime.UtcNow
            },
            new Comanda
            {
                Id = 4,
                JogadorNome = "Ana Oliveira",
                Mesa = "Mesa 3",
                Tipo = TipoComanda.TORNEIO,
                ValorFichas = 220.90m,
                ValorBebidas = 0,
                Status = StatusComanda.FECHADO,
                DataAbertura = DateTime.UtcNow.AddHours(-2),
                DataFechamento = DateTime.UtcNow
            }
        );

        // Seed data para Usuários (senha padrão: "Admin123" para admin, "Senha123" para outros)
        modelBuilder.Entity<Usuario>().HasData(
            new Usuario
            {
                Id = 1,
                Nome = "Administrador",
                Email = "admin@pokerrvd.com",
                SenhaHash = "nxVhJ8mHRVPQOqKFAc/IH8WzFDxBLy4aTgHNZrg3lRo=", // Admin123
                Role = UserRole.ADMIN,
                Ativo = true,
                DataCadastro = DateTime.UtcNow
            },
            new Usuario
            {
                Id = 2,
                Nome = "Gerente Teste",
                Email = "gerente@pokerrvd.com",
                SenhaHash = "g76l+wqJm3oqBPLjjyLqHGVX4SN1aMB5w+QV7gJ8FwM=", // Senha123
                Role = UserRole.GERENTE,
                Ativo = true,
                DataCadastro = DateTime.UtcNow
            },
            new Usuario
            {
                Id = 3,
                Nome = "Atendente Teste",
                Email = "atendente@pokerrvd.com",
                SenhaHash = "g76l+wqJm3oqBPLjjyLqHGVX4SN1aMB5w+QV7gJ8FwM=", // Senha123
                Role = UserRole.ATENDENTE,
                Ativo = true,
                DataCadastro = DateTime.UtcNow
            }
        );
    }
}
