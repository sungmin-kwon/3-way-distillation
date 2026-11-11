# Writing working notes

This is the style and accuracy guide for the notes in `src/content/notes/`. It is written so that
any model, including a small local one, can read it and draft a note that matches the existing
ones. Read all of it before drafting. If there is room in the context, also read one finished
note as a model to imitate (see [Reference notes](#reference-notes)).

These are Sungmin's study and research notes from graduate school in data science, kept so that
methods and results can be looked up later. The reader is a technical person who knows some
statistics, often Sungmin a year from now. Write for that reader.

This file is shared with the other sites in the family. The parts that belong to this site only
are the tags (section 2), the language for code (section 6), the affiliation rule (section 1),
the known traps (section 7) and the reference notes. See `SHARED.md`.

## The hard rules

Every one of these was broken in an earlier draft and had to be fixed after review. If you
remember nothing else from this file, follow these. Details are in the sections named.

1. **Work on a branch from the current `main`, and open a pull request.** Never push to `main`,
   and never merge your own PR. Fetch `main` first, so you follow the current version of this
   file (section 10).
2. **Run `npm run check` and `npm run build`; both must pass.** Then **open the page** in a
   browser and look at it, at full width and at phone width. Don't write "it renders" unless you
   did this (sections 6 and 9).
3. **Every computed number comes from a calculation you ran.** Code output in a note is pasted
   from a real run, never typed. If you couldn't run it, say so in the PR and leave the output out (section 7).
4. **Don't state a cause, a direction or a mechanism you can't support** with a source you
   opened or a calculation in the note. "X is the reason for Y" needs evidence (section 7).
5. **Every cited work is in a `## Sources` list with a working link**, and every link was opened
   or resolved. Never write a DOI, volume or page number from memory. Cite only what the text
   uses (section 6).
6. **No `## Limits` section, no "I", no em dashes in the body, `$$` on its own lines** (sections
   1, 5 and 6).
7. **No private details.** The school and its courses may be named; unpublished research,
   internal or patient data, and people other than the cited authors may not (section 1).
8. **Numbers shared between notes stay in sync.** If you change a number another note quotes,
   change it there too (section 7).
9. **End the PR description with what you could not verify.** An honest list is worth more than
   a clean-looking draft (section 9).

## 1. Voice

- **Plain, exact, and calm.** Say what is true and how we know. No hype, no "fascinating",
  no "in this note we will explore", no closing pleasantries or calls to action.
- **Explain, then show.** State the idea in a sentence, then make it concrete with a number,
  an equation, or a worked example.
- **Full sentences and short paragraphs** of two to five sentences. Lead each section with its
  point. Lists are for parallel items (sources, cases, options), not for a chain of reasoning.
- **No first-person singular.** Never "I", "me", "my" or "I'll". Write around it: "Throughout,
  the note uses one worked example", "This rests on reporting, not the ruling itself", "isn't
  checked here". When a first person truly can't be avoided, use "we" ("Translations are our
  own"), and use even that sparingly. Contractions (it's, doesn't) are fine.
- **Affiliation, within limits.** These are notes from study at Seoul National University, so
  the school, a course ("from the GSDS regression course") or a public dataset used in one may
  be named. Never describe unpublished research results, internal or patient-level data, a
  hospital's or lab's systems, or colleagues. A method is fine to write up; what a lab found
  with it before publication is not.
- **Punctuation:** en dash (–) for pairs and ranges: ethanol–water, McCabe–Thiele, 1–4.
  Avoid em dashes (—) in body text; use a comma, a colon, or a new sentence. One em dash in the
  `summary` line is fine. No arrow chains (A → B → C) in prose.
- **Emphasis:** **bold** a key term where it is defined, or the one fact a reader must not miss.
  *Italics* for a term being introduced (*congeners*, *Rayleigh distillation*) and for quoted
  prompts or examples. Don't bold whole sentences.
- **Correct the common story when it's wrong**, briefly and without drama: "so it doesn't
  concentrate cleanly in the heads, contrary to the common story."
- **Hedge only where there is real uncertainty**, and say what the uncertainty is. "A real pot
  still gives slightly stronger distillate than this one-stage model" is a good hedge. "It is
  generally thought that" is not.

## 2. Files and frontmatter

One Markdown file per note in `src/content/notes/`. The file name, in kebab-case, is the
note's id and URL: `soft-targets.md` → `/notes/soft-targets/`. Don't rename a published note;
it breaks links.

```md
---
title: Forward vs. reverse KL          # omit for a short note
date: 2026-11-12                       # required, YYYY-MM-DD
updated: 2026-11-20                    # only when a published note changes materially
tags: [stats]                          # stats, genes; zero or more
summary: One line for the index.       # long notes
distillate: The boiled-down version.   # long notes
rough: true                            # unfinished thinking; leave out otherwise
draft: true                            # unfinished, not published; leave out otherwise
hidden: true                           # finished but withheld from the site; leave out otherwise
model: [Claude Opus 5.5]               # model(s) that wrote or revised it; never shown on the site
reviewed_by: [Claude Opus 5.5]         # optional: model(s) that did a separate review pass
---
```

- **Tags:** only these two: `stats` (probability and statistics, the machinery underneath the
  other notes) and `genes` (genetics, genomics and the clinical data around them). The list lives
  in `site.config.mjs`, and the build fails on any other tag. Don't invent new tags; ask first.
- **Hidden notes:** `hidden: true` keeps a finished note off the site: no page, and not in the
  index, tag pages, RSS or search. A `note:` link to it from a visible note turns into plain text
  and becomes a link again when the note is unhidden. `draft: true` builds the same way but means
  unfinished. `ADMIN.md` at the repo root lists every note with its status; it is regenerated by
  `npm run admin` and before every build, and is not deployed (but the repo is public).
  **To unhide a note:** delete its `hidden: true` line, run `npm run build` (which also refreshes
  `ADMIN.md`), check that the note and the links to it render, and commit both files.
- **Model:** list every model that drafted or substantially revised the note, earliest first,
  as it calls itself (`[Mistral Large 4, Claude Opus 5.5]`). Add a name when a model revises the
  note; never remove one. The site never shows it, but the repo is public, so anyone reading the
  source can see it. Leave it out for a note written by hand.
- **Reviewed by (optional):** when a separate review pass checked the note (section 10), list the
  reviewing model(s) here. A reviewer that also edits the text goes in `model` too, so `model`
  is always the full list and `reviewed_by` only records who did a review. Not every note gets
  a separate review; leave the field out when none happened. Never shown on the site.
- **No H1 in the body.** The title comes from frontmatter. Sections are `##`; use `###` rarely.
- Quote a frontmatter value with `"..."` if it contains a colon followed by a space.

## 3. Short notes and long notes

**A short note** has no title. It is two to five sentences, shown in full on the index: one
observation, number, or correction, with enough context to stand alone. No headings, no
distillate. Example:

```md
---
date: 2026-11-14
tags: [stats]
---
Under the null hypothesis a p-value is uniform on [0, 1], so each test at $\alpha = 0.05$ has a
5% chance of a false positive. With 20 independent tests the chance of **at least one** is
$1 - 0.95^{20} = 0.64$, not 0.05. That is why a scan of many tests needs a stricter threshold.
```

**A long note** has a title, `summary`, `distillate`, and sections. The existing long notes run
1,500–3,000 words. Length should come from worked detail, not from repetition.

Use `rough: true` for a note that is honest thinking-in-progress: unchecked
numbers, open questions, an argument you're not sure of. Say in the text what is unchecked.
**Not being able to read a book page by page is not, by itself, a reason for `rough`.** A claim
about a book is checked when it rests on the book's table of contents or publisher description,
on a peer-reviewed source whose abstract you read and that states the claim, or on a passage you
quote. Leave `rough` off when every claim is checked that way, and list what rests on secondary
sources in the PR's **Not verified**. Use `rough` only when a claim in the note itself is
uncertain or contested and the text says so.

## 4. The summary and the distillate

**`summary`** is one line on the index under the title. It says what the note covers, and a
long one may list its parts after an em dash: "Knowledge distillation for language models,
worked through on one next-token example — soft targets and temperature, the T² factor, …".

**`distillate`** is shown at the top of the note. It is the note boiled down to two to four
sentences that make sense alone: the conclusion, the key numbers, and the main limit. A reader
who stops after the distillate should still come away knowing the answer. It is not a teaser
and not a table of contents. It is **plain text**: no links, no `note:` targets, no bold, no
code. Markdown there shows up on the page as literal brackets and asterisks.

> Good: "For a 50/50 feed split into 95% and 5% products at α = 2.5 and 1.5 × minimum reflux,
> that comes to 12 stages. It only holds for binary mixtures with constant molar overflow, so it
> teaches how a column works rather than designing one."
>
> Bad: "This note explores the McCabe–Thiele method and why it matters."

Every number in the summary or distillate must also appear, identically, in the body.

## 5. Shape of a long note

1. **Opening paragraph (no heading):** what the thing is, why it matters, where it comes from
   (who named it, when). Two to four sentences.
2. **Safety or legal note, if any,** as a one-paragraph `>` blockquote right after the opening.
3. **One worked example, set up early** and carried through the whole note. Put its parameters
   in a small table (`| | value |`). Every later section returns to the same numbers.
4. **Sections that each answer one question.** Headings are short noun phrases or questions:
   "The q-line", "Why match a distribution and not just the answer", "Evaluation is the hard part".
5. **Caveats where they bite, not in a closing section.** There is no `## Limits` section. When an
   assumption changes a result, say so in the section that uses it ("this holds only for constant
   molar overflow"). Keep a caveat only if a careful reader would be misled without it; cut generic
   lines such as "real data is messier" or "this is not a verdict".
6. **Optional ending:** a `## Summary` paragraph, or `## Open questions`
   as a short list. Don't do both.
7. **`## Sources` last**, listing every cited work with its link (section 6).

## 6. Conventions

**Math (KaTeX).** Inline `$x_D$`. For display math, the opening `$$` and the closing `$$` each
go on **a line by themselves**, with the formula on the lines between:

```md
$$
y = \frac{\alpha x}{1 + (\alpha - 1) x}
$$
```

Written on one line (`$$y = \frac{…}{…}$$`), the parser treats it as *inline* math: fractions
shrink to text size, sub- and superscripts get cramped, and the equation isn't centered. The
build doesn't warn about it, but `npm run check` does.

**Keep display equations narrow.** A long equation is clipped at the column edge, worst on a
phone. If a formula, its substituted numbers and its result don't fit in about 60 characters of
rendered width, split it into two display blocks (the general form, then the numbers), or move
the unit into the sentence. Check every equation on the rendered page at phone width (about
400 px). Matrix rows end with `\\`, never a single `\`.

Define every symbol in words the first time it appears ("where $W$ is the moles of liquid in
the pot"). Show the general formula, then substitute the example's numbers:

```md
$$
D = F\,\frac{x_F - x_B}{x_D - x_B} = 100 \cdot \frac{0.45}{0.90} = 50 \text{ kmol/h}
$$
```

Use `\text{}` for units and words inside math, and `\mathrm{KL}`, `\mathrm{ABV}` for named
operators.

**Numbers and units.** Always give units and the basis: mole fraction, wt %, or ABV (% by
volume at 20 °C); kmol/h; nats. State the temperature and pressure that data holds at. Use a
space between number and unit (78.4 °C, 2.4 L), and × for multiplication in prose. Keep only as
many digits as the source supports, usually two or three significant figures.

**Tables.** For data, comparisons, and the steps of a worked example. Units go in the header or
the first column. Cite the source of any data table in the sentence above it ("Carey and Lewis,
1932, as tabulated in standard textbooks").

**Code.** Python for `stats` notes. **Base R for `genes` notes**, since R
is the standard in that field: no packages from CRAN or Bioconductor, only what ships with R
(`stats`, `graphics`). It must run as written: include imports, name the shapes in comments
(`# [batch, seq, vocab]`), and keep it under about 30 lines (a simulation that feeds a figure may
run longer). Code illustrates the idea; it isn't a library.

**Code output is pasted, never written.** Run the code exactly as it appears in the note, and copy
what it printed into the output block below it. Every number the prose takes from the code must
appear in that output. If the code uses random numbers, set a seed (`set.seed(1)`,
`np.random.default_rng(1)`) so the output is reproducible. If you can't run the code, don't
include an output block, and say in the PR that the code is unrun.

**Figures.** Inline `<svg>` only, with `role="img"`, a descriptive `aria-label`, and a
`<title>`. Colors come from CSS variables so dark mode works: `style="stroke: var(--ink)"`,
`var(--muted)`, `var(--accent)`, `var(--rule)`, and `fill="currentColor"` for text. Put an
italic caption after the SVG, with **a blank line** between `</svg>` and the caption (without it,
the caption is swallowed into the HTML block and shows literal `*` and `$`). **Plot data from coordinates computed by a
script, never by hand.** If you can't compute them, leave the figure out and write
`<!-- TODO figure: … -->`. Computed coordinates aren't enough on their own: **render the figure**
(open it in a browser, or screenshot it with a headless one) and check that no label or number
crosses a curve or line, that each region label sits in the region it names, and that axis
labels line up with their values. Check it in dark mode too.

**Links.** Between notes: `[industrial column](note:reading-a-mccabe-thiele-diagram)`, using the
other note's file name without `.md`. Never write relative paths like `../notes/…`. Link to a
note only if it exists. External links only to primary or stable sources (papers, standards,
official docs).

**Citations.** Name the authors and year in the text: "Hinton, Vinyals and Dean (2015)", "Kim
and Rush (2016)". Collect every cited work in a `## Sources` list at the end of the note, one
entry per line, in this format (as in `genome-wide-association-studies.md`):

```md
## Sources

- L. Yengo et al., "A saturated map of common genetic variants associated with human height", *Nature* 610, 704–712 (2022). [doi:10.1038/s41586-022-05275-y](https://doi.org/10.1038/s41586-022-05275-y)
- B. F. Voight et al., "Plasma HDL cholesterol and risk of myocardial infarction: a mendelian randomisation study", *Lancet* 380, 572–580 (2012). [doi:10.1016/S0140-6736(12)60312-2](https://doi.org/10.1016/S0140-6736(12)60312-2)
```

- **Every entry has a link**: `https://doi.org/…` for a paper with a DOI, `https://arxiv.org/abs/…`
  for a preprint, or the official page for a standard, dataset or piece of software. Link the DOI
  and the arXiv id when both exist.
- **Check every entry before you write it.** Resolve the DOI (`https://api.crossref.org/works/<doi>`
  returns the title, authors, journal, volume and pages) and copy the details from what comes
  back. About ten DOIs, volumes or page ranges written from memory were wrong in the first
  drafts of the four `genes` notes. If you can't resolve a work, don't cite it; say in the PR that it needs a source.
- **Cite only what the text needs**: a work the note quotes a number, result or method from. Not
  background reading, not a second source for the same point.
- **Describe a cited work only by what it says.** Before writing "Park et al. (2023) converted
  the hospital's records to OMOP", read the abstract and check it says that. A paper's topic is
  not its finding.
- Footnotes (`[^1]`) are for asides, or for a source tied to one specific claim, such as a spec
  limit from a data sheet. A footnote that cites a work still carries its link.

**Cite only what a reader can check.** A source must be specific enough to look up: a DOI or
arXiv id, a standard's number, a stable database page (for physical data, the
[NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/)), or a book with its edition and
the table or page. Never cite from memory: a textbook appendix named from memory, for constants
that turn out not to be in it, is worse than no citation. If you can't open the source, say
where the number came from ("standard Antoine constants, not checked against a primary source
here") or mark the note `rough: true`.

## 7. Accuracy rules

The style is easy to copy; the accuracy is not. Earlier drafts of most notes had real
errors. These rules matter more than anything above.

1. **Recompute every number** in a worked example, preferably with code, and check that tables,
   prose, distillate, and figure agree with each other.
2. **Check every factual claim against a source** you could name. If you can't, cut it, or mark
   the note `rough: true` and say what is unchecked.
3. **Don't invent precision.** "About 97% ABV" beats a fake "96.85%".
4. **Round once, then use the rounded numbers everywhere.** Every value in the distillate, the
   tables, the prose, and each substituted equation must be the rounded value the body quotes,
   and an equation written with rounded inputs must give its stated result with those inputs.
   If the text says "at 95.1 °C", the vapor pressures shown must be the ones at 95.1 °C, not at
   an unrounded 95.14 °C; if it says $\alpha = 2.47$, the next line computes with 2.47. When
   rounding makes a check miss (759 instead of 760 mmHg), quote one more digit or say "about".
5. **Stay inside a fit's range.** Empirical fits (Antoine constants, correlations) come with a
   stated range; say so when a calculation or figure goes beyond it.
6. **Name a real example only if it is documented** to be what you say. A model trained from
   scratch is not a distilled model because it is small.
7. **Watch the basis of every percentage** (mole, mass, volume) and the sign and direction of
   every effect (reads high or low, rises or falls, positive or negative slope).
8. **Prefer mechanism over folklore.** Explain why something happens; if the usual explanation
   is wrong, say so and give the right one.
9. **A cause needs evidence.** Write "X causes Y", "X is why Y", or "Y happens because X" only
   when a source you opened says so, or the note's own numbers show it. When the note can compute
   it, compute it. Otherwise write what is known ("the two are related", "one proposed reason
   is", with a source) or leave it out.
10. **Check the direction twice.** For every effect, bias, correction or sign, ask which way it
    goes and why, then check it against a source or a small calculation. Reviewers caught
    reversed directions in two notes (the hydrometer correction and winner's curse in MR).
11. **Count the right thing.** Say what each number counts and keep it the same through the
    calculation: alleles or people, moles or kilograms, tokens or words, per head or per layer.
12. **Check every identifier against its source**: gene names, concept ids, model names, version
    numbers, dates. One letter turned LIPG into LPA and reversed a well-known result.
13. **Keep shared numbers in sync.** Before changing a number, search the other notes for it
    (`grep -rn "1.49" src/content/notes/`). If another note quotes it, update both in the same PR.
    The medical-codes note reuses the GWAS note's toy numbers, for example.
14. **Date anything that will go stale.** Records, the state of a field, a pending court case,
    "the largest so far": put them in a section that says "as of" a month and year, so a later
    edit knows what to refresh. A dated section is a snapshot, not a promise of upkeep: refresh it
    only when the note is edited for another reason.
15. **Attribute each position to the person who holds it.** When a note contrasts schools or
    authors, or quotes a result, every claim says whose it is and rests on that author's own
    work or a source that states it. A draft gave the equal-variance binormal approximation for
    AUC as if it were the exact liability-threshold result (Wray et al., 2010).
16. **Check what a source argues, not only that it exists.** Read its abstract or the
    publisher's description and make sure it supports the sentence that cites it. A paper whose
    title criticizes a theory is not support for that theory. If you can open neither the work
    nor its abstract, cut the claim instead of keeping it with an "unverified" note. A draft
    cited a process-mining study on OMOP data as if it documented a hospital's OMOP conversion,
    which its abstract doesn't describe.
17. **Keep look-alike distinctions apart.** When two concepts or notations resemble each other,
    state each from its source and never map one onto the other. A draft wrote the normal as
    $N(\mu, \sigma)$ and later as $N(np, np(1-p))$, switching the second argument from standard
    deviation to variance.
18. **A worked example must agree with its own numbers.** Every conclusion drawn from the
    example follows from what it shows, and the example shows what the text says it shows. Don't
    claim the example's result is new or "absent from the literature". A draft illustrated "mean
    and variance don't determine a distribution" with Binomial(10, 0.05) and Poisson(0.5), which
    share only the mean.
19. **Crossref describes the edition the DOI points to.** A reissue's record gives the reissue
    year and sometimes the wrong author or subtitle. Take the original publisher, year and
    authors from the book or a library record, and when the link is a later edition, say so
    ("linked: 3rd ed.").

### Known traps (each one appeared in an earlier draft)

| Topic | Wrong | Right |
| --- | --- | --- |
| links | `../posts/other-note/` | `note:other-note` |
| figure captions | caption on the line straight after `</svg>` (shows literal `*…*` and raw `$…$`) | a blank line between `</svg>` and the italic caption |
| display math | `$$y = \frac{a}{b}$$` on one line (renders inline and cramped) | `$$` alone on the line above and the line below the formula |
| data citations | a textbook appendix cited from memory | a source that was actually opened: NIST WebBook, DOI, or edition and table |
| DOIs and page numbers | written from memory (wrong volume, pages, journal or author) | resolved through Crossref and copied from the result |
| distillate | ends with a `[link](note:…)` | plain text; the link goes in the body |
| GWAS sample size | a 2×2 table of allele counts read as people | each person carries two alleles: 800 alleles = 400 people |
| winner's curse in MR | understates the instrument | inflates the discovery effect $\beta_{XG}$, so a two-sample estimate is biased toward the null |
| HDL Mendelian randomization | variant in LPA | LIPG Asn396Ser (Voight et al. 2012); Lp(a) is a separate, causal risk factor |
| PRS clumping | the same as LD pruning | clumping keeps the most significant SNP in each LD block; pruning ignores p-values |
| PRS accuracy | quoting heritability as the score's variance explained | heritability is the ceiling; the score explains less (for height about 40% in European ancestry, less elsewhere) |
| OMOP drug queries | `drug_exposure` filtered on the ingredient concept | real rows are clinical drugs; go through `concept_ancestor` from the ingredient |
| Sources link text | the full URL as the link text | a short label (itl.nist.gov, 1.3.6.6); a long URL can't wrap and scrolls the page sideways on a phone |
| moments don't determine a distribution | comparing two distributions that share only the mean | match both moments, e.g. a normal N(μ, σ²) with the same mean and variance |

## 8. Template for a long note

```md
---
title: <Short noun phrase or question>
summary: <What it covers, in one line> — <part>, <part>, <part>.
date: YYYY-MM-DD
tags: [<stats|genes>]
distillate: <The answer in one sentence.> <The key number from the worked example.> <The main limit or caveat.>
model: [<the model writing this>]
---

<What it is and why it matters, two to four sentences. Who named it and when.>

<Optional: > one-paragraph safety or legal note.>

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| <parameter> | <value with units> |

## <First idea>

<State it. Define symbols. General formula, then the example's numbers.>

## <Second idea>

...

## Sources

- <Authors>, "<Title>", *<Journal>* <vol>, <pages> (<year>). [doi:<doi>](https://doi.org/<doi>)
```

### A worked example in this style

```md
---
title: Why softmax subtracts the max
summary: The overflow that a naive softmax hits on large logits, and the one-line fix — shift invariance, a two-token example, and log-softmax.
date: 2026-11-15
tags: [stats]
distillate: Softmax is unchanged when the same constant is added to every logit, so implementations subtract the largest logit before exponentiating. For logits (1000, 999) the naive version overflows, and the shifted one gives 0.731 and 0.269 exactly as for (1, 0). The same shift keeps log-softmax stable.
---

Softmax turns a vector of logits into probabilities. Computed exactly as written, it breaks on
inputs that are perfectly ordinary for a language model, because $e^{z}$ overflows a 32-bit
float once $z$ passes about 88.

## Shift invariance

For any constant $c$,

$$
\frac{e^{z_i - c}}{\sum_j e^{z_j - c}} = \frac{e^{-c}\,e^{z_i}}{e^{-c}\sum_j e^{z_j}} = \frac{e^{z_i}}{\sum_j e^{z_j}}
$$

so choosing $c = \max_j z_j$ changes nothing mathematically, and makes the largest exponent
$e^0 = 1$.

## A two-token example

With logits $(1000, 999)$, $e^{1000}$ is `inf` and the result is `nan`. Subtracting 1000 gives
$(0, -1)$, and $1/(1 + e^{-1}) = 0.731$, so the probabilities are 0.731 and 0.269.

## Log-softmax

The same shift keeps the log finite: $\log p_i = (z_i - c) - \log \sum_j e^{z_j - c}$, with
$c = \max_j z_j$. Library functions such as `torch.log_softmax` compute it this way.
```

## 9. Self-check before handing over a draft

Go through this list and fix anything that fails. Then report which items you could not verify.

- [ ] `npm run check` and `npm run build` both pass.
- [ ] The page was opened in a browser, at full width and at phone width: no red KaTeX errors, no
      clipped equations, no literal `$`, `*` or `[`, figures and captions in place.
- [ ] Frontmatter has `date` and `model` (plus `reviewed_by` if a separate review happened); a long note also has `title`, `summary`,
      `distillate`, and tags from the list in `site.config.mjs`.
- [ ] No "I", "me" or "my" anywhere; "we" only where unavoidable.
- [ ] The distillate stands alone, gives the answer and a key number, and matches the body.
- [ ] One worked example runs through the note, with its parameters in a table.
- [ ] Every number has units and a basis, and every number in the example was recomputed.
- [ ] Every symbol is defined in words on first use.
- [ ] Every named paper, model, and dataset is real and described correctly.
- [ ] None of the known traps in section 7 appears.
- [ ] Internal links use `note:` and point to notes that exist.
- [ ] Display math has `$$` alone on its own line before and after the formula.
- [ ] Code runs as written, and every output block was pasted from a real run (with a seed if
      random). SVG uses CSS variables and computed coordinates.
- [ ] The figure was rendered and checked: no label crosses a curve, region labels sit in their
      regions, and it reads in dark mode.
- [ ] Every cited work is in `## Sources` with a link, and every DOI was resolved, not recalled.
- [ ] Each source supports the sentence that cites it (its abstract was read), and each view in
      a comparison is given to the author who holds it (section 7, rules 15–17).
- [ ] Each cited work is described by what its abstract says, and each is used in the text.
- [ ] Every "because", "causes" or "the reason" has a source or a calculation behind it, and
      every direction (high/low, up/down, toward/away from the null) was checked.
- [ ] Any number also used in another note matches there (search with `grep`).
- [ ] No unpublished results, internal or patient data, or colleagues; the school and courses only.
- [ ] Rounded values are the same everywhere, and each worked equation checks with them.
- [ ] No H1, no em dashes in body text, no hype, no "in this note we will".
- [ ] No `## Limits` section. Each caveat sits in the section it qualifies and would mislead a
      careful reader if cut.
- [ ] Anything unchecked is either cut or flagged, with `rough: true`.

Paste this list into the PR description with each box ticked or not, and add a section
**Not verified** listing every claim, number or source you couldn't check. An empty list is fine
only if it's true.

## 10. Workflow: draft cheap, review strong

Most notes are drafted by a cheaper model and reviewed by a stronger one. A guide like this
fixes structure and voice well, but a smaller model will still make factual errors, so the
review is where accuracy comes from. The reviewer follows `REVIEWING.md`.

1. **Branch.** `git fetch origin main` and `git switch -c <short-name> origin/main`. A branch cut
   from an old `main` follows an old version of this file; one draft broke its whole page that way.
2. **Draft** with this file, one reference note close to the topic, and the source material.
   Run the code, run `npm run check` and `npm run build`, and open the page.
3. **Open a PR**, never a direct push to `main`. The description has the self-check from section
   9, the **Not verified** list, and the commands you ran with their result.
4. **Review** with a stronger model, following `REVIEWING.md`. The review lists errors as *must
   fix* and *should fix*.
5. **Fix** on the same branch. Address every item; in the PR, say for each one what you changed,
   or why you didn't. Don't fix things the review didn't ask for in the same commit.
6. **Merge** only when Sungmin approves. A drafting model never merges its own PR.

When a review finds a new kind of mistake, add it to the known-traps table in section 7, so the
next draft avoids it.

This split is one option, not a requirement. A note can also be written and checked by one
model, or by hand. Whatever the route, the accuracy rules in section 7 still apply, `model`
lists every model that wrote or revised the note, and `reviewed_by` is filled in only when a
separate review pass took place.

## Reference notes

These notes show the target quality. Give a drafting model the one closest to the
new note's topic:

- `genome-wide-association-studies.md` (`genes`): a toy test and a simulated scan in base R, with
  Manhattan and QQ plots computed from the simulation's output, and a linked Sources list.
- `mendelian-randomization.md` (`genes`): a worked two-sample estimate in base R, with the
  direction of each bias worked out.
- `discrete-and-continuous-distributions.md` (`stats`): one discrete and one continuous example
  carried through every section in Python, with a computed figure.
- `medical-codes.md` (`genes`): identifiers checked against their sources, and numbers kept in
  sync with another note.

When a new note becomes a better example, add it here and add any new trap to section 7.
