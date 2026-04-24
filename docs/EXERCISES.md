# Mini Loja — Exercícios de Testes

Bem-vindo ao projeto de exercícios de testes de front-end!

Neste projeto você vai escrever testes para uma mini loja virtual utilizando
**Jest** e **Testing Library**, os mesmos ferramentas usadas em projetos reais.

---

## Como começar

```bash
# 1. Instale as dependências
npm install

# 2. Rode os testes em modo watch para ver o resultado em tempo real
npm run test:watch

# 3. Para visualizar o projeto no browser (opcional)
npm run dev
```

---

## Exercícios

### Exercício 1 — ProductCard ⭐⭐

**Arquivo:** `src/components/ProductCard/ProductCard.test.tsx`

O componente `ProductCard` exibe as informações de um produto: nome, preço,
categoria e um botão para adicionar ao carrinho. Se o produto estiver fora de
estoque, exibe um badge "Esgotado" e o botão fica desabilitado.

Você tem **6 casos de teste** para implementar. O `render()` já está feito em
todos eles — você escreve as queries e assertions.

**Conceitos praticados:**
- `screen.getByRole` e `screen.getByText`
- `toBeInTheDocument()` e `toBeDisabled()`
- Assertions negativas com `.not.`
- `userEvent.click()` com verificação de mock

---

### Exercício 2 — Cart ⭐⭐⭐

**Arquivo:** `src/components/Cart/Cart.test.tsx`

O componente `Cart` exibe a lista de itens, calcula o total e permite remover
produtos. Quando vazio, exibe uma mensagem informativa.

Você tem **5 casos de teste** para implementar. Apenas as descrições estão prontas —
você escreve tudo: `render()`, queries e assertions.

**Conceitos praticados:**
- `render()` com dados complexos (`mockCartItems`)
- Verificação de valores calculados (total em R$)
- `userEvent.click()` em lista de itens
- `toHaveBeenCalledWith()` para verificar argumentos
- Assertions negativas

---

### Exercício 3 — CheckoutForm ⭐⭐⭐

**Arquivo:** `src/components/CheckoutForm/CheckoutForm.test.tsx`

O componente `CheckoutForm` possui validação em três campos: nome, e-mail e CEP.
Erros são exibidos abaixo de cada campo quando a validação falha.

Você tem **6 casos de teste** com nível variado de scaffolding.

**Conceitos praticados:**
- `getByLabelText()` para encontrar inputs por label
- `userEvent.type()` para preencher formulários
- Verificação de mensagens de erro
- `toHaveBeenCalledWith()` com dados do formulário
- `not.toHaveBeenCalled()` quando há erros

---

## Dicas Gerais

### Use queries semânticas
```tsx
// ✅ Preferido — testa o que o usuário enxerga
screen.getByRole('button', { name: /adicionar/i })
screen.getByLabelText('Nome')

// ❌ Evite — frágil e não testa acessibilidade
screen.getByTestId('btn-add')
```

### userEvent vs fireEvent
```tsx
// ✅ Preferido — simula todos os eventos reais
await userEvent.click(button)
await userEvent.type(input, 'texto')

// ❌ Evite — simula apenas o evento isolado
fireEvent.click(button)
```

### Cuidado com matchers sem ()
```tsx
// ❌ Bug sutil — o teste passa vacuamente, sem verificar nada!
expect(element).toBeInTheDocument   // referência, não chamada

// ✅ Correto
expect(element).toBeInTheDocument()
```

### Padrão AAA
```tsx
it('descrição clara do comportamento esperado', async () => {
  // Arrange — prepara o cenário
  const onSubmit = jest.fn()
  render(<CheckoutForm onSubmit={onSubmit} />)

  // Act — executa a ação
  await userEvent.type(screen.getByLabelText('Nome'), 'João')
  await userEvent.click(screen.getByRole('button', { name: /finalizar/i }))

  // Assert — verifica o resultado
  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ nome: 'João' }))
})
```

---

## Dados de Teste Disponíveis

Em `src/data/products.ts` você encontra:

| Export | Descrição |
|--------|-----------|
| `mockProduct` | Camiseta Básica — R$ 49,90 — em estoque |
| `mockOutOfStockProduct` | Boné Snapback — R$ 79,90 — **fora de estoque** |
| `mockCartItems` | 2 itens: Camiseta ×2 + Tênis ×1 — total R$ 299,70 |
