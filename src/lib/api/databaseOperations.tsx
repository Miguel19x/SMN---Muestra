import type { ObjetoData } from '../../components/type/types'

export async function updateObjeto(id: string, data: ObjetoData): Promise<void> {
  const response = await fetch(`/api/inventario/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al actualizar la información')
  }
}

export async function acceptObjeto(id: string): Promise<void> {
  const response = await fetch(`/api/inventario/${id}/accept`, {
    method: 'POST',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al aceptar la información')
  }
}

export async function rejectObjeto(id: string): Promise<void> {
  const response = await fetch(`/api/inventario/${id}/reject`, {
    method: 'POST',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al rechazar la información')
  }
}

export async function fetchObjetoDetails(id: string): Promise<ObjetoData> {
  const response = await fetch(`/api/inventario/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch objeto details')
  }

  return response.json()
}

export async function createObjeto(data: ObjetoData): Promise<ObjetoData> {
  const response = await fetch('/api/inventario', {
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

// ✅ Backward compatibility aliases
export const updateDesaparecido = updateObjeto;
export const acceptDesaparecido = acceptObjeto;
export const rejectDesaparecido = rejectObjeto;
export const fetchDesaparecidoDetails = fetchObjetoDetails;
export const createDesaparecido = createObjeto;