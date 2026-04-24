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
