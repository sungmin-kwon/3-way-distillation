# Reviewing a note

This is the checklist for the review pass in WRITING.md section 10: a stronger model checks a
note drafted by a cheaper one. The review is where accuracy comes from, so it checks facts,
numbers and the rendered page, not wording. Read `WRITING.md` first; this file assumes it.

## What to skip

Don't flag wording that is correct and clear enough. Each review item costs a fix round, so a
phrase that could be smoother, a synonym, or a sentence order is not worth one. Flag wording only
when it would mislead a reader or states something false. If there are a few small polish points
worth keeping, put them under **Optional**, in one short list.

## The pass, in order

1. **Branch and process.** Is it a PR from a branch cut from current `main`? Did the drafter
   paste the self-check and a **Not verified** list? Anything listed there is the first thing to
   check. A note pushed straight to `main` gets reviewed the same way, and the fixes go through a PR.
2. **Run the mechanical checks.** `npm run check` and `npm run build`. Fix nothing yourself yet;
   list failures as *must fix*.
3. **Render the page** with `npm run preview` (or `npm run dev`) and a headless browser.
   Screenshot it at about 1,200 px and about 400 px wide, in light and dark mode. Look for red
   KaTeX errors, equations clipped at the column edge, literal `$`, `*`, `[` or `note:`, captions
   swallowed into a figure, and labels that cross curves. A page that breaks partway down often
   shows only in the lower half.
4. **Run the code** exactly as written in the note (in the language WRITING.md section 6 sets for its tag), and compare
   its output with the output block and with every number the prose takes from it.
5. **Recompute the worked example** independently: each substituted equation, each table row, and
   every number in the summary and distillate. Check that rounded values are used consistently.
6. **Check each claim that a reader would rely on**, with this priority:
   - **Direction and sign** of every effect, bias and correction. Work it out, don't assume.
   - **Causal claims** ("because", "the reason", "causes"): is there a source or a calculation?
   - **What is counted**: alleles or people, per head or per layer, mole or mass basis.
   - **Identifiers**: gene names, concept ids, model names, versions, dates.
   - **Overclaims**: "every", "all", "always", "the standard", and claims that a cited dataset
     or cohort comes from somewhere it doesn't.
7. **Check every source.** Resolve each DOI through `https://api.crossref.org/works/<doi>` and
   compare authors, title, journal, volume, pages and year. Check arXiv ids on the abs page. Read
   the abstract and check the note describes the work by what it actually found. Flag any source
   the text doesn't use. If a page can't be fetched, say "unverified" rather than guessing.
8. **Check against the traps table** in WRITING.md section 7, and against the other notes:
   any number shared with another note must match (`grep -rn` for it).
9. **Check framing**: the affiliation rule in WRITING.md section 1, no first person, no
   `## Limits`, tags from the list in `site.config.mjs`, `model` lists every model involved.

## Writing the review

Save it as Markdown, and post or attach it to the PR. Use this shape:

```md
# Review: <note title> (PR #<n>, <drafting model>)

<One-paragraph verdict: what was checked and passes (build, code, numbers, figures), and the
overall call: merge, fix then merge, or rework.>

## Must fix
1. **<What is wrong, in one line.>** <Where (section or line).> <Why it is wrong, with the
   evidence: a source with its link, or the calculation.> <The fix, concrete enough to apply
   without judgment: the replacement number, sentence or citation.>

## Should fix
...

## Optional
...

## Fine as is
<What was checked and is right, so the drafter doesn't change it.>
```

- **Must fix**: false statements, wrong numbers, reversed directions, unsupported causes, broken
  rendering, wrong or unverifiable citations, rule breaks from the hard rules in WRITING.md.
- **Should fix**: overstatements, missing context a careful reader needs, rounding drift.
- Give the fix, not only the problem. A cheaper model applies a concrete replacement reliably and
  an open-ended "rethink this" poorly.
- Mark anything you couldn't check as **unverified**, and say what to check.

## After the review

- When the fixes come back, check each item was done and nothing else changed by accident, then
  re-render the page.
- If the review found a new kind of mistake, add a row to the known-traps table in WRITING.md
  section 7 in the same PR, or a follow-up.
- Add the reviewer to `reviewed_by`, and to `model` too if it edited the text.
