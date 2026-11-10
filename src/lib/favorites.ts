export const favoritesKey = "mactools-favorites"
export const favoritesEvent = "mactools:favorites"

export function readFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(favoritesKey) ?? "[]")
    if (!Array.isArray(value)) return []
    return [...new Set(value.filter((item): item is string => typeof item === "string" && /^[a-z0-9-]+$/.test(item)))]
  } catch {
    return []
  }
}

export function writeFavorites(slugs: string[]): boolean {
  try {
    localStorage.setItem(favoritesKey, JSON.stringify([...new Set(slugs)]))
    window.dispatchEvent(new Event(favoritesEvent))
    return true
  } catch {
    return false
  }
}
