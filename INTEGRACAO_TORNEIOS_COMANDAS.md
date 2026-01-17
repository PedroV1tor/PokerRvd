# 🔗 Integração: Torneios e Comandas

## ✅ Implementação Concluída!

Agora os torneios em andamento aparecem como opção ao criar uma nova comanda!

## 🎯 Funcionalidades Implementadas

### 1. **Dropdown Dinâmico de Torneios**
Ao criar uma nova comanda, o dropdown "Tipo de Comanda" exibe:
- ✅ **Torneio Genérico** - Comanda de torneio sem torneio específico
- ✅ **Cash Game** - Partidas de cash
- ✅ **Bar** - Apenas consumo
- ✅ **Torneios em Andamento** (grupo separado) - Lista todos os torneios ativos

### 2. **Informações do Torneio**
Quando seleciona um torneio específico, exibe automaticamente:
- ✅ **Buy-in** do torneio
- ✅ **Re-buy Simples** (se configurado)
- ✅ **Re-buy Duplo** (se configurado)
- ✅ **Add-on** (se configurado)

### 3. **Preenchimento Automático**
- ✅ Ao selecionar um torneio, o **Valor Inicial em Fichas** é preenchido automaticamente com o valor do buy-in
- ✅ Nome do torneio é salvo na comanda
- ✅ ID do torneio é vinculado à comanda

### 4. **Exibição nas Comandas**
- ✅ Cards de comanda mostram o nome do torneio (quando aplicável)
- ✅ Exemplo: "Mesa 5 - Torneio Texas Hold'em - Sexta" ao invés de "Mesa 5 - Torneio"

## 📊 Modelos Atualizados

### `Comanda` Interface
```typescript
export interface Comanda {
  // ... campos existentes
  torneioId?: number;        // ID do torneio vinculado (opcional)
  torneioNome?: string;      // Nome do torneio (opcional)
  // ...
}
```

### `CreateComandaDto` Interface
```typescript
export interface CreateComandaDto {
  // ... campos existentes
  torneioId?: number;        // ID do torneio selecionado
  torneioNome?: string;      // Nome do torneio selecionado
  // ...
}
```

## 🎨 Interface do Usuário

### Modal Nova Comanda - Dropdown Atualizado

```
┌─────────────────────────────────────────┐
│  Tipo de Comanda                        │
│  ┌───────────────────────────────────┐  │
│  │ Torneio Genérico               ▼ │  │
│  │─────────────────────────────────  │  │
│  │ Torneio Genérico                  │  │
│  │ Cash Game                         │  │
│  │ Bar                               │  │
│  │─────────────────────────────────  │  │
│  │ Torneios em Andamento             │  │
│  │   🏆 Texas Hold'em - Sexta       │  │
│  │   🏆 Super Stack                  │  │
│  │   🏆 Deep Stack                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Informações do Torneio Selecionado

Quando um torneio é selecionado, aparece um painel com os valores:

```
┌──────────────────────────────────────────┐
│  📊 Informações do Torneio               │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐   │
│  │ Buy-in: │ │ Re-buy S:│ │ Add-on: │   │
│  │ R$ 100  │ │ R$ 50    │ │ R$ 80   │   │
│  └─────────┘ └──────────┘ └─────────┘   │
└──────────────────────────────────────────┘
```

## 🚀 Como Usar

### 1. Criar Comanda de Torneio Específico

```
1. Clique em "+ Nova Comanda"
2. Preencha o nome do jogador
3. Preencha a mesa
4. No dropdown "Tipo de Comanda":
   - Role até "Torneios em Andamento"
   - Selecione o torneio desejado
5. Observe:
   - Informações do torneio aparecem
   - Valor inicial preenchido automaticamente
6. Clique em "Criar Comanda"
```

### 2. Criar Comanda de Torneio Genérico

```
1. Clique em "+ Nova Comanda"
2. Preencha os dados
3. Selecione "Torneio Genérico"
4. Defina o valor inicial manualmente
5. Clique em "Criar Comanda"
```

## 📝 Arquivos Modificados

### 1. `src/app/models/comanda.model.ts`
- ✅ Adicionado `torneioId?: number`
- ✅ Adicionado `torneioNome?: string`

### 2. `src/app/components/nova-comanda-modal/nova-comanda-modal.component.ts`
- ✅ Importado `TorneioService`
- ✅ Adicionado carregamento de torneios
- ✅ Implementado `onTipoChange()`
- ✅ Atualizado template com grupo de torneios
- ✅ Adicionado painel de informações do torneio
- ✅ Preenchimento automático do valor

### 3. `src/app/components/comanda-card/comanda-card.component.ts`
- ✅ Exibe nome do torneio no card (quando houver)

## 💡 Lógica de Negócio

### Filtragem de Torneios
Apenas torneios com `status === StatusTorneio.EM_ANDAMENTO` aparecem como opção.

### Atualização Automática
- Quando o modal abre, busca torneios em andamento
- Lista é atualizada a cada vez que o modal é aberto
- Se um torneio for finalizado, não aparece mais como opção

### Valor Padrão
Quando seleciona um torneio:
```typescript
valorFichas = torneio.valorBuyIn
```

### Salvamento
A comanda é criada com:
```typescript
{
  tipo: TipoComanda.TORNEIO,
  torneioId: 1,
  torneioNome: "Texas Hold'em - Sexta",
  valorFichas: 100.00
}
```

## 🎯 Cenários de Uso

### Cenário 1: Torneio Específico
```
Jogador: João Silva
Mesa: Mesa 3
Tipo: Torneio Texas Hold'em - Sexta
Valor: R$ 100,00 (buy-in automático)

Card mostra: "Mesa 3 - Torneio Texas Hold'em - Sexta"
```

### Cenário 2: Cash Game
```
Jogador: Maria Santos
Mesa: Mesa 1
Tipo: Cash Game
Valor: R$ 500,00 (livre)

Card mostra: "Mesa 1 - Cash"
```

### Cenário 3: Bar
```
Jogador: Pedro Costa
Mesa: Bar
Tipo: Bar
Valor: R$ 0,00

Card mostra: "Bar - Bar"
```

## 🔄 Integração com Backend (Futuro)

### Ajustes Necessários

**Backend - Model Comanda:**
```csharp
public class Comanda
{
    public int Id { get; set; }
    // ... outros campos
    public int? TorneioId { get; set; }      // Novo campo
    public string? TorneioNome { get; set; }  // Novo campo
    public Torneio? Torneio { get; set; }    // Navegação
}
```

**Backend - DTOs:**
```csharp
public class CreateComandaDto
{
    // ... outros campos
    public int? TorneioId { get; set; }
    public string? TorneioNome { get; set; }
}
```

**Backend - Controller:**
```csharp
[HttpGet("torneios/em-andamento")]
public async Task<ActionResult<List<Torneio>>> GetTorneiosEmAndamento()
{
    var torneios = await _context.Torneios
        .Where(t => t.Status == StatusTorneio.EM_ANDAMENTO)
        .ToListAsync();
    return Ok(torneios);
}
```

### Frontend - Service
No `torneio.service.ts`, descomentar:
```typescript
getTorneiosEmAndamento(): Observable<Torneio[]> {
  return this.http.get<Torneio[]>(`${this.apiUrl}/torneios/em-andamento`);
}
```

## ✨ Benefícios

1. **Rastreabilidade**: Saber exatamente qual torneio cada comanda pertence
2. **Relatórios**: Gerar relatórios por torneio específico
3. **Automação**: Buy-in preenchido automaticamente
4. **Clareza**: Nome do torneio visível no card
5. **Flexibilidade**: Ainda permite comandas genéricas

## 🐛 Validações

- ✅ Lista vazia se não houver torneios em andamento
- ✅ Grupo "Torneios em Andamento" só aparece se houver torneios
- ✅ Atualização automática ao abrir modal
- ✅ Reset correto ao fechar modal

## 🎉 Resultado Final

Agora o sistema está completamente integrado:
- ✅ Torneios podem ser criados e gerenciados
- ✅ Comandas podem ser vinculadas a torneios específicos
- ✅ Informações fluem entre as páginas
- ✅ Interface intuitiva e automática

---

**Teste agora:**
1. Vá em "Torneios" e inicie um torneio
2. Volte ao Dashboard
3. Clique em "+ Nova Comanda"
4. Veja o torneio aparecer no dropdown!
