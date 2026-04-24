# Apostila Basica de Testes de Frontend

## 1. Introducao

Testes de frontend existem para verificar se a interface se comporta como o usuario espera. Eles ajudam a detectar regressões, facilitam refatoracoes e funcionam como uma forma de documentacao executavel.

Em projetos React, uma combinacao muito comum e:

- Jest para executar testes, criar mocks e fazer assertions.
- React Testing Library para renderizar componentes e consultar a tela do jeito que o usuario faria.
- jsdom para simular um DOM dentro do ambiente de testes.

Uma ideia importante: teste bom nao verifica detalhes internos demais. Ele tenta validar comportamento observavel.

## 2. Estrutura basica de um teste com Jest

O Jest organiza os testes com algumas funcoes muito comuns:

- `describe()` agrupa testes relacionados.
- `it()` ou `test()` define um caso de teste individual.
- `expect()` verifica o resultado esperado.
- `jest.fn()` cria uma funcao mock que pode ser inspecionada.

Exemplo basico:

```tsx
import { render, screen } from '@testing-library/react'

function Botao() {
  return <button>Entrar</button>
}

describe('Botao', () => {
  it('mostra o texto Entrar', () => {
    render(<Botao />)

    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })
})
```

### 2.1 `describe()`

Use `describe()` para agrupar testes do mesmo componente, funcao ou comportamento.

```ts
describe('Formulario de login', () => {
  it('mostra os campos obrigatorios', () => {})
  it('envia os dados quando o formulario esta valido', () => {})
})
```

Isso melhora a organizacao e a leitura do arquivo de testes.

### 2.2 `it()` ou `test()`

Cada `it()` deve representar um comportamento especifico.

Exemplos:

- `it('renderiza o titulo da pagina', () => {})`
- `it('desabilita o botao quando o formulario esta invalido', () => {})`

### 2.3 `jest.fn()`

Quando voce precisa verificar se uma funcao foi chamada, quantas vezes foi chamada ou com quais argumentos, use `jest.fn()`.

```ts
const onSalvar = jest.fn()
```

Depois voce pode validar:

```ts
expect(onSalvar).toHaveBeenCalled()
expect(onSalvar).toHaveBeenCalledWith('valor')
```

## 3. Ambiente de testes

### 3.1 `jsdom`

Componentes React dependem de elementos de interface como `button`, `input`, `form` e eventos do DOM. Em testes, isso normalmente acontece usando o ambiente `jsdom`, que simula um navegador dentro do Node.

Sem um DOM simulado, varios testes de interface nao funcionariam corretamente.

### 3.2 Arquivo de setup

Em muitos projetos existe um arquivo de setup, frequentemente chamado `jest.setup.ts`, usado para configurar o ambiente antes dos testes.

Um exemplo muito comum e importar os matchers extras do pacote `@testing-library/jest-dom`:

```ts
import '@testing-library/jest-dom'
```

Com isso, ficam disponiveis matchers como:

- `toBeInTheDocument()`
- `toBeDisabled()`
- `toHaveValue()`

## 4. Renderizacao e o objeto `screen`

Depois de renderizar um componente com `render()`, as queries da Testing Library podem ser acessadas pelo objeto `screen`.

```tsx
import { render, screen } from '@testing-library/react'

render(<button>Enviar</button>)

screen.getByRole('button', { name: /enviar/i })
```

O uso de `screen` e recomendado porque deixa o teste mais legivel e padronizado.

## 5. Queries da Testing Library

As queries sao as funcoes usadas para encontrar elementos na tela.

### 5.1 `getBy*`

Use `getBy*` quando o elemento deve existir imediatamente. Se ele nao existir, o teste falha com erro.

```ts
screen.getByText('Salvar')
```

### 5.2 `queryBy*`

Use `queryBy*` quando voce quer verificar que algo nao esta na tela. Em vez de lancar erro, ela retorna `null` se nao encontrar o elemento.

```ts
expect(screen.queryByText('Carregando...')).not.toBeInTheDocument()
```

Essa e a forma mais indicada para assertions negativas.

### 5.3 `findBy*`

Use `findBy*` quando o elemento aparece de forma assincrona, por exemplo apos uma requisicao ou atualizacao de estado.

```ts
const mensagem = await screen.findByText('Dados carregados')
expect(mensagem).toBeInTheDocument()
```

## 6. Prioridade das queries

Em geral, a Testing Library incentiva queries que reflitam a experiencia real do usuario.

### 6.1 `getByRole()` e a query preferida

Sempre que possivel, prefira `getByRole()`. Ela e poderosa porque combina semantica, acessibilidade e intencao de uso.

```ts
screen.getByRole('button', { name: /adicionar/i })
```

Esse tipo de busca e melhor do que procurar por estrutura interna do DOM ou por seletores frageis.

Motivos para preferir `getByRole()`:

- aproxima o teste da forma como tecnologias assistivas leem a interface;
- incentiva HTML semantico;
- reduz dependencia de detalhes internos;
- deixa mais claro o que o usuario realmente enxerga e usa.

### 6.2 `getByLabelText()`

Quando o alvo e um campo de formulario associado a uma label, `getByLabelText()` costuma ser a melhor opcao.

```tsx
<label htmlFor="nome">Nome</label>
<input id="nome" />
```

```ts
screen.getByLabelText('Nome')
```

Essa abordagem tambem reforca boas praticas de acessibilidade.

### 6.3 Evite seletores frageis

Sempre que der, evite dependencias excessivas em:

- `querySelector()`
- classes CSS
- `getByTestId()` como primeira escolha

Esses caminhos podem ate funcionar, mas normalmente descrevem menos o comportamento real da interface.

### 6.4 Resumo rapido

| Situacao | Query mais adequada |
| --- | --- |
| Elemento deve existir agora | `getBy*` |
| Elemento nao deve existir | `queryBy*` |
| Elemento aparece depois | `findBy*` |
| Botao, link, checkbox, heading | `getByRole()` |
| Campo identificado por label | `getByLabelText()` |

## 7. Interacoes do usuario

Testes de interface ficam mais valiosos quando simulam a acao do usuario.

### 7.1 `userEvent` versus `fireEvent`

`fireEvent` dispara eventos de forma direta. `userEvent` tenta representar melhor a interacao real.

Na pratica:

- `userEvent` costuma ser a escolha preferida para cliques, digitacao e navegacao basica;
- `fireEvent` ainda pode ser util em cenarios mais especificos ou de baixo nivel.

### 7.2 Clique com `userEvent.click()`

```tsx
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

await user.click(screen.getByRole('button', { name: /entrar/i }))
```

### 7.3 Digitacao com `userEvent.type()`

```tsx
await user.type(screen.getByLabelText('Email'), 'aluno@teste.com')
```

### 7.4 Por que usar `async` e `await`

Muitas interacoes do `userEvent` sao assincronas. Por isso, e comum escrever testes com `async` e `await`.

```tsx
it('preenche o campo email', async () => {
  const user = userEvent.setup()

  render(<input aria-label="Email" />)

  await user.type(screen.getByLabelText('Email'), 'aluno@teste.com')

  expect(screen.getByLabelText('Email')).toHaveValue('aluno@teste.com')
})
```

## 8. Matchers importantes

Matchers sao os metodos usados depois de `expect(...)` para verificar o resultado.

### 8.1 `toBeInTheDocument()`

Verifica se um elemento esta presente no DOM.

```ts
expect(screen.getByText('Sucesso')).toBeInTheDocument()
```

### 8.2 `toBeDisabled()`

Verifica se um botao ou campo esta desabilitado.

```ts
expect(screen.getByRole('button', { name: /enviar/i })).toBeDisabled()
```

### 8.3 Assertions negativas

Para validar que algo nao aparece na tela:

```ts
expect(screen.queryByText('Esgotado')).not.toBeInTheDocument()
```

Observe a combinacao correta:

- `queryByText()` para nao lancar erro;
- `.not.toBeInTheDocument()` para afirmar ausencia.

### 8.4 `toHaveBeenCalledWith()`

Quando uma funcao mock deve receber um argumento especifico:

```ts
const onSelecionar = jest.fn()

onSelecionar(42)

expect(onSelecionar).toHaveBeenCalledWith(42)
```

### 8.5 `not.toHaveBeenCalled()`

Quando voce quer garantir que uma funcao nao foi executada:

```ts
const onSubmit = jest.fn()

expect(onSubmit).not.toHaveBeenCalled()
```

Isso e muito comum em testes de validacao, quando o formulario deve bloquear o envio.

## 9. Erro comum: esquecer os parenteses do matcher

Um erro sutil, mas perigoso, e escrever:

```ts
expect(elemento).toBeInTheDocument
```

Nesse caso, a assertion nao e executada de verdade. O correto e:

```ts
expect(elemento).toBeInTheDocument()
```

Ou seja: sem os parenteses, o teste pode passar sem validar nada.

## 10. Padrao AAA

Uma forma simples de organizar testes e o padrao AAA:

- Arrange: preparar o cenario.
- Act: executar a acao.
- Assert: verificar o resultado.

Exemplo:

```tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function Contador() {
  const [valor, setValor] = React.useState(0)

  return (
    <div>
      <p>Valor: {valor}</p>
      <button onClick={() => setValor(valor + 1)}>Incrementar</button>
    </div>
  )
}

it('incrementa o valor ao clicar no botao', async () => {
  const user = userEvent.setup()

  // Arrange
  render(<Contador />)

  // Act
  await user.click(screen.getByRole('button', { name: /incrementar/i }))

  // Assert
  expect(screen.getByText('Valor: 1')).toBeInTheDocument()
})
```

Esse padrao deixa o teste mais facil de entender e manter.

## 11. Exemplo completo com formulario

O exemplo abaixo junta varios conceitos da apostila.

```tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function Formulario({ onSubmit }: { onSubmit: (dados: { nome: string }) => void }) {
  const [nome, setNome] = React.useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!nome.trim()) {
      return
    }

    onSubmit({ nome })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nome">Nome</label>
      <input id="nome" value={nome} onChange={(event) => setNome(event.target.value)} />
      <button type="submit">Salvar</button>
    </form>
  )
}

it('envia o nome preenchido corretamente', async () => {
  const onSubmit = jest.fn()
  const user = userEvent.setup()

  render(<Formulario onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText('Nome'), 'Maria')
  await user.click(screen.getByRole('button', { name: /salvar/i }))

  expect(onSubmit).toHaveBeenCalledWith({ nome: 'Maria' })
})
```

O que esse teste usa:

- `it()` para definir um caso de teste;
- `jest.fn()` para criar uma funcao mock;
- `render()` para montar o componente;
- `screen.getByLabelText()` para encontrar o input;
- `screen.getByRole()` para encontrar o botao;
- `userEvent.type()` e `userEvent.click()` para simular interacoes;
- `toHaveBeenCalledWith()` para validar o envio.

## 12. Boas praticas para iniciantes

- Dê nomes claros aos testes, descrevendo comportamento.
- Teste o que o usuario ve e faz, nao a implementacao interna.
- Prefira `getByRole()` e `getByLabelText()` quando fizer sentido.
- Use `queryBy*` para verificar ausencia de elementos.
- Use `findBy*` quando houver comportamento assincrono.
- Use `userEvent` como primeira opcao para interacoes.
- Organize o teste com Arrange, Act e Assert.
- Cuidado para nao esquecer `()` nos matchers.

## 13. Resumo final

Se voce dominar os pontos abaixo, ja tera uma base solida em testes de frontend:

- estrutura do Jest com `describe()`, `it()` e `expect()`;
- uso de `jest.fn()` para mocks;
- papel do `jsdom` no DOM simulado;
- configuracao de matchers extras no setup;
- uso do objeto `screen`;
- diferenca entre `getBy*`, `queryBy*` e `findBy*`;
- preferencia por `getByRole()` e `getByLabelText()`;
- uso de `userEvent.click()` e `userEvent.type()`;
- matchers como `toBeInTheDocument()`, `toBeDisabled()` e `toHaveBeenCalledWith()`;
- organizacao do teste com o padrao AAA.

## 14. Referencias uteis

- Jest: https://jestjs.io/
- Testing Library: https://testing-library.com/
- jest-dom: https://github.com/testing-library/jest-dom
