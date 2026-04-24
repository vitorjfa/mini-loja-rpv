import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutForm } from './CheckoutForm'

/**
 * Exercício 3 — CheckoutForm
 *
 * Nível de dificuldade: Misto
 * Alguns casos têm o render() ou parte da interação prontos.
 * Outros estão completamente em branco.
 *
 * Conceitos praticados:
 *  - getByLabelText / getByRole
 *  - userEvent.type() para preencher campos
 *  - Validação de formulário (erros)
 *  - toHaveBeenCalledWith() com dados do formulário
 *  - not.toHaveBeenCalled()
 */

describe('CheckoutForm', () => {
  it('renderiza todos os campos do formulário', () => {
    render(<CheckoutForm onSubmit={jest.fn()} />)

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
  })

  it('exibe erro quando o nome está vazio ao tentar submeter', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
  })

  it('exibe erro quando o e-mail é inválido', async () => {
    render(<CheckoutForm onSubmit={jest.fn()} />)
    await userEvent.type(screen.getByLabelText('E-mail'), 'nao-é-email')
    await userEvent.click(screen.getByRole('button', { name: /finalizar compra/i }))
    expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
  })

  it('exibe erro quando o CEP tem menos de 8 dígitos', async () => {
    render(<CheckoutForm onSubmit={jest.fn()} />)
    await userEvent.type(screen.getByLabelText('CEP'), '1234')
    await userEvent.click(screen.getByRole('button', { name: /finalizar compra/i }))
    expect(screen.getByText('CEP deve ter 8 dígitos')).toBeInTheDocument()
  })

  it('chama onSubmit com os dados corretos quando o formulário é válido', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
    await userEvent.type(screen.getByLabelText('E-mail'), 'joao@email.com')
    await userEvent.type(screen.getByLabelText('CEP'), '12345678')
    await userEvent.click(screen.getByRole('button', { name: /finalizar /i }))

    expect(onSubmit).toHaveBeenCalledWith({
      nome: 'João Silva',
      email: 'joao@email.com',
      cep: '12345678',
    })
  })

  it('não chama onSubmit quando há erros de validação', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
