# /add-locale Workflow

1. Prompt the user for the target locale code (e.g. `tr`, `de`, `ar`) and verified search queries for the top tools.
2. Add the entries to `lib/tools.ts` under each tool's `localized` mapping with `reviewed: false`.
3. If RTL, ensure `dir="rtl"` logical utility classes are applied.
4. Run `pnpm build` and verify that the new routes render with `noindex`.
5. Only set `reviewed: true` after native speaker review of the copy.

