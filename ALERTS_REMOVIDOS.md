# Onde estavam todos os alerts e confirms (substituídos)

Este arquivo documenta **todos** os `alert()` e `confirm()` que existiam no sistema e como foram substituídos.

---

## 1. **guards/permission.guard.ts**
- **alert** – "Você não tem permissão para acessar esta página"  
  → **Substituído por:** Toast (erro) – `toast.error(...)`

---

## 2. **pages/dashboard/dashboard.component.ts**
- **alert** – "Erro ao criar comanda: " + msg  
  → **Substituído por:** Toast (erro) – `this.toast.error(...)`

---

## 3. **pages/caixas/caixas.component.ts**
- **alert** – "Saldo inicial não pode ser negativo"  
  → **Substituído por:** Toast (aviso) – `this.toast.warning(...)`
- **alert** – "Caixa aberto com sucesso!"  
  → **Substituído por:** Toast (sucesso) – `this.toast.success(...)`
- **alert** – erro ao abrir caixa  
  → **Substituído por:** Toast (erro) – `this.toast.error(...)`

---

## 4. **pages/caixa-detalhes/caixa-detalhes.component.ts**
- **alert** – msg de erro ao carregar caixa  
  → **Substituído por:** Toast (erro)
- **alert** – "Caixa fechado com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – erro ao fechar caixa  
  → **Substituído por:** Toast (erro)
- **alert** – "Digite um nome para a categoria"  
  → **Substituído por:** Toast (aviso)
- **alert** – "Esta categoria já existe"  
  → **Substituído por:** Toast (aviso)
- **alert** – "Preencha todos os campos corretamente"  
  → **Substituído por:** Toast (aviso)
- **alert** – "Movimentação adicionada com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – "Erro ao adicionar movimentação. Tente novamente."  
  → **Substituído por:** Toast (erro)
- **alert** – msg de erro ao quitar pendência  
  → **Substituído por:** Toast (erro)

---

## 5. **pages/funcionarios/funcionarios.component.ts**
- **alert** – "Funcionário cadastrado com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – erro ao criar funcionário  
  → **Substituído por:** Toast (erro)
- **alert** – "Funcionário ativado/desativado com sucesso!" ou "Funcionário atualizado com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – erro ao atualizar funcionário  
  → **Substituído por:** Toast (erro)
- **confirm** – "Deseja realmente desativar este funcionário?"  
  → **Substituído por:** Modal de confirmação – `this.confirm.confirm(...)`
- **alert** – "Funcionário desativado com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – "Erro ao deletar funcionário"  
  → **Substituído por:** Toast (erro)

---

## 6. **pages/comanda-detalhes/comanda-detalhes.component.ts**
- **alert** – "Digite um nome para as fichas"  
  → **Substituído por:** Toast (aviso)
- **alert** – "Digite um valor válido"  
  → **Substituído por:** Toast (aviso)
- **alert** – "[nome] de R$ [valor] adicionado com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – "Erro ao adicionar [nome]. Tente novamente."  
  → **Substituído por:** Toast (erro)
- **confirm** – "Deseja realmente remover este item?"  
  → **Substituído por:** Modal de confirmação
- **alert** – "Informe pelo menos uma forma de pagamento com valor maior que zero."  
  → **Substituído por:** Toast (aviso)
- **alert** – "A soma das formas de pagamento... deve ser igual ao valor a receber..."  
  → **Substituído por:** Toast (aviso)
- **alert** – "Comanda fechada com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – msg de erro ao fechar comanda  
  → **Substituído por:** Toast (erro)
- **alert** – "Selecione um produto e quantidade válidos"  
  → **Substituído por:** Toast (aviso)
- **alert** – "Bebida adicionada com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – "Erro ao adicionar bebida. Tente novamente."  
  → **Substituído por:** Toast (erro)

---

## 7. **pages/produtos/produtos.component.ts**
- **alert** – "Por favor, preencha todos os campos obrigatórios!" (criar)  
  → **Substituído por:** Toast (aviso)
- **alert** – "Produto criado com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – "Erro ao criar produto. Tente novamente."  
  → **Substituído por:** Toast (erro)
- **confirm** – "Tem certeza que deseja deletar este produto?"  
  → **Substituído por:** Modal de confirmação
- **alert** – "Produto deletado com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – "Erro ao deletar produto. Tente novamente."  
  → **Substituído por:** Toast (erro)
- **alert** – "Por favor, preencha todos os campos obrigatórios!" (edição)  
  → **Substituído por:** Toast (aviso)
- **alert** – "Produto ativado/desativado/atualizado com sucesso!"  
  → **Substituído por:** Toast (sucesso)
- **alert** – "Erro ao atualizar produto. Tente novamente."  
  → **Substituído por:** Toast (erro)
- **alert** – "Por favor, selecione um produto e informe a quantidade!"  
  → **Substituído por:** Toast (aviso)
- **alert** – "Produto não encontrado!"  
  → **Substituído por:** Toast (erro)
- **alert** – "Estoque atualizado! [nome]: [antigo] → [novo]"  
  → **Substituído por:** Toast (sucesso)
- **alert** – "Erro ao adicionar estoque. Tente novamente."  
  → **Substituído por:** Toast (erro)

---

## 8. **pages/torneios/torneios.component.ts**
- **alert** – "Por favor, preencha o nome do torneio"  
  → **Substituído por:** Toast (aviso)
- **alert** – "O valor do Buy-in deve ser maior que zero"  
  → **Substituído por:** Toast (aviso)
- **alert** – "Erro ao criar torneio. Tente novamente."  
  → **Substituído por:** Toast (erro)
- **confirm** – "Deseja realmente excluir o torneio [nome]?"  
  → **Substituído por:** Modal de confirmação
- **alert** – "Erro ao deletar torneio. Tente novamente."  
  → **Substituído por:** Toast (erro)
- **confirm** – "Deseja iniciar este torneio?"  
  → **Substituído por:** Modal de confirmação
- **confirm** – "Deseja finalizar este torneio?"  
  → **Substituído por:** Modal de confirmação

---

## Resumo

| Tipo            | Onde era usado                                      | Substituição              |
|-----------------|-----------------------------------------------------|---------------------------|
| **Perguntas**    | confirm() em funcionários, comanda-detalhes, produtos, torneios | Modal de confirmação (popup) |
| **Avisos/Sucesso/Erro** | alert() em todos os arquivos acima                 | Toast visual (canto da tela) |

- **Toast:** mensagem no canto da tela (sucesso = verde, erro = vermelho, aviso = amarelo), some sozinho após ~4s e pode ser fechado ao clicar.
- **Modal de confirmação:** popup com título "Confirmação", mensagem da pergunta e botões "Cancelar" e o texto do botão de ação (ex.: "Deletar", "Remover", "Iniciar").
