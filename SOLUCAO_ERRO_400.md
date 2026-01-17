# 🔧 Solução para Erro 400 - Bad Request

## 🐛 Problema

O frontend está enviando dados em **camelCase** (jogadorNome, mesa, tipo), mas o backend C# espera **PascalCase** (JogadorNome, Mesa, Tipo).

## ✅ Solução

Há duas opções:

### **Opção 1: Configurar o Backend para Aceitar camelCase (Recomendado)**

Adicione no `Program.cs`:

```csharp
// Após builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
```

### **Opção 2: Ajustar o Frontend para Enviar PascalCase**

No `comanda.service.ts`, transformar antes de enviar:

```typescript
createComanda(comanda: CreateComandaDto): Observable<Comanda> {
  const dto = {
    JogadorNome: comanda.jogadorNome,
    Mesa: comanda.mesa,
    Tipo: comanda.tipo,
    TorneioId: comanda.torneioId,
    TorneioNome: comanda.torneioNome,
    ValorFichas: comanda.valorFichas
  };
  return this.http.post<Comanda>(`${this.apiUrl}/comandas`, dto);
}
```

## 🎯 Teste Rápido

Abra o console do navegador (F12) e veja o que está sendo enviado quando criar uma comanda.

Deve aparecer algo como:
```json
{
  "jogadorNome": "João",
  "mesa": "Mesa 1",
  "tipo": "TORNEIO",
  "valorFichas": 100
}
```

Se o backend espera PascalCase, precisa ser:
```json
{
  "JogadorNome": "João",
  "Mesa": "Mesa 1",
  "Tipo": "TORNEIO",
  "ValorFichas": 100
}
```

## 🚀 Implementação Rápida

Vou implementar a **Opção 1** (configurar o backend) pois é mais simples e padrão para APIs REST.
