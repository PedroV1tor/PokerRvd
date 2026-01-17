# 🎯 Valores Automáticos de Torneio nas Comandas

## ✅ Implementação Concluída!

Agora, quando uma comanda está vinculada a um torneio, os botões de Buy-in, Re-buy e Add-on usam automaticamente os valores configurados no torneio, sem perguntar ao usuário!

## 🎯 Funcionalidades Implementadas

### 1. **Detecção Automática de Torneio**
- ✅ Ao abrir detalhes da comanda, verifica se há torneio vinculado
- ✅ Carrega automaticamente os dados do torneio
- ✅ Exibe badge com nome do torneio

### 2. **Valores Automáticos**
Quando a comanda está vinculada a um torneio:
- ✅ **Buy-in**: Usa `torneio.valorBuyIn` automaticamente
- ✅ **Re-buy Simples**: Usa `torneio.valorRebuySimples` automaticamente
- ✅ **Re-buy Duplo**: Usa `torneio.valorRebuyDuplo` automaticamente
- ✅ **Add-on**: Usa `torneio.valorAddOn` automaticamente

### 3. **Exibição de Valores nos Botões**
- ✅ Cada botão mostra o valor que será adicionado
- ✅ Exemplo: "Add Buy-in | R$ 100,00"
- ✅ Botões são ocultados se o valor for zero (exceto Buy-in)

### 4. **Botão Add-on Dinâmico**
- ✅ Só aparece se o torneio tiver Add-on configurado
- ✅ Usa valor do torneio automaticamente

### 5. **Fallback para Comandas Genéricas**
- ✅ Se não houver torneio vinculado, pede o valor ao usuário
- ✅ Mantém compatibilidade com comandas antigas

## 🎨 Interface Atualizada

### **Sidebar com Torneio Vinculado:**

```
┌──────────────────────────────────┐
│  [Avatar]                        │
│  João Silva                      │
│  Mesa 5                          │
│                                  │
│  🏆 Texas Hold'em - Sexta       │
├──────────────────────────────────┤
│  + Add Buy-in                    │
│    R$ 100,00                     │
├──────────────────────────────────┤
│  + Add Re-buy Simples            │
│    R$ 50,00                      │
├──────────────────────────────────┤
│  + Add Re-buy Duplo              │
│    R$ 100,00                     │
├──────────────────────────────────┤
│  + Add Add-on                    │
│    R$ 80,00                      │
├──────────────────────────────────┤
│  + Bebida *                      │
└──────────────────────────────────┘
```

### **Sidebar sem Torneio (Genérico):**

```
┌──────────────────────────────────┐
│  [Avatar]                        │
│  Maria Santos                    │
│  Mesa 1                          │
├──────────────────────────────────┤
│  + Add Buy-in                    │
├──────────────────────────────────┤
│  + Add Re-buy Simples            │
├──────────────────────────────────┤
│  + Add Re-buy Duplo              │
├──────────────────────────────────┤
│  + Bebida *                      │
└──────────────────────────────────┘
```

## 🔄 Fluxo de Funcionamento

### **Cenário 1: Comanda de Torneio Específico**

```
1. Usuário abre detalhes da comanda
2. Sistema detecta torneioId na comanda
3. Sistema carrega dados do torneio
4. Exibe badge: "🏆 Texas Hold'em - Sexta"
5. Botões mostram valores do torneio
6. Usuário clica em "Add Buy-in"
7. Sistema adiciona R$ 100,00 automaticamente
8. Mostra confirmação: "Buy-in adicionado: R$ 100,00"
9. Item aparece na tabela
```

### **Cenário 2: Comanda Genérica (sem torneio)**

```
1. Usuário abre detalhes da comanda
2. Sistema não encontra torneioId
3. Botões não mostram valores
4. Usuário clica em "Add Buy-in"
5. Sistema pergunta: "Digite o valor do Buy-in:"
6. Usuário digita: 150
7. Sistema adiciona R$ 150,00
8. Item aparece na tabela
```

## 💻 Código Implementado

### **Lógica de Buy-in:**

```typescript
adicionarBuyIn() {
  if (!this.comanda) return;

  let valorNumerico: number;

  // Se houver torneio vinculado, usar valor do torneio
  if (this.torneio && this.torneio.valorBuyIn > 0) {
    valorNumerico = this.torneio.valorBuyIn;
  } else {
    // Caso contrário, perguntar o valor
    const valor = prompt('Digite o valor do Buy-in:');
    if (!valor) return;
    
    valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Valor inválido');
      return;
    }
  }

  // Adicionar item à comanda
  const novoItem: ItemComanda = {
    id: this.itens.length + 1,
    produtoId: 0,
    produtoNome: 'Buy-in',
    quantidade: 1,
    valorUnitario: valorNumerico,
    valorTotal: valorNumerico
  };
  
  this.itens.push(novoItem);
  this.atualizarValorFichas();
  
  // Mostrar confirmação
  if (this.torneio) {
    alert(`Buy-in adicionado: R$ ${valorNumerico.toFixed(2)}`);
  }
}
```

### **Template HTML:**

```html
<button class="action-btn" (click)="adicionarBuyIn()">
  <span class="action-icon">+</span>
  <div class="btn-content">
    <span class="btn-label">Add Buy-in</span>
    <span class="btn-valor" *ngIf="torneio && torneio.valorBuyIn > 0">
      R$ {{ torneio.valorBuyIn.toFixed(2) }}
    </span>
  </div>
</button>
```

## 📝 Arquivos Modificados

### 1. **`src/app/pages/comanda-detalhes/comanda-detalhes.component.ts`**
- ✅ Importado `TorneioService`
- ✅ Adicionado propriedade `torneio: Torneio | null`
- ✅ Método `carregarTorneio()` para buscar dados do torneio
- ✅ Atualizado `adicionarBuyIn()` com lógica automática
- ✅ Atualizado `adicionarRebuySimples()` com lógica automática
- ✅ Atualizado `adicionarRebuyDuplo()` com lógica automática
- ✅ Criado `adicionarAddOn()` com lógica automática

### 2. **`src/app/pages/comanda-detalhes/comanda-detalhes.component.html`**
- ✅ Adicionado badge do torneio
- ✅ Botões mostram valores
- ✅ Botão Add-on condicional
- ✅ Re-buy Simples e Duplo condicionais

### 3. **`src/app/pages/comanda-detalhes/comanda-detalhes.component.scss`**
- ✅ Estilos para badge do torneio
- ✅ Estilos para valores nos botões
- ✅ Layout atualizado dos botões

## 🎯 Regras de Exibição

### **Buy-in:**
- Sempre visível
- Mostra valor se torneio vinculado

### **Re-buy Simples:**
- Visível se: `!torneio || torneio.valorRebuySimples > 0`
- Oculto se torneio não permite re-buy simples

### **Re-buy Duplo:**
- Visível se: `!torneio || torneio.valorRebuyDuplo > 0`
- Oculto se torneio não permite re-buy duplo

### **Add-on:**
- Visível apenas se: `torneio && torneio.valorAddOn > 0`
- Só aparece em torneios com add-on configurado

### **Bebida:**
- Sempre visível
- Independente de torneio

## ✨ Benefícios

1. **Rapidez**: Adiciona itens com um clique
2. **Precisão**: Usa valores exatos do torneio
3. **Consistência**: Todos jogadores pagam o mesmo
4. **Menos Erros**: Não depende de digitação manual
5. **Transparência**: Valores visíveis antes de clicar
6. **Flexibilidade**: Mantém suporte para comandas genéricas

## 🔍 Validações

- ✅ Verifica se comanda existe
- ✅ Verifica se torneio existe
- ✅ Valida valores numéricos
- ✅ Valida valores positivos
- ✅ Mostra mensagens de erro apropriadas
- ✅ Confirmação visual após adicionar

## 📊 Exemplo Prático

### **Torneio Configurado:**
```
Nome: Texas Hold'em - Sexta
Buy-in: R$ 100,00
Re-buy Simples: R$ 50,00
Re-buy Duplo: R$ 100,00
Add-on: R$ 80,00
```

### **Comanda do João:**
```
1. Buy-in inicial: R$ 100,00 (automático)
2. Re-buy Simples: R$ 50,00 (automático)
3. Re-buy Duplo: R$ 100,00 (automático)
4. Add-on: R$ 80,00 (automático)
5. Cerveja: R$ 10,00 (manual)

Total Fichas: R$ 330,00
Total Bebidas: R$ 10,00
TOTAL: R$ 340,00
```

## 🎉 Resultado

Agora o sistema é muito mais eficiente:
- ✅ Atendente não precisa digitar valores
- ✅ Não há risco de erro de digitação
- ✅ Processo mais rápido
- ✅ Valores sempre corretos
- ✅ Interface mais clara

---

**Teste agora:**
1. Crie uma comanda vinculada a um torneio
2. Abra os detalhes da comanda
3. Veja o badge do torneio
4. Veja os valores nos botões
5. Clique em "Add Buy-in"
6. Valor adicionado automaticamente! 🎉
