# Mini Loja

Projeto educacional em Next.js e TypeScript para praticar testes de front-end com Jest e Testing Library.

A aplicação simula uma loja virtual simples com catálogo de produtos, carrinho e formulário de checkout. O foco principal não é a complexidade de negócio, e sim oferecer uma base pequena, clara e realista para exercitar testes de componentes React.

## Objetivos do projeto

- Praticar escrita de testes unitários e de integração em interface.
- Exercitar queries semânticas e boas práticas da Testing Library.
- Validar interações do usuário com cliques, digitação e envio de formulário.
- Trabalhar com mocks, assertions negativas e verificação de callbacks.
- Servir como material de apoio para aulas e exercícios.

## O que a aplicação cobre

Na versão atual, a mini-loja trabalha com três fluxos principais:

- Listagem de produtos com disponibilidade e ação de compra.
- Carrinho com cálculo de total e remoção de itens.
- Checkout com validação de nome, e-mail e CEP.

Esses fluxos foram escolhidos para cobrir cenários comuns de testes em front-end sem introduzir dependências desnecessárias, API externa ou estado global complexo.

## Stack

- Next.js 14 com Pages Router.
- React 18.
- TypeScript.
- Jest 29.
- React Testing Library.
- Testing Library User Event.
- jsdom para ambiente de testes.

## Estrutura principal

```text
src/
  components/
    Cart/
    CheckoutForm/
    Counter/
    ProductCard/
  data/
    products.ts
  pages/
    index.tsx
  types/
    index.ts
```

Componentes e exercícios atuais:

- `ProductCard`: renderização de produto, disponibilidade e ação de adicionar ao carrinho.
- `Cart`: listagem de itens, remoção e cálculo de total.
- `CheckoutForm`: formulário com validação de campos.
- `Counter`: componente simples usado como exemplo incremental de aprendizagem.

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Execute os testes uma vez:

```bash
npm run test
```

Execute os testes em modo watch:

```bash
npm run test:watch
```

Gere cobertura de testes:

```bash
npm run test:coverage
```

## Scripts disponíveis

| Script | Finalidade |
| --- | --- |
| `npm run dev` | sobe a aplicação em ambiente de desenvolvimento |
| `npm run build` | gera a versão de produção |
| `npm run start` | inicia a aplicação já buildada |
| `npm run test` | executa a suíte de testes |
| `npm run test:watch` | executa os testes em modo interativo |
| `npm run test:coverage` | gera relatório de cobertura |

## Como usar este repositório em aula ou estudo

Fluxo recomendado:

1. Rode `npm run test:watch`.
2. Escolha um componente com arquivo `.test.tsx` correspondente.
3. Implemente ou ajuste os testes guiando-se pelo comportamento visível da interface.
4. Valide cobertura e qualidade das assertions.

## Critérios pedagógicos

O projeto incentiva práticas alinhadas ao uso real da Testing Library:

- Preferir `getByRole` e `getByLabelText` quando possível.
- Testar comportamento observável, não detalhes internos de implementação.
- Usar `userEvent` para simular ações do usuário.
- Evitar seletores frágeis e excesso de acoplamento ao DOM.
- Escrever testes claros, pequenos e orientados ao comportamento.

## Materiais de apoio

- [EXERCISES.md](./EXERCISES.md): guia dos exercícios atuais e conceitos praticados.
- [APOSTILA-TESTES.md](./APOSTILA-TESTES.md): base conceitual sobre Jest e Testing Library.
- [TUTORIAL.md](./TUTORIAL.md): passo a passo para montar um projeto semelhante do zero.
- [ROADMAP.md](./ROADMAP.md): evolução planejada para novas fases do projeto.

## Objetivo acadêmico

Este repositório foi estruturado para apoiar atividades de ensino com progressão de dificuldade. A aplicação é propositalmente pequena para que a atenção fique nos testes, na leitura de interface e na qualidade das assertions, e não em detalhes de infraestrutura.# mini-loja-rpv
# mini-loja-rpv
# mini-loja-rpv
