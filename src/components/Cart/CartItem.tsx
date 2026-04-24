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
