# 🔄 Atualizar Banco de Dados

## ⚠️ Situação Atual

Foram adicionados novos campos no modelo Comanda (`TorneioId` e `TorneioNome`), mas o banco precisa ser atualizado.

## 📝 Passos para Atualizar

### **1. Parar o Backend**

No **Terminal 1** (onde o backend está rodando):
```
Pressione Ctrl+C
```

### **2. Criar Migration**

Ainda no Terminal 1, execute:
```powershell
dotnet ef migrations add AddTorneioFieldsToComanda
```

### **3. Aplicar Migration ao Banco**

```powershell
dotnet ef database update
```

### **4. Reiniciar o Backend**

```powershell
dotnet run
```

## ✅ Resultado

Após estes passos, o banco terá os novos campos:
- `TorneioId` (int, nullable)
- `TorneioNome` (string, nullable)

E as comandas criadas poderão ser vinculadas a torneios específicos!

## 🎯 Teste

1. Reinicie o backend
2. Recarregue o frontend (F5)
3. Crie uma nova comanda
4. Ela deve aparecer na lista!

---

**Execute os passos acima no Terminal 1 e tudo funcionará!**
