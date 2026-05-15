---
name: build-component
description: Generate ColumnConfig[] and FormFields TSX from a plain-language description for this admin dashboard
---

You are `build-component`, a scoped skill for the sagara-vite-react-ts admin dashboard. You generate UI component markup from a description.

## When to use

When the user asks to:
- Add a list/table column to an existing module
- Generate a form or form fields for a module
- Update the ColumnConfig[] array for a list page
- Add a new input field to a form

## How to use

The user says something like:
```
/build-component products add list with image, name, price, stock columns and actions
/build-component roles add form with name and privileges
```

Parse:
- First word = module name
- Rest = what to build (list column, form field, etc.)

## Process

### Step 1 — Read the module types

Read `src/modules/{module}/types/Model.ts` to get:
- The `Model` interface (list/table fields)
- The `moduleName` export
- Any special types (enums, unions)

### Step 2 — Determine what to generate

**For list/table column additions**:

1. Read `src/modules/{module}/pages/list/ListPage.tsx`
2. Read `src/types/ColumnConfig.ts` to confirm the type signature
3. Add the new column to the `ColumnConfig<Model>[]` array:
   - `#` column: `{ title: "#", name: "id", rowClassName: "font-weight-bold" }`
   - Field columns: `{ title: "{label}", name: "{fieldName}", render: (_, value) => \`${value}\` }`
   - Actions column: `{ title: "Actions", name: "id", headerClassName: "header-action-list text-center", render: (row) => <Action id={row.id} module={moduleName} privilegeUrl={privilegeUrl} /> }`
4. Use `ListContainer` from `@/components/list/ListContainer`

**For form/FormFields additions**:

1. Read `src/modules/{module}/components/FormFields.tsx`
2. Map the field type to the right input component:
   | field type | component |
   |-----------|-----------|
   | text | `Text` from `@components/form/inputs/Text` |
   | number | `NumberInput` from `@components/form/inputs/NumberInput` |
   | textarea | `TextAreaInput` from `@components/form/inputs/TextAreaInput` |
   | email | `Email` from `@components/form/inputs/Email` |
   | date | `DateInput` from `@components/form/inputs/DateInput` |
   | switch/toggle | `Switch` from `@components/form/inputs/Switch` |
   | FK/reference | `SelectReferenceInput` or the module's `SelectReferenceInput{Ref}` component |
   | select | `SelectInput` from `@components/form/select/SelectInput` |

3. All inputs must use `useFormContext()` from `react-hook-form` — no props drilling
4. Wrap in `<div className="row">` with `<div className="col-12">` for each field
5. Include `required` and `readOnly` props on each input
6. Labels from `t("modules.{moduleName}.create.form.{fieldName}")`

### Step 3 — Generate and apply

Use the Edit tool to insert the generated code into the existing file. Do NOT rewrite the whole file unless asked.

For list pages — add new columns to the existing `columns` array, preserve existing columns.
For form pages — add new inputs to the existing `FormFields` component, preserve existing inputs.

## Rules

- **Always** use path aliases: `@/`, `@modules/`, `@hooks/`, `@components/`
- **Always** use `useFormContext` — never pass form state as props
- **Always** use `t("modules.{moduleName}.*")` for i18n keys (note: user fills `en.json`)
- **Always** use Bootstrap utility classes for layout: `col-12`, `col-md-6`, `row`, `g-3`, `d-flex gap-2`
- **Always** include `required` and `readOnly` props on form inputs
- **Never** generate i18n strings — use t() with placeholder keys
- **Never** use inline styles — use Bootstrap/custom CSS classes
- **Never** hardcode colors — use `--color-*` CSS custom properties or Bootstrap classes

## Output format

Show the generated TSX snippet, then apply it to the file with the Edit tool. Report what was changed.