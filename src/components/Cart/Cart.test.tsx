import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Cart } from './Cart'
import { mockCartItems } from '../../data/products'

/**
 * Exercício 2 — Cart
 *
 * Nível de dificuldade: Avançado (scaffolding mínimo)
 * Apenas as descrições estão prontas. Você escreve tudo: render, queries e assertions.
 *
 * Conceitos praticados:
 *  - render() com props complexas
 *  - Queries semânticas
 *  - Verificação de estado calculado (total)
 *  - Assertions negativas
 *  - Mock functions + toHaveBeenCalledWith()
 *
 * Dados úteis (mockCartItems):
 *  - Camiseta Básica  → R$ 49,90 × 2 = R$ 99,80
 *  - Tênis Esportivo  → R$ 199,90 × 1 = R$ 199,90
 *  - Total esperado   → R$ 299,70
 */

describe('Cart', () => {
  it('exibe a mensagem "Seu carrinho está vazio" quando não há itens', () => {
    render(<Cart items={[]} onRemove={jest.fn()} />)
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
  })

  it('renderiza todos os itens do carrinho', () => {
    render(<Cart items={mockCartItems} onRemove={jest.fn()} />)
    expect(screen.getByText(mockCartItems[0].product.name)).toBeInTheDocument()
    expect(screen.getByText(mockCartItems[1].product.name)).toBeInTheDocument()
  })

  it('exibe o total correto somando os itens', () => {
    render(<Cart items={mockCartItems} onRemove={jest.fn()} />)
    expect(screen.getByText(/Total:\s*R\$\s*299,70/i)).toBeInTheDocument()
  })

  it('chama onRemove com o id correto ao clicar em "Remover"', async () => {
    const onRemove = jest.fn()
    render(<Cart items={mockCartItems} onRemove={onRemove} />)
    
    const removeButtons = screen.getAllByRole('button', { name: /remover/i })
    await userEvent.click(removeButtons[0])
    
    expect(onRemove).toHaveBeenCalledWith(mockCartItems[0].product.id)
  })

  it('não exibe o total quando o carrinho está vazio', () => {
    render(<Cart items={[]} onRemove={jest.fn()} />)
    expect(screen.queryByText(/total/i)).not.toBeInTheDocument()
  })
})
