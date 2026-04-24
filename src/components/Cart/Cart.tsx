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
