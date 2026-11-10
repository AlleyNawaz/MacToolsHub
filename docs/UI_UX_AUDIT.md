# MacTools Hub: UI, UX, and reliability audit

## Scope and method

- Reviewed every route, shared component, the catalog generator, seed script, and global styles.
- Checked the current Next.js 16 app router documentation before changing route files.
- Ran lint and a production build before implementation to establish a baseline.
- Inspected the rendered route output through the local production server.
- Browser window capture was unavailable, so visual findings are source and responsive-layout based.
- Findings below describe observable code paths and concrete user impact.
- “Implemented” means the corresponding change is included with this report.

## Overall assessment

- The catalog has broad route coverage and a consistent visual language.
- The largest reliability risk is treating suggested installation text as executable shell code.
- The largest interaction gap is keyboard access in the search dialog.
- The largest persistence gap is unguarded browser storage for favorites.
- The largest trust gap is generic copy that reads like tool-specific guidance.
- Responsive layout is mostly sound, with avoidable compression in comparisons and setup actions.
- Accessibility needs explicit focus states, dialog semantics, and reduced-motion support.

## Priority 0: installation and data integrity

### A01 — Distinguish commands from manual instructions

- Evidence: `catalog.ts` stores prose such as “Download the installer” in `installCommand`.
- Current effect: tool and comparison pages present the prose in a copyable command box.
- Current effect: the setup wizard relies on an English-language regex to turn some prose into comments.
- Risk: a future wording change can put non-shell text into a downloaded script.
- Change: make command kind an explicit catalog field and persist it with each tool.
- UI: show a separate manual-install treatment without a copy-command action.
- Script: render manual steps as comments with a source-check reminder.
- Acceptance: every seeded tool has an explicit `command` or `manual` kind.
- Status: Implemented.

### A02 — Stop implying guessed commands are verified

- Evidence: most commands are generated mechanically from a name-based slug.
- Current effect: users can copy a guessed Homebrew formula or cask token.
- Change: label shell snippets “Suggested command” and explain that tokens need verification.
- Change: preserve the visible command so users can review it before copying.
- Acceptance: no install surface calls generated commands verified or official.
- Status: Implemented.

### A03 — Make Homebrew bootstrap safe to repeat

- Evidence: every setup profile selects Homebrew by default.
- Current effect: the generated script always invokes the Homebrew installer.
- Change: run the installer only when `brew` is unavailable.
- Change: load `brew shellenv` for Apple Silicon and Intel paths afterward.
- Acceptance: a script can run on a Mac with an existing Homebrew installation.
- Status: Implemented.

### A04 — Honor an empty setup selection

- Evidence: selection can reach zero tools while the script still has a shell header.
- Current effect: a user can copy or download a no-op script.
- Change: show a clear empty state and disable copy/download until a tool is selected.
- Acceptance: deselecting the last tool produces zero install actions and no export action.
- Status: Implemented.

### A05 — Expose selection controls in setup

- Evidence: users must toggle eight tools one by one to clear or restore a profile.
- Change: add Select all and Clear controls beside the recommendation list.
- Change: derive the displayed count from available recommendations.
- Acceptance: users can reset or clear a profile with one action.
- Status: Implemented.

### A06 — Report clipboard failure and avoid download URL races

- Evidence: the setup copy button reports success without awaiting a successful clipboard write.
- Evidence: the tool copy button also reports success immediately.
- Change: await writes and show a failure message if clipboard access is denied.
- Change: release a generated download URL after the browser has started the download.
- Acceptance: “Copied” appears only after the write resolves.
- Status: Implemented.

## Priority 1: search and navigation

### A07 — Give search proper dialog semantics

- Evidence: search is a full-screen overlay without a dialog role or accessible name.
- Current effect: screen reader users are not told they entered a modal dialog.
- Change: add dialog semantics and a search label.
- Change: restore focus to the trigger when search closes.
- Change: keep keyboard focus inside the dialog while it is open.
- Acceptance: Tab stays in the dialog, Escape closes it, and focus returns to Search.
- Status: Implemented.

### A08 — Make search results keyboard navigable

- Evidence: Enter always opens the first tool match.
- Current effect: keyboard users cannot choose a later tool or a category match.
- Change: add Up/Down selection and Enter on the active result.
- Change: include categories in the same result list.
- Acceptance: all visible result rows can be reached with the arrow keys.
- Status: Implemented.

### A09 — Fix misleading search states

- Evidence: the dialog says “Popular tools” while the query is alphabetically ordered.
- Evidence: a category-only match still shows “No matching tools.”
- Change: label the initial list “Suggested tools.”
- Change: show the empty state only when neither tools nor categories match.
- Acceptance: empty and initial states accurately describe the visible results.
- Status: Implemented.

### A10 — Match shortcut hints to the platform

- Evidence: the trigger always displays the Mac Command symbol.
- Current effect: Windows and Linux users see an incorrect keyboard hint.
- Change: show `⌘ K` on Mac and `Ctrl K` elsewhere after hydration.
- Acceptance: the hint matches the existing keyboard handler.
- Status: Implemented.

### A11 — Make navigation state visible

- Evidence: the desktop and mobile navigation links have no current-page treatment.
- Evidence: Favorites is reachable from the footer but absent from the primary navigation.
- Change: add a client navigation component that marks the active section.
- Change: include Favorites in desktop and mobile navigation.
- Acceptance: current route is exposed with `aria-current="page"`.
- Status: Implemented.

## Priority 1: catalog and saved tools

### A12 — Guard favorites against corrupt storage

- Evidence: both favorites components parse `localStorage` JSON without validation.
- Current effect: one malformed value can break saving and the Favorites page.
- Change: centralize parsing and return an empty list for invalid data.
- Change: keep only valid, unique string slugs.
- Acceptance: invalid JSON and unexpected JSON shapes do not crash the UI.
- Status: Implemented.

### A13 — Synchronize favorites across tabs

- Evidence: the page listens only for the custom same-tab event.
- Current effect: another browser tab can change saved tools without refreshing the current tab.
- Change: also subscribe to the browser `storage` event.
- Acceptance: a second tab reflects saved and removed tools after storage changes.
- Status: Implemented.

### A14 — Explain where favorites live

- Evidence: Favorites has no account, but the page does not say how saving works.
- Change: state that saved tools stay in this browser.
- Acceptance: users understand the persistence and its limits before relying on it.
- Status: Implemented.

### A15 — Add sorting to the catalog

- Evidence: the catalog can be searched and filtered but only uses name order.
- Change: add A–Z, Z–A, and difficulty ordering.
- Change: keep the result count adjacent to Clear filters.
- Acceptance: sort changes the result order without dropping active filters.
- Status: Implemented.

### A16 — Align the search placeholder with indexed fields

- Evidence: the catalog placeholder mentions “command,” but filtering does not inspect commands.
- Change: index the install text as well as name, description, tags, and category.
- Acceptance: searching a command token such as `kubectl` can find its tool.
- Status: Implemented.

### A17 — Make category counts data-driven

- Evidence: the Categories heading hardcodes “17 workflows.”
- Change: derive the heading count from the queried category list.
- Acceptance: adding a category changes the heading without editing the page.
- Status: Implemented.

## Priority 1: visual layout and accessibility

### A18 — Keep copy actions visible without hover

- Evidence: the command copy button has opacity zero until a pointer hover.
- Current effect: touch users may not discover the action and keyboard focus is unclear.
- Change: keep a visible labeled copy action at every viewport width.
- Acceptance: the action can be found and focused without using a mouse.
- Status: Implemented.

### A19 — Fix narrow comparison layouts

- Evidence: comparison data uses a three-column grid with no minimum content width.
- Current effect: tool names and values compress on narrow screens.
- Change: allow horizontal scrolling around a table with a sensible minimum width.
- Change: include a concise scroll hint at small widths.
- Acceptance: no comparison column becomes unreadably narrow at 320 px.
- Status: Implemented.

### A20 — Fix setup export controls on narrow screens

- Evidence: two equal-width buttons sit inside a narrow card.
- Current effect: text can crowd the icons on small phones.
- Change: stack actions on small screens and use two columns from `sm` upward.
- Acceptance: both labels remain readable without horizontal overflow.
- Status: Implemented.

### A21 — Add consistent focus treatment

- Evidence: many custom buttons and links rely on hover but lack focus-visible styles.
- Change: add a global focus-visible outline with adequate separation.
- Acceptance: tabbing through navigation, cards, forms, and dialogs shows focus.
- Status: Implemented.

### A22 — Respect reduced motion

- Evidence: cards translate on hover and the loading skeleton animates unconditionally.
- Change: disable nonessential animation and smooth scrolling under reduced-motion preference.
- Acceptance: the interface remains readable and functional with reduced motion enabled.
- Status: Implemented.

### A23 — Remove duplicated CSS definitions

- Evidence: `.dot-grid`, `.text-balance`, and `::selection` appear twice in global CSS.
- Change: retain one intentional definition of each rule.
- Acceptance: a single source controls each utility and selection color.
- Status: Implemented.

### A24 — Fix the theme toggle from system mode

- Evidence: the toggle compares `theme` with `light`; `theme` can be `system`.
- Current effect: clicking while system mode resolves to light sets light again.
- Change: toggle based on `resolvedTheme` and expose the destination in its accessible label.
- Acceptance: one click always changes the currently displayed scheme.
- Status: Implemented.

## Priority 2: content and recovery

### A25 — Remove generic tool-specific claims

- Evidence: the seed repeats invented feature, configuration, usage, and FAQ copy for every tool.
- Current effect: pages appear detailed while conveying little verified information.
- Change: show the actual description, suggested installation, category, and related tools.
- Change: omit empty generic documentation sections.
- Acceptance: detail pages do not pretend boilerplate is tool-specific guidance.
- Status: Implemented.

### A26 — Use a semantic page structure

- Evidence: the root layout contains `<main>` and the tool detail page nests another `<main>`.
- Change: use a sectioning container inside the tool page instead.
- Acceptance: each page has one main landmark from the root layout.
- Status: Implemented.

### A27 — Add a recoverable error state

- Evidence: there is a loading and not-found page but no route error boundary.
- Current effect: a transient database or rendering error exposes a generic failure screen.
- Change: add a route error page with a retry action and a path back to the catalog.
- Acceptance: users can recover from a render error without retyping the URL.
- Status: Implemented.

### A28 — Replace the starter icon

- Evidence: the project still carries the create-next-app favicon.
- Change: add a brand icon based on the site’s command prompt mark.
- Change: point metadata and manifest at the new icon.
- Acceptance: browser tabs and installed shortcuts show MacTools branding.
- Status: Implemented.

## Verification plan

- Re-seed the local database so changed catalog metadata is reflected in pages.
- Run lint and a full production build with webpack.
- Run focused unit tests for favorites storage and setup-script generation.
- Check generated route output for home, catalog, tool, setup, compare, and favorites pages.
- Verify sitemap and robots responses.
- Exercise the pure setup-script builder with focused tests for command and manual rows.
- Check `git diff --check` for whitespace errors.

## Deployment and content constraints

- The current SQLite file is local and intentionally not committed.
- A deployed host needs a persistent database and a seed/migration process.
- `NEXT_PUBLIC_SITE_URL` must be set to the public origin for canonical URLs.
- Suggested Homebrew tokens and editorial comparisons need periodic vendor review.
- Search links are clearly labeled as searches; direct official URLs remain a content task.
- These constraints are documented rather than silently presented as verified facts.
