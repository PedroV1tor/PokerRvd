import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService.pode', () => {
  function servicoCom(user: object): AuthService {
    sessionStorage.setItem('poker_token', 'token');
    sessionStorage.setItem('poker_user', JSON.stringify(user));
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    return TestBed.inject(AuthService);
  }

  afterEach(() => sessionStorage.clear());

  it('libera tudo para ADMIN', () => {
    expect(servicoCom({ role: 'ADMIN' }).pode('permissaoExcluirProduto')).toBeTrue();
  });

  it('exige a seção e o botão', () => {
    const auth = servicoCom({ role: 'ATENDENTE', permissaoProdutos: true, permissaoExcluirProduto: true });
    expect(auth.pode('permissaoProdutos')).toBeTrue();
    expect(auth.pode('permissaoExcluirProduto')).toBeTrue();
    expect(auth.pode('permissaoEditarProduto')).toBeFalse();
  });

  it('nega o botão sem a seção', () => {
    expect(servicoCom({ role: 'GERENTE', permissaoExcluirProduto: true }).pode('permissaoExcluirProduto')).toBeFalse();
  });

  it('nega sem usuário', () => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    expect(TestBed.inject(AuthService).pode('permissaoProdutos')).toBeFalse();
  });
});
