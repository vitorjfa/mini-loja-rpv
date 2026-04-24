# Tutorial: criando do zero uma app Next.js pronta para testes com Jest

Este guia mostra como criar, do zero, uma aplicação de front-end com Next.js, TypeScript, Jest e Testing Library para estudos de testes. A proposta segue a mesma base deste projeto: componentes simples, estado local, formulário com validação e testes de interface.

## 1. Criar o projeto Next.js

No terminal, rode:

```bash
npx create-next-app@14 mini-loja-tests
```

Responda assim:

- Use TypeScript? `Yes`
- Use ESLint? `Yes` ou `No` (não impacta os testes)
- Use Tailwind CSS? `No`
- Use `src/` directory? `Yes`
- Use App Router? `No`
- Customize the default import alias? `Yes`
- Alias: `@/*`

Entre na pasta:

```bash
cd mini-loja-tests
```

Se o projeto vier com `next.config.ts`, troque para `next.config.mjs`. O `next/jest` funciona corretamente com `next.config.js` ou `next.config.mjs`.

## 2. Instalar as dependências de teste

Instale Jest, ambiente jsdom e Testing Library:

```bash
npm install -D jest@29 jest-environment-jsdom@29 @testing-library/react@15 @testing-library/jest-dom@6 @testing-library/user-event@14 ts-node tsx
```

Como o arquivo de configuração será `jest.config.ts`, o `ts-node` é necessário para o Jest conseguir carregar essa configuração em TypeScript.

Seu `package.json` deve ficar com scripts parecidos com estes:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 3. Configurar o Jest no Next.js

Crie o arquivo `jest.config.ts` na raiz:

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/components/**/*.tsx',
    '!src/components/**/*.test.tsx',
  ],
}

export default createJestConfig(config)
```

Crie também `jest.setup.ts`:

```ts
import '@testing-library/jest-dom'
```

Ponto importante: o campo correto é `setupFilesAfterEnv`. Muita gente erra isso ao configurar o Jest manualmente.

## 4. Conferir o TypeScript

Seu `tsconfig.json` precisa ter o alias `@/*` apontando para `src/*`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Se quiser manter a configuração do Next explícita, use `next.config.mjs`:

```js
const nextConfig = {
  reactStrictMode: true,
}

export default nextConfig
```

## 5. Começar pelo menor exemplo possível: Counter

Antes de testar uma tela maior, vale começar com um componente muito pequeno.

Crie a pasta `src/components/Counter/`.

### 5.1. Componente

Arquivo `src/components/Counter/Counter.tsx`:

```tsx
import { useState } from 'react'

interface CounterProps {
  initialValue?: number
}

export function Counter({ initialValue = 0 }: CounterProps) {
  const [count, setCount] = useState(initialValue)

  return (
    <section aria-label="contador">
      <h2>Counter</h2>
      <p aria-live="polite">Valor atual: {count}</p>

      <div>
        <button type="button" onClick={() => setCount((current) => current - 1)}>
          Diminuir
        </button>
        <button type="button" onClick={() => setCount((current) => current + 1)}>
          Aumentar
        </button>
      </div>
    </section>
  )
}
```

### 5.2. Teste do componente

Arquivo `src/components/Counter/Counter.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

describe('Counter', () => {
  it('renderiza com valor inicial padrão', () => {
    render(<Counter />)

    expect(screen.getByText('Valor atual: 0')).toBeInTheDocument()
  })

  it('incrementa o valor ao clicar em "Aumentar"', async () => {
    render(<Counter />)

    await userEvent.click(screen.getByRole('button', { name: /aumentar/i }))

    expect(screen.getByText('Valor atual: 1')).toBeInTheDocument()
  })

  it('decrementa o valor ao clicar em "Diminuir"', async () => {
    render(<Counter initialValue={2} />)

    await userEvent.click(screen.getByRole('button', { name: /diminuir/i }))

    expect(screen.getByText('Valor atual: 1')).toBeInTheDocument()
  })
})
```

### 5.3. Rodar o primeiro teste

```bash
npm test -- Counter
```

Esse primeiro exemplo é importante porque ensina o núcleo do fluxo:

- renderizar o componente
- buscar elementos semânticos com `screen`
- simular interação com `userEvent`
- verificar o resultado com `expect`

## 6. Estruturar uma mini aplicação para praticar testes

Depois do Counter, você pode evoluir para um exemplo mais realista. A sugestão é uma mini loja com três partes:

- listagem de produtos
- carrinho
- formulário de checkout

Estrutura sugerida:

```text
src/
  components/
    Cart/
      Cart.tsx
      Cart.test.tsx
      CartItem.tsx
    CheckoutForm/
      CheckoutForm.tsx
      CheckoutForm.test.tsx
    Counter/
      Counter.tsx
      Counter.test.tsx
    ProductCard/
      ProductCard.tsx
      ProductCard.test.tsx
  data/
    products.ts
  pages/
    _app.tsx
    index.tsx
  types/
    index.ts
```

## 7. Criar os tipos compartilhados

Arquivo `src/types/index.ts`:

```ts
export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  inStock: boolean
  description: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CheckoutData {
  nome: string
  email: string
  cep: string
}
```

## 8. Criar dados de exemplo e mocks reutilizáveis

Arquivo `src/data/products.ts`:

```ts
import { Product, CartItem } from '../types'

export const products: Product[] = [
  {
    id: 1,
    name: 'Camiseta Básica',
    price: 49.9,
    category: 'Vestuário',
    image: '/images/camiseta.jpg',
    inStock: true,
    description: 'Camiseta de algodão 100%',
  },
  {
    id: 2,
    name: 'Tênis Esportivo',
    price: 199.9,
    category: 'Calçados',
    image: '/images/tenis.jpg',
    inStock: true,
    description: 'Tênis para corrida',
  },
  {
    id: 3,
    name: 'Boné Snapback',
    price: 79.9,
    category: 'Acessórios',
    image: '/images/bone.jpg',
    inStock: false,
    description: 'Boné com aba reta',
  },
]

export const mockProduct: Product = products[0]
export const mockOutOfStockProduct: Product = products[2]
export const mockCartItems: CartItem[] = [
  { product: products[0], quantity: 2 },
  { product: products[1], quantity: 1 },
]
```

Esses mocks deixam os testes mais simples e mais legíveis.

## 9. ProductCard: primeiro componente da loja

Arquivo `src/components/ProductCard/ProductCard.tsx`:

```tsx
import { Product } from '../../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (id: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formattedPrice = product.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <article>
      <img src={product.image} alt={product.name} />
      <span>{product.category}</span>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>{formattedPrice}</p>

      {!product.inStock && <span>Esgotado</span>}

      <button onClick={() => onAddToCart(product.id)} disabled={!product.inStock}>
        Adicionar ao Carrinho
      </button>
    </article>
  )
}
```

Teste `src/components/ProductCard/ProductCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from './ProductCard'
import { mockProduct, mockOutOfStockProduct } from '../../data/products'

describe('ProductCard', () => {
  it('renderiza o nome do produto', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByRole('heading', { name: mockProduct.name })).toBeInTheDocument()
  })

  it('renderiza o preço formatado em reais', () => {
    render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByText('R$ 49,90')).toBeInTheDocument()
  })

  it('exibe o badge de esgotado quando não há estoque', () => {
    render(<ProductCard product={mockOutOfStockProduct} onAddToCart={jest.fn()} />)

    expect(screen.getByText('Esgotado')).toBeInTheDocument()
  })

  it('chama onAddToCart com o id correto', async () => {
    const onAddToCart = jest.fn()

    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)

    await userEvent.click(screen.getByRole('button', { name: /adicionar ao carrinho/i }))

    expect(onAddToCart).toHaveBeenCalledWith(mockProduct.id)
  })
})
```

## 10. Cart: componente com cálculo de total

Arquivo `src/components/Cart/CartItem.tsx`:

```tsx
import { CartItem as CartItemType } from '../../types'

interface CartItemProps {
  item: CartItemType
  onRemove: (productId: number) => void
}

export function CartItem({ item, onRemove }: CartItemProps) {
  const subtotal = item.product.price * item.quantity

  const formattedSubtotal = subtotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div>
      <span>{item.product.name}</span>
      <span>Qtd: {item.quantity}</span>
      <span>{formattedSubtotal}</span>
      <button onClick={() => onRemove(item.product.id)}>Remover</button>
    </div>
  )
}
```

Arquivo `src/components/Cart/Cart.tsx`:

```tsx
import { CartItem as CartItemType } from '../../types'
import { CartItem } from './CartItem'

interface CartProps {
  items: CartItemType[]
  onRemove: (productId: number) => void
}

export function Cart({ items, onRemove }: CartProps) {
  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  const formattedTotal = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  if (items.length === 0) {
    return <p>Seu carrinho está vazio</p>
  }

  return (
    <section>
      <h2>Carrinho</h2>
      <ul>
        {items.map((item) => (
          <li key={item.product.id}>
            <CartItem item={item} onRemove={onRemove} />
          </li>
        ))}
      </ul>
      <p>Total: {formattedTotal}</p>
    </section>
  )
}
```

Teste `src/components/Cart/Cart.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Cart } from './Cart'
import { mockCartItems } from '../../data/products'

describe('Cart', () => {
  it('exibe mensagem quando não há itens', () => {
    render(<Cart items={[]} onRemove={jest.fn()} />)

    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
  })

  it('renderiza os itens do carrinho', () => {
    render(<Cart items={mockCartItems} onRemove={jest.fn()} />)

    expect(screen.getByText('Camiseta Básica')).toBeInTheDocument()
    expect(screen.getByText('Tênis Esportivo')).toBeInTheDocument()
  })

  it('exibe o total correto', () => {
    render(<Cart items={mockCartItems} onRemove={jest.fn()} />)

    expect(screen.getByText('Total: R$ 299,70')).toBeInTheDocument()
  })

  it('chama onRemove ao clicar em remover', async () => {
    const onRemove = jest.fn()

    render(<Cart items={mockCartItems} onRemove={onRemove} />)

    await userEvent.click(screen.getAllByRole('button', { name: /remover/i })[0])

    expect(onRemove).toHaveBeenCalledWith(1)
  })
})
```

## 11. CheckoutForm: validação de formulário

Arquivo `src/components/CheckoutForm/CheckoutForm.tsx`:

```tsx
import { useState } from 'react'
import { CheckoutData } from '../../types'

interface CheckoutFormProps {
  onSubmit: (data: CheckoutData) => void
}

interface FormErrors {
  nome?: string
  email?: string
  cep?: string
}

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): FormErrors {
    const newErrors: FormErrors = {}

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!cep.trim()) {
      newErrors.cep = 'CEP é obrigatório'
    } else if (cep.replace(/\D/g, '').length < 8) {
      newErrors.cep = 'CEP deve ter 8 dígitos'
    }

    return newErrors
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({ nome, email, cep })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="nome">Nome</label>
        <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        {errors.nome && <span role="alert">{errors.nome}</span>}
      </div>

      <div>
        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <span role="alert">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="cep">CEP</label>
        <input id="cep" type="text" value={cep} onChange={(e) => setCep(e.target.value)} />
        {errors.cep && <span role="alert">{errors.cep}</span>}
      </div>

      <button type="submit">Finalizar Compra</button>
    </form>
  )
}
```

Teste `src/components/CheckoutForm/CheckoutForm.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutForm } from './CheckoutForm'

describe('CheckoutForm', () => {
  it('renderiza os campos do formulário', () => {
    render(<CheckoutForm onSubmit={jest.fn()} />)

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
  })

  it('exibe erro para e-mail inválido', async () => {
    render(<CheckoutForm onSubmit={jest.fn()} />)

    await userEvent.type(screen.getByLabelText('Nome'), 'Maria')
    await userEvent.type(screen.getByLabelText('E-mail'), 'email-invalido')
    await userEvent.type(screen.getByLabelText('CEP'), '12345678')
    await userEvent.click(screen.getByRole('button', { name: /finalizar compra/i }))

    expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
  })

  it('chama onSubmit com os dados corretos', async () => {
    const onSubmit = jest.fn()

    render(<CheckoutForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Nome'), 'Maria')
    await userEvent.type(screen.getByLabelText('E-mail'), 'maria@email.com')
    await userEvent.type(screen.getByLabelText('CEP'), '12345678')
    await userEvent.click(screen.getByRole('button', { name: /finalizar compra/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      nome: 'Maria',
      email: 'maria@email.com',
      cep: '12345678',
    })
  })
})
```

## 12. Montar a página principal

Arquivo `src/pages/index.tsx`:

```tsx
import { useState } from 'react'
import { ProductCard } from '../components/ProductCard/ProductCard'
import { Cart } from '../components/Cart/Cart'
import { CheckoutForm } from '../components/CheckoutForm/CheckoutForm'
import { products } from '../data/products'
import { CartItem, CheckoutData } from '../types'

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [submitted, setSubmitted] = useState(false)

  function handleAddToCart(productId: number) {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === productId)
      if (existing) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { product, quantity: 1 }]
    })
  }

  function handleRemove(productId: number) {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  function handleCheckout(data: CheckoutData) {
    console.log('Pedido finalizado:', data)
    setSubmitted(true)
  }

  if (submitted) {
    return <h1>Pedido realizado com sucesso!</h1>
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <h1>Mini Loja</h1>

      <section>
        <h2>Produtos</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>

      <hr style={{ margin: '2rem 0' }} />

      <section>
        <Cart items={cartItems} onRemove={handleRemove} />
      </section>

      <hr style={{ margin: '2rem 0' }} />

      <section>
        <h2>Finalizar Compra</h2>
        <CheckoutForm onSubmit={handleCheckout} />
      </section>
    </main>
  )
}
```

## 13. Como estudar com esse projeto

Uma sequência boa para aula ou prática individual é:

1. testar um componente isolado e pequeno, como o Counter
2. testar renderização de dados com o ProductCard
3. testar cálculo e callback com o Cart
4. testar formulário e validação com o CheckoutForm
5. por fim, testar a integração na página principal

## 14. Comandos úteis

Rodar todos os testes:

```bash
npm test
```

Rodar em modo watch:

```bash
npm run test:watch
```

Gerar cobertura:

```bash
npm run test:coverage
```

## 15. O que você pode evoluir depois

Depois desse ponto, você pode incluir:

- mocks de funções com mais cenários
- testes de integração da página
- cobertura mínima no Jest
- CI com GitHub Actions
- validação mais rica de formulário

Se o objetivo for ensino, esse formato funciona bem porque começa no simples e cresce em camadas, sem esconder a configuração dos testes.