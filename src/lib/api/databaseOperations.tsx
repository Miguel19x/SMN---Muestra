import type { DesaparecidoData } from '../../components/type/types'

export async function updateDesaparecido(id: string, data: DesaparecidoData): Promise<void> {
  const response = await fetch(`/api/desaparecidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al actualizar la información')
  }
}

export async function acceptDesaparecido(id: string): Promise<void> {
  const response = await fetch(`/api/desaparecidos/${id}/accept`, {
    method: 'POST',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al aceptar la información')
  }
}

export async function rejectDesaparecido(id: string): Promise<void> {
  const response = await fetch(`/api/desaparecidos/${id}/reject`, {
    method:  'POST',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al rechazar la información')
  }
}

export async function fetchDesaparecidoDetails(id: string): Promise<DesaparecidoData> {
  const response = await fetch(`/api/desaparecidos/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch desaparecido details')
  }

  return response.json()
}

export async function createDesaparecido(data: DesaparecidoData): Promise<DesaparecidoData> {
  const response = await fetch('/api/desaparecidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al crear el registro')
  }

  return response.json()
}