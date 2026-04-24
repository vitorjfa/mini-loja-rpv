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
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === productId)

      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }

      return prev.filter((item) => item.product.id !== productId)
    })
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
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
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
