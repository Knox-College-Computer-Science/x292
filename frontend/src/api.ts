export type TodoItem = {
  id: number
  title: string
  completed: boolean
}

const API_URL = 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function listItems() {
  return request<TodoItem[]>('/items')
}

export function createItem(title: string) {
  return request<TodoItem>('/items', {
    method: 'POST',
    body: JSON.stringify({ title, completed: false }),
  })
}

export function updateItem(id: number, completed: boolean) {
  return request<TodoItem>(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
  })
}

export function deleteItem(id: number) {
  return request<void>(`/items/${id}`, {
    method: 'DELETE',
  })
}
