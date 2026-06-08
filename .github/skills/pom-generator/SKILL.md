---
name: pom-generator
description: 'Generate a Playwright TypeScript Page Object Model (POM) from simplified DOM and selectors. Use when creating or refactoring page classes with strict locator priority, clear action layering, and framework-aware reuse (BasePage/shared components). Keywords: pom, playwright, typescript, page object, locator strategy, atomic actions, business actions, row-key table pattern.'
argument-hint: 'Provide page name, simplified DOM, selector candidates, and framework context (BasePage/shared components).'
user-invocable: true
disable-model-invocation: false
---

# Playwright TypeScript POM Generator

## Outcome
Produce a single, clean TypeScript page-object source file that:
- Exports one central class (`export class XxxPage`)
- Contains only locators, navigation/actions, and screen-state validations
- Follows strict locator stability and framework reuse rules

## Use When
- You need to generate a new Playwright TypeScript page object from DOM structure.
- You want to refactor an existing page class into a cleaner POM shape.
- You need consistent naming, action layering, waiting strategy, and table/modal handling.

## Required Inputs
- Target class/page name
- Simplified DOM (preserve `data-testid`, role, label, placeholder, key semantic attributes)
- Candidate selectors (if already known)
- Framework context:
  - Whether `BasePage` exists and should be extended
  - Whether shared components already exist (menu, header, toast, pagination, filters)

## Output Contract
- Return raw TypeScript only from first line to last line.
- Do not include markdown wrappers or prose around the code.
- Keep comments minimal and only for non-obvious locator/waiting logic.

## Decision Rules

### 1) Architecture
- Export one page class only.
- Constructor must be `constructor(private readonly page: Page)` unless project convention explicitly requires BasePage inheritance.
- Supportive interfaces/types are allowed at file top.
- No tests, fixtures, mock data, standalone helpers, or utility classes.

### 2) Visibility
- Static locators: `public readonly`.
- Internal helpers: `private`.
- Atomic/business actions: `public async`.
- Avoid `protected` unless the codebase already enforces it.

### 3) Locator Priority
Choose the first stable strategy in this order:
1. `getByTestId`
2. `getByRole`
3. `getByLabel`
4. `getByPlaceholder`
5. Semantic CSS
6. Provided selector fallback

Rules:
- Prefer semantic/stable selectors over short selectors.
- Avoid absolute XPath and fragile deep CSS chains.
- Avoid index-driven locators (`nth`, `first`, `last`) unless no stable alternative exists.
- Landmark elements (`main`, `navigation`, `region`) are preferred for scoping, but must be treated as optional in runtime apps where accessibility tree can differ by build.
- Never make a single `main` locator the only readiness gate for page load.

### 3.1) Landmark/Main Reliability Guardrail
- If `main` exists and is stable, use it for scoping child locators.
- If `main` is missing/unstable, fall back to feature-level anchors (toolbar button, page heading, primary CTA, key sidebar link).
- `expectLoaded()` must validate page URL and then wait for one of multiple independent readiness anchors.
- If all anchors fail, throw a diagnostic error including current URL and title.

### 4) Naming Convention
- Inputs: `xxxInput`
- Buttons: `xxxButton`
- Dropdowns: `xxxDropdown`
- Checkboxes: `xxxCheckbox`
- Radios: `xxxRadio`
- Links: `xxxLink`
- Tabs: `xxxTab`
- Table/Grid: `xxxTable` / `xxxGrid`
- Row: `xxxRow`
- Modal/Dialog: `xxxModal` / `xxxDialog`
- Labels/Text/Messages: `xxxLabel` / `xxxText` / `xxxMessage`
- Spinner/Toast: `xxxSpinner` / `xxxToast`

Dynamic element lookup must be method-based (for example `getClientRow(name: string)`) instead of static properties.

### 5) Action Layering
- Atomic actions: direct interactions on reusable elements.
- Business actions: compose atomic actions for user workflows.
- Do not duplicate raw UI interaction logic across methods.
- All data must come from method parameters.

### 6) Form Parameter Strategy
- Fewer than 5 fields: primitive parameters are acceptable.
- 5 or more fields: define an interface and use object input (`data: XxxFormData`).

### 7) Waiting Strategy
- Trust Playwright auto-wait by default.
- Add explicit waits/assertions only for async UI (modal, dialog, spinner, toast, dynamic grid/dropdown).
- If spinner/overlay exists: add `private async waitForLoadingCompleted()` and call it after load-triggering actions.
- Never use `waitForTimeout` or hard-coded sleeps.

### 8) Complex UI Structures
- Navigation uses relative paths only.
- Modals/dialogs get dedicated locators and methods (open/close/confirm).
- Tables/grids use Row-Key pattern:
  - Implement `private getRowByKey(key: string): Locator`.
  - Scope row actions from returned row locator.
  - Never use row index for business interactions.

### 9) Framework Reuse
- If BasePage exists, extend/reuse it instead of re-implementing shared behavior.
- Reuse shared components rather than duplicating global locators.
- Keep imports minimal and used.

### 10) Assertion Scope
- Allow screen-state assertions only (`toBeVisible`, `toBeHidden`, `toHaveText`) to support page readiness and transitions.
- Do not include test-case business assertions in page object methods.

## Procedure
1. Analyze input DOM, selector candidates, and framework reuse opportunities.
2. Build import block and optional form/types definitions.
3. Define class signature and initialize all static `public readonly` locators in constructor.
4. Add private helpers (loading wait, row-key resolver, toast synchronization as needed).
5. Implement atomic action methods for reusable interactions.
6. Implement business action methods by composing atomic methods.
7. Validate naming, locator priority, waiting policy, and no forbidden patterns.
8. Emit only raw TypeScript.

## Completion Checklist
- Exactly one exported page class
- No test logic or fixture/data pollution
- Locator strategy follows priority and stability rules
- Atomic/business layering is explicit and non-duplicative
- Async waits are purposeful and sleep-free
- Table interactions use row-key scoping
- Imports are minimal and correct