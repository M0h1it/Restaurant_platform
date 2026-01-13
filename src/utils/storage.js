export const load = (key, fallback = []) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : fallback
}

export const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}
