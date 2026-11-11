using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokerRvd.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddPermissoesPorBotao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PermissaoAbrirCaixa",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoAddOnComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoAdicionarBebidaComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoAlterarStatusComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoBuyInComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoCriarCategoriaCaixa",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoCriarComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoCriarFuncionario",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoCriarTorneio",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoDesativarFuncionario",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoEditarConferencia",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoEditarFuncionario",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoEditarPostagem",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoEditarProduto",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoEditarTorneioAgenda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoExcluirConferencia",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoExcluirPostagem",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoExcluirProduto",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoExcluirTorneio",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoExcluirTorneioAgenda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoFecharCaixa",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoFichasComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoFinalizarTorneio",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoIniciarTorneio",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoNovaConferencia",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoNovaMovimentacaoCaixa",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoNovaPostagem",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoNovoTorneioAgenda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoPagamentoParcialComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoPublicarPostagem",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoQuitarPendenciaCaixa",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoRebuyComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoSalvarConferencia",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoVerCaixa",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermissaoVerComanda",
                table: "Usuarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            // Quem já tinha a seção continua com todos os botões dela: nada muda no deploy
            migrationBuilder.Sql(@"
                UPDATE ""Usuarios"" SET
                    ""PermissaoCriarComanda"" = ""PermissaoComandas"",
                    ""PermissaoAlterarStatusComanda"" = ""PermissaoComandas"",
                    ""PermissaoVerComanda"" = ""PermissaoComandas"",
                    ""PermissaoAdicionarBebidaComanda"" = ""PermissaoComandas"",
                    ""PermissaoBuyInComanda"" = ""PermissaoComandas"",
                    ""PermissaoRebuyComanda"" = ""PermissaoComandas"",
                    ""PermissaoAddOnComanda"" = ""PermissaoComandas"",
                    ""PermissaoFichasComanda"" = ""PermissaoComandas"",
                    ""PermissaoPagamentoParcialComanda"" = ""PermissaoComandas"",
                    ""PermissaoCriarTorneio"" = ""PermissaoTorneios"",
                    ""PermissaoIniciarTorneio"" = ""PermissaoTorneios"",
                    ""PermissaoFinalizarTorneio"" = ""PermissaoTorneios"",
                    ""PermissaoExcluirTorneio"" = ""PermissaoTorneios"",
                    ""PermissaoEditarProduto"" = ""PermissaoProdutos"",
                    ""PermissaoExcluirProduto"" = ""PermissaoProdutos"",
                    ""PermissaoCriarFuncionario"" = ""PermissaoFuncionarios"",
                    ""PermissaoEditarFuncionario"" = ""PermissaoFuncionarios"",
                    ""PermissaoDesativarFuncionario"" = ""PermissaoFuncionarios"",
                    ""PermissaoAbrirCaixa"" = ""PermissaoCaixas"",
                    ""PermissaoVerCaixa"" = ""PermissaoCaixas"",
                    ""PermissaoNovaMovimentacaoCaixa"" = ""PermissaoCaixas"",
                    ""PermissaoCriarCategoriaCaixa"" = ""PermissaoCaixas"",
                    ""PermissaoFecharCaixa"" = ""PermissaoCaixas"",
                    ""PermissaoQuitarPendenciaCaixa"" = ""PermissaoCaixas"",
                    ""PermissaoNovaConferencia"" = ""PermissaoConferencia"",
                    ""PermissaoSalvarConferencia"" = ""PermissaoConferencia"",
                    ""PermissaoEditarConferencia"" = ""PermissaoConferencia"",
                    ""PermissaoExcluirConferencia"" = ""PermissaoConferencia"",
                    ""PermissaoNovaPostagem"" = ""PermissaoConteudo"",
                    ""PermissaoEditarPostagem"" = ""PermissaoConteudo"",
                    ""PermissaoPublicarPostagem"" = ""PermissaoConteudo"",
                    ""PermissaoExcluirPostagem"" = ""PermissaoConteudo"",
                    ""PermissaoNovoTorneioAgenda"" = ""PermissaoConteudo"",
                    ""PermissaoEditarTorneioAgenda"" = ""PermissaoConteudo"",
                    ""PermissaoExcluirTorneioAgenda"" = ""PermissaoConteudo"";
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermissaoAbrirCaixa",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoAddOnComanda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoAdicionarBebidaComanda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoAlterarStatusComanda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoBuyInComanda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoCriarCategoriaCaixa",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoCriarComanda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoCriarFuncionario",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoCriarTorneio",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoDesativarFuncionario",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoEditarConferencia",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoEditarFuncionario",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoEditarPostagem",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoEditarProduto",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoEditarTorneioAgenda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoExcluirConferencia",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoExcluirPostagem",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoExcluirProduto",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoExcluirTorneio",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoExcluirTorneioAgenda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoFecharCaixa",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoFichasComanda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoFinalizarTorneio",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoIniciarTorneio",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoNovaConferencia",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoNovaMovimentacaoCaixa",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoNovaPostagem",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoNovoTorneioAgenda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoPagamentoParcialComanda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoPublicarPostagem",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoQuitarPendenciaCaixa",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoRebuyComanda",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoSalvarConferencia",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoVerCaixa",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "PermissaoVerComanda",
                table: "Usuarios");
        }
    }
}
