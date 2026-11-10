import assert from "node:assert/strict"
import test from "node:test"
import { readFavorites, writeFavorites } from "./favorites"

function installStorage(initial: string | null) {
  let value = initial
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: () => value,
      setItem: (_key: string, next: string) => { value = next },
    },
  })
  Object.defineProperty(globalThis, "window", { configurable: true, value: new EventTarget() })
}

test("corrupt favorites fall back to an empty list", () => {
  installStorage("{bad json")
  assert.deepEqual(readFavorites(), [])
})

test("favorites keep unique valid slugs", () => {
  installStorage('["git","git",42,"../bad","raycast"]')
  assert.deepEqual(readFavorites(), ["git", "raycast"])
})

test("saving favorites persists a deduplicated list", () => {
  installStorage(null)
  assert.equal(writeFavorites(["git", "git", "raycast"]), true)
  assert.deepEqual(readFavorites(), ["git", "raycast"])
})
