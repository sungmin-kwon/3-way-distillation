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
   Don't trust ticked boxes: compare each ticked item with the diff. A draft ticked the bracket
   rule while using the wrong brackets throughout.
2. **Check the bar first.** Read the note once through and judge it against the five tests in
   WRITING.md, [The bar](WRITING.md#the-bar-depth-not-polish). Write one line per test: pass or
   fail, with the passage that decides it. If a test fails, stop here: the verdict is *rework*,
   and the review says what the note would need to pass (the derivation it skips, the example
   that would show something). A line-by-line review of a note that won't be published wastes
   both rounds.
3. **Check for overlap.** Run `npm run similar -- <note-id>` and compare the drafter's account in
   the PR with the top of its list. Open the notes whose headings look close and check for a
   section or worked example that repeats one of them. Overlap is a *should fix*: cut the
   repeated part to what this note needs, or trim the older note. Also check that the note has no
   "see the … note" and stands on its own.
4. **Run the mechanical checks.** `npm run check` and `npm run build`. Fix nothing yourself yet;
   list failures as *must fix*.
5. **Render the page** with `npm run preview` (or `npm run dev`) and a headless browser.
   Screenshot it at about 1,200 px and about 400 px wide, in light and dark mode. Look for red
   KaTeX errors, equations clipped at the column edge, literal `$`, `*` or `[`, captions
   swallowed into a figure, and labels that cross curves. A page that breaks partway down often
   shows only in the lower half.
6. **Run the code** exactly as written in the note (in the language WRITING.md section 6 sets for its tag), and compare
   its output with the output block and with every number the prose takes from it.
7. **Recompute the worked example** independently: each substituted equation, each table row, and
   every number in the summary and distillate. Check that rounded values are used consistently.
8. **Check each claim that a reader would rely on**, with this priority:
   - **Direction and sign** of every effect, bias and correction. Work it out, don't assume.
   - **Causal claims** ("because", "the reason", "causes"): is there a source or a calculation?
   - **What is counted**: alleles or people, per head or per layer, mole or mass basis.
   - **Identifiers**: gene names, concept ids, model names, versions, dates.
   - **Overclaims**: "every", "all", "always", "the standard", and claims that a cited dataset
     or cohort comes from somewhere it doesn't.
9. **Check every source.** Resolve each DOI through `https://api.crossref.org/works/<doi>` and
   compare authors, title, journal, volume, pages and year. Check arXiv ids on the abs page. Read
   the abstract and check the note describes the work by what it actually found. Flag any source
   the text doesn't use. If a page can't be fetched, say "unverified" rather than guessing.
   Check each source's stance: a critique of a theory cited as support for it is a must-fix.
   For a book linked through a reissue DOI, check the original publisher and year separately.
10. **Check against the traps table** in WRITING.md section 7, and against the other notes:
   any number shared with another note must match (`grep -rn` for it).
11. **Check attribution and concepts.** In a note that contrasts schools or authors, check that
   each view is given to the person who holds it, and that look-alike distinctions in a framework
   aren't merged (WRITING.md section 7, rules 15 and 17). For a note not in English, read it at
   the level of characters: substituted brackets or misspelled names pass the build.
12. **Check framing**: the affiliation rule in WRITING.md section 1, no first person, no
   `## Limits`, tags from the list in `site.config.mjs`, `model` lists every model involved.

## Writing the review

Save it as Markdown, and post or attach it to the PR. Use this shape:

```md
# Review: <note title> (PR #<n>, <drafting model>)

<One-paragraph verdict: what was checked and passes (build, code, numbers, figures), and the
overall call: merge, fix then merge, or rework.>

## The bar
1. Derives its central result: pass/fail, <passage>
2. Example shows something the formula doesn't: pass/fail, <passage>
3. Connects ideas inside the note: pass/fail, <passage>
4. Says where it breaks: pass/fail, <passage>
5. More than a survey: pass/fail, <passage>

## Overlap
<Notes checked (from npm run similar) and what, if anything, repeats.>

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

- **Rework**: the note fails a test of the bar. Say what it would need; don't list line edits.
  If the note is already published, also say whether it should move to purgatorial thoughts
  until then (WRITING.md, the bar); Sungmin decides.
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
