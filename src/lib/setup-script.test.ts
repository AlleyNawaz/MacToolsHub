import assert from "node:assert/strict"
import test from "node:test"
import { buildSetupScript } from "./setup-script"

test("empty selections contain no executable install step", () => {
  const script = buildSetupScript([])
  assert.match(script, /Select at least one tool/)
  assert.doesNotMatch(script, /brew install/)
})

test("Homebrew bootstraps only when unavailable and then loads shellenv", () => {
  const script = buildSetupScript([{ name: "Homebrew", slug: "homebrew", installCommand: "install-homebrew", installKind: "command" }])
  assert.match(script, /if ! command -v brew/)
  assert.match(script, /install-homebrew/)
  assert.match(script, /\/opt\/homebrew\/bin\/brew shellenv/)
  assert.match(script, /\/usr\/local\/bin\/brew shellenv/)
})

test("manual instructions become comments instead of shell commands", () => {
  const script = buildSetupScript([{ name: "MacPorts", slug: "macports", installCommand: "Download the installer from macports.org", installKind: "manual" }])
  assert.match(script, /^# Manual step — MacPorts: Download the installer from macports.org$/m)
  assert.doesNotMatch(script, /^Download the installer/m)
})
