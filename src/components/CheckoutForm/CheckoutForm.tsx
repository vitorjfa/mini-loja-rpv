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
        <input
          id="nome"
          type="text"
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        {errors.nome && <span role="alert">{errors.nome}</span>}
      </div>

      <div>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span role="alert">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="cep">CEP</label>
        <input
          id="cep"
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
        />
        {errors.cep && <span role="alert">{errors.cep}</span>}
      </div>

      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Finalizar Compra</button>
    </form>
  )
}
