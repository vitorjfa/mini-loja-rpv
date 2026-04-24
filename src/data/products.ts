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

// Produto em estoque — use nos testes do ProductCard
export const mockProduct: Product = products[0]

// Produto fora de estoque — use para testar o badge "Esgotado" e o botão desabilitado
export const mockOutOfStockProduct: Product = products[2]

// Itens de carrinho com 2 produtos
// Total esperado: R$ 49,90 × 2 + R$ 199,90 × 1 = R$ 299,70
export const mockCartItems: CartItem[] = [
  { product: products[0], quantity: 2 },
  { product: products[1], quantity: 1 },
]
