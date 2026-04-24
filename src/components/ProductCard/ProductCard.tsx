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

      <button
        onClick={() => onAddToCart(product.id)}
        disabled={!product.inStock}
      >
        Adicionar ao Carrinho
      </button>
    </article>
  )
}
