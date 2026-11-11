import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FuncionariosComponent } from './funcionarios.component';
import { copiarPermissoes, SECOES_PERMISSOES, TODAS_PERMISSOES } from '../../models/permissoes.model';

describe('FuncionariosComponent - permissões', () => {
  function criar(user: object) {
    sessionStorage.setItem('poker_token', 'token');
    sessionStorage.setItem('poker_user', JSON.stringify(user));
    TestBed.configureTestingModule({
      imports: [FuncionariosComponent, HttpClientTestingModule],
      providers: [provideRouter([])]
    });
    return TestBed.createComponent(FuncionariosComponent);
  }

  afterEach(() => sessionStorage.clear());

  it('mostra uma seção por item do header e um checkbox por permissão', () => {
    const fixture = criar({ role: 'ADMIN' });
    const component = fixture.componentInstance;
    component.showModal = true;
    component.modalTab = 'permissoes';
    SECOES_PERMISSOES.forEach(secao => (component.moduloExpanded[secao.id] = true));
    fixture.detectChanges();

    const elemento: HTMLElement = fixture.nativeElement;
    expect(elemento.querySelectorAll('.tree-modulo').length).toBe(SECOES_PERMISSOES.length);
    expect(elemento.querySelectorAll('.tree-item input[type=checkbox]').length).toBe(TODAS_PERMISSOES.length);
  });

  it('sem ser ADMIN, não oferece o cargo ADMIN nem concede o que não possui', () => {
    const component = criar({ role: 'GERENTE', permissaoFuncionarios: true, permissaoProdutos: true }).componentInstance;
    const alvo = { ...component.novoFuncionario, ...copiarPermissoes() };

    expect(component.rolesDisponiveis.map(r => r.value)).not.toContain('ADMIN');
    expect(component.podeConceder(alvo, 'permissaoProdutos')).toBeTrue();
    expect(component.podeConceder(alvo, 'permissaoCaixas')).toBeFalse();
  });

  it('marcar a seção inteira só altera o que pode ser concedido', () => {
    const component = criar({ role: 'GERENTE', permissaoProdutos: true }).componentInstance;
    const alvo = { ...component.novoFuncionario, ...copiarPermissoes() };
    const produtos = component.modulosPermissoes.find(m => m.id === 'produtos')!;

    component.setModuloChecked(alvo, produtos, true);

    expect(alvo.permissaoProdutos).toBeTrue();
    expect(alvo.permissaoExcluirProduto).toBeFalse();
  });
});
