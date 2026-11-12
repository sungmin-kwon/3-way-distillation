# Writing notes

This is the style and accuracy guide for the notes in `src/content/notes/`. It is written so that
any model, including a small local one, can read it and draft a note that matches the existing
ones. Read all of it before drafting, especially [The bar](#the-bar-depth-not-polish). If there
is room in the context, also read one finished note as a model to imitate (see
[Reference notes](#reference-notes)). Don't read the other notes on nearby topics before
drafting: the overlap check comes after the draft (section 10).

The site holds four notebooks (sections), each with its own tags, look and path:

- **notes from the 3-way distiller** (`/3-way-distillation/`, tags `cheme`, `ml/llm`, `qi/qc`): a
  personal notebook. Sungmin writes things down here to understand them properly. The reader is a
  curious, technical person, often Sungmin a year from now.
- **working notes** (`/working-notes/`, tags `stats`, `genes`, `data`): study and research notes
  from graduate school in data science, kept so that methods and results can be looked up later.
  The reader is a technical person who knows some statistics, often Sungmin a year from now.
- **marginalia** (`/marginalia/`, tags `history`, `language`, `geography`): notes on things outside mathematics, science
  and technology, starting with history, written in English. The reader is curious and
  careful but not a specialist, and may not read the languages its sources are written in.
- **purgatorial thoughts** (`/purgatorial-thoughts/`, no tags): notes that fell below the bar
  (see below).

Write for that reader. A note's tags decide its notebook, so its tags all come from one of them.
The rules below are the same for all of them, except where a rule names a notebook: the
affiliation rule (section 1), the tags (section 2), the language for code (section 6), the
default version of the bar, and the sources for marginalia (The bar).

The Korean notebook (사회학 개론) is a separate repository, `korean-notes`, with its own copy of
this guide. Shared code is kept in step with it (see `SHARED.md`).

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
7. **No affiliation or private details.** In the distiller, don't name or hint at a lab,
   hospital, university, employer or project. In working notes, the school and its courses may be
   named; unpublished research, internal or patient data, and people other than the cited authors
   may not (section 1).
8. **Numbers shared between notes stay in sync.** If you change a number another note quotes,
   change it there too (section 7).
9. **Mark what you could not verify in the note itself, and list it at the end of the PR.** A
   detail added from memory and flagged only in the PR reads as checked to everyone who sees the
   page. An honest list is worth more than a clean-looking draft (sections 7 and 9).
10. **Meet the bar below, and don't link to other notes.** Each note stands on its own: explain
    what it needs in place rather than pointing elsewhere (section 6).

## The bar: depth, not polish

The bar comes in two versions, chosen by the kind of argument a note makes, not by its subject.
The **quantitative bar** (the five tests just below) is for notes that argue with models,
derivations or calculations: the mathematics, science and technology notes, and most economics.
The **qualitative bar** (after it) is for notes that argue from sources and interpretation:
history, and qualitative social science such as grounded theory. Each notebook has a default:
the quantitative bar for the distiller and working notes, the qualitative bar for marginalia.
A note may use the other version when its argument is of that kind (an economic-history note
built on a model, say), and the PR says which bar it was held to. The Korean notebook
(korean-notes) has no bar for now.

A note is published only if it passes all five tests of its bar. They are about how much the note
explains, not about correctness or style, which the rest of this file covers. Read them before
planning a note, not after drafting it: a note that fails them can't be fixed by editing, only
by rethinking. The likelihood note (`likelihood-and-fisher-information.md`) passes all five;
the Mendelian randomization note, as of this writing, fails three, and sits in purgatorial
thoughts (below).

1. **It derives or explains its central result.** The main formula or claim is shown to follow,
   in steps a reader can check, or is traced to a mechanism. A formula stated and then filled in
   with numbers doesn't count. The likelihood note proves that the score has mean zero and that
   its variance is minus the expected curvature, and says which regularity condition each step
   uses. The MR note stated the Wald ratio and the IVW formula but never showed why a ratio of
   two associations recovers a causal effect.
2. **Its worked example shows something the formula alone doesn't.** The example exposes a
   behaviour, a limit or a disagreement. In the likelihood note, at n = 20 the Wald and
   likelihood-ratio intervals disagree, and a third interval appears on the log-odds scale. The
   MR note's toy numbers were picked so that all three ratios land near 0.4, so the example
   confirms the arithmetic and teaches nothing beyond it.
3. **It connects ideas inside the note.** At least one link to another idea is explained, not
   just mentioned: why the two are the same thing, or why one causes the other. The likelihood
   note shows that cross-entropy is the negative log-likelihood, and that the Fisher information
   is the metric behind the natural gradient and EWC. A "see also" list or a paragraph of
   applications doesn't count.
4. **It says where the idea breaks, and why.** The assumptions appear where they are used, with
   what goes wrong without them: a uniform on [0, θ] breaks the mean-zero score, and the Wald
   interval drops below 0 for 1 success in 20.
5. **It is more than a survey.** A reader who knows the prerequisites leaves with something they
   wouldn't get from the opening pages of a textbook chapter or an encyclopedia entry. A note
   that is mostly a tour of standards, findings or tools, each with its citation, fails this
   unless an argument runs through it.

Some notes are different in kind: a dated survey of laws, or a note that is partly a reference
table of codes. For those, tests 1 and 2 are met by the reasoning behind the rules or the codes
rather than by a derivation. Sungmin decides when a note gets that exception. A note that fails
a test is held with `draft: true` until it is reworked; it is not published to be improved later.

**The qualitative bar.** A note that argues from sources has no formula to derive, so the five
tests take this form. It is the default for marginalia. The Three Kingdoms note
(`when-the-three-kingdoms-tipped.md`) is the example.

1. **It makes a case from evidence, not a retelling.** The note takes a position on a question
   and shows the evidence that decides it. A narrative of events, however accurate, doesn't
   count. The Three Kingdoms note argues that 263, not 200 or 222, is when the north's victory
   became near certain, and rests that on the census registers and the sources' own plans.
2. **It reads a source closely, to show what a summary misses.** At least one passage is
   quoted in the original and read for what it says, not only for its gist: Pei Songzhi's four
   arguments against Chen Shou's troop numbers at Guandu, or the condition "when the realm
   changes" (天下有變) inside Zhuge Liang's plan. A worked example here is a source, a table of
   numbers from one, or a comparison of two accounts of the same event.
3. **It connects causes or ideas.** At least one link is explained, not just named: land and
   grain to an army's reach, a river's direction to which side can attack, a historian's
   loyalties to the date he chooses.
4. **It says where the sources are thin, biased or disputed, and where historians disagree.**
   Who wrote each source, when and for whom; what the numbers can and can't bear; and each
   historian's view given to that historian, with the opposing one. A social-science note also
   says what evidence would change its conclusion: the case, finding or count that would count
   against it.
5. **It is more than a survey**, as in the main test.

Sources for marginalia and other qualitative notes: primary texts in their original language,
and scholarship written in the language of the history, count as much as English; English
coverage is often the thinnest. Quote the original, then translate it ("translations are our
own" when they are). Cite a primary text by work, author, date and the division its editions
number by, linked to an online text that you opened, and check every quotation against it,
character by character. Every title and unit is translated into English: in the text a work goes
by its English title, with the original in parentheses at first mention; in Sources it gets the
English title, then the romanization and the original. Don't mix a translated title in one place
with a bare romanization or bare original in another. A modern title in another language keeps
its original in Sources, followed by an English translation in square brackets. A name or term
written in a non-Latin script gives, at first mention, the original script plus its reading in
the language the history belongs to. A word quoted from an older source keeps that source's
spelling, and its first mention also says how the word or sound is spelled today, from a
source for the modern spelling: Cushing (1901) writes the Zuni sound now spelled *ł* as *thl*,
and a note quoting him keeps *thl* and says so where the first such word appears. Never silently
modernize a quotation, and never leave a reader to guess that an old spelling is old. **When citing Chinese, Korean or Japanese sources, also
follow [`conventions/east-asian.md`](conventions/east-asian.md).**
A newspaper column or a reprinted essay may be cited for its author's position, if
the position is attributed to that author by name. A scholar's argument known only from someone
else's summary is cited through that summary, and the text says so. No code is needed in these
notes, but every number computed from a source (a share, a ratio, a growth rate) still comes
from a calculation that was run.

**Purgatorial thoughts.** A published note that turns out to fall below the bar goes to the third
notebook, purgatorial thoughts (`/purgatorial-thoughts/`), until it is reworked or retired. To
move it there, replace its tags with `tags: []`: a note without tags belongs to that notebook.
Its old URL keeps working only if a redirect is added to `SITE.redirects` in `site.config.mjs`
in the same change. To bring a reworked note back, restore its tags and turn the redirect
around. Sungmin decides which notes go there; a reviewer only recommends it.

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
- **No affiliation (the distiller).** The notebook is not a profile. Don't write "my lab", "our
  group", "the hospital's data", or name a specific institution as the place the work happens.
  Name an institution only as the author of a cited work.
- **Affiliation, within limits (working notes).** These are notes from study at Seoul National
  University, so the school, a course ("from the GSDS regression course") or a public dataset used
  in one may be named. Never describe unpublished research results, internal or patient-level
  data, a hospital's or lab's systems, or colleagues. A method is fine to write up; what a lab
  found with it before publication is not. `npm run check` applies each notebook's rule
  (`allowAffiliation` in `site.config.mjs`).
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
tags: [ml/llm]                         # one notebook's tags: cheme, ml/llm, qi/qc | stats, genes, data | history, language, geography
summary: One line for the index.       # long notes
distillate: The boiled-down version.   # long notes
rough: true                            # unfinished thinking; leave out otherwise
draft: true                            # unfinished, not published; leave out otherwise
hidden: true                           # finished but withheld from the site; leave out otherwise
model: [Claude Opus 5.5]               # model(s) that wrote or revised it; never shown on the site
reviewed_by: [Claude Opus 5.5]         # optional: model(s) that did a separate review pass
---
```

- **Tags:** only these nine: three each for the distiller, working notes and marginalia. The distiller's read as past, present and
  future: `cheme` (chemical engineering: separations, thermodynamics, fermentation and stills),
  `ml/llm` (machine learning and language models) and `qi/qc` (quantum information and
  computing). Working notes: `stats` (probability and statistics, the machinery underneath the
  other notes), `genes` (genetics and genomics) and `data` (health data and how it is stored,
  coded and shared: EHRs, CDWs, common data models, medical codes). Marginalia: `history`,
  `language` (languages, their history and the words people use) and `geography` (places,
  borders, rivers and maps: how land was divided and why). The
  list lives in
  `site.config.mjs` under each notebook, and the build fails on any other tag. A note may carry more than one tag, all
  from one notebook (`npm run check` rejects a mix): give a second tag when a reader browsing
  that tag would want the note too, as with a note on a word's history (`[language, history]`).
  The first tag is the main one. Don't invent new tags; ask first.
  **Every new note needs a tag:** a note without tags lands in purgatorial thoughts (see the
  bar).
- **Hidden notes:** `hidden: true` keeps a finished note off the site: no page, and not in the
  index, tag pages, RSS or search. `draft: true` builds the same way but means
  unfinished. `ADMIN.md` at the repo root lists every note with its status; it is regenerated by
  `npm run admin` and before every build, and is not deployed (but the repo is public).
  **To unhide a note:** delete its `hidden: true` line, run `npm run build` (which also refreshes
  `ADMIN.md`), check that the note renders, and commit both files.
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
tags: [cheme]
---
An alcoholmeter is calibrated at 20 °C, and a warm sample is less dense, so the meter sinks
deeper and **reads high**. A 40% spirit measured at 30 °C reads several points too strong. Cool
the sample to 20 °C or use the correction table that came with the meter.
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
and not a table of contents. It is **plain text**: no links, no bold, no
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

**Code.** Python, except in `genes` notes. `data` notes use the standard library, such as
`sqlite3` for a query. **Base R for `genes` notes**, since R is the standard in that field: no
packages from CRAN or Bioconductor, only what ships with R (`stats`, `graphics`). It must run as written: include imports, name the shapes in comments
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

**How many figures.** There is no limit. Add a figure wherever a picture shows an idea better
than a table or a sentence: the shape of a curve, a tail, a comparison between two models, a
geometric construction. Don't add one that only repeats a table. Keep each figure compact:
about 640 units wide and at most about 300 tall in its `viewBox`, so that on a phone it takes
up less than a screen. Two related plots can sit side by side as two panels in one SVG, as in
`discrete-and-continuous-distributions.md`. Every figure is computed and render-checked on its
own, by the rules above.

**Links.** No links to other notes, and no "see the X note". A link pulls the reader out of the
note they are reading, and every note should stand on its own. If the note needs an idea that
another note covers, give it here in a sentence or two, enough for this note's argument. A
worked example belongs to its note: don't borrow another note's example by reference; if two
notes share numbers on purpose, each defines them (rule 13 in section 7). Links to a heading in
the same note (`[the q-line](#the-q-line)`) are fine. `npm run check` rejects `note:` targets,
relative paths and links to this site. A note with four or more `##` sections gets a contents
list at the top built from those headings, so keep headings short. External links only to
primary or stable sources (papers, standards, official docs).

**Citations.** Name the authors and year in the text: "Hinton, Vinyals and Dean (2015)", "Kim
and Rush (2016)". Collect every cited work in a `## Sources` list at the end of the note, one
entry per line, in this format (as in `magic-state-distillation.md`):

```md
## Sources

- S. Bravyi, A. Kitaev, "Universal quantum computation with ideal Clifford gates and noisy ancillas", *Phys. Rev. A* 71, 022316 (2005). [arXiv:quant-ph/0403025](https://arxiv.org/abs/quant-ph/0403025)
- B. F. Voight et al., "Plasma HDL cholesterol and risk of myocardial infarction: a mendelian randomisation study", *Lancet* 380, 572–580 (2012). [doi:10.1016/S0140-6736(12)60312-2](https://doi.org/10.1016/S0140-6736(12)60312-2)
```

- **Every entry has a link**: `https://doi.org/…` for a paper with a DOI, `https://arxiv.org/abs/…`
  for a preprint, or the official page for a standard, dataset or piece of software. Link the DOI
  and the arXiv id when both exist.
- **Check every entry before you write it.** Resolve the DOI (`https://api.crossref.org/works/<doi>`
  returns the title, authors, journal, volume and pages) and copy the details from what comes
  back. About ten DOIs, volumes or page ranges written from memory were wrong in the first
  drafts of four genetics notes. If you can't resolve a work, don't cite it; say in the PR that it needs a source.
- **Cite only what the text needs**: a work the note quotes a number, result or method from. Not
  background reading, not a second source for the same point.
- **Describe a cited work only by what it says.** Before writing "Park et al. (2023) converted
  the hospital's records to OMOP", read the abstract and check it says that. A paper's topic is
  not its finding.
- **Cite a novel, play or poem by its own divisions**: chapter, or act and scene, or line, not
  by page, because page numbers change between editions ("*Brave New World*, ch. 12"). A page
  number is fine on top of that, for a scholarly edition named in Sources.
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
   it in the text as unchecked (rule 20).
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
   it, compute it: the fermentation note's gap between the 8.1% ceiling and the 5.3% result was
   first blamed on volume contraction, but the extract left unfermented, worked out in the note,
   accounts for it. Otherwise write what is known ("the two are related", "one proposed reason
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
    work or a source that states it. A speedup reported in one speculative-decoding paper
    belongs to that paper's models and hardware, not to the method in general. Another draft gave
    the equal-variance binormal approximation for AUC as if it were the exact liability-threshold
    result (Wray et al., 2010).
16. **Check what a source argues, not only that it exists.** Read its abstract or the
    publisher's description and make sure it supports the sentence that cites it. A paper whose
    title criticizes a theory is not support for that theory. If you can open neither the work
    nor its abstract, cut the claim instead of keeping it with an "unverified" note. A draft
    cited vapor-pressure data to a textbook appendix that couldn't be checked, and another cited
    a process-mining study on OMOP data as if it documented a hospital's OMOP conversion, which
    its abstract doesn't describe.
17. **Keep look-alike distinctions apart.** When two concepts or notations resemble each other,
    state each from its source and never map one onto the other. A draft defined apparent
    attenuation as the fraction of extract the yeast consumed, which is real attenuation, and
    another carried the alcoholmeter's temperature correction over to the hydrometer, where it
    runs the other way. Another wrote the normal as $N(\mu, \sigma)$ and later as
    $N(np, np(1-p))$, switching the second argument from standard deviation to variance.
18. **A worked example must agree with its own numbers.** Every conclusion drawn from the
    example follows from what it shows, and the example shows what the text says it shows. Don't
    claim the example's result is new or "absent from the literature". A draft said the
    $1/\sqrt{d_k}$ scaling did no visible work at $d_k = 4$, while its own weights changed from
    0.452 to 0.576 without it. Another illustrated "mean and variance don't determine a
    distribution" with Binomial(10, 0.05) and Poisson(0.5), which share only the mean.
19. **Crossref describes the edition the DOI points to.** A reissue's record gives the reissue
    year and sometimes the wrong author or subtitle. Take the original publisher, year and
    authors from the book or a library record, and when the link is a later edition, say so
    ("linked: 3rd ed.").
20. **Mark in the note anything that wasn't checked against a source.** Cutting comes first
    (rules 2 and 16). A detail that stays, such as an author's name, a reading or a date added
    from memory, gets a footnote in the note saying what it rests on and that it wasn't checked
    ("from memory; not found in the sources above"), and it also goes in the PR's **Not
    verified**. Never mention it only in the PR: the reader of the page never sees the PR. Two
    threads added details from memory (an author for a lost Chinese work, Korean readings of
    hanja) and said so only in their reports. If a whole argument is unchecked, use `rough: true`
    instead (section 3).

### Known traps (each one appeared in an earlier draft)

| Topic | Wrong | Right |
| --- | --- | --- |
| ethanol–water azeotrope | "95.6% ABV" | 95.6 wt % ≈ 97% ABV (mole fraction 0.894), boils at 78.2 °C at 1 atm |
| alcoholmeter temperature | warm sample reads low | warm sample is less dense and **reads high**; calibrated at 20 °C |
| hydrometer temperature | warm sample reads high | warm sample is less dense, so it sinks deeper and reads **low**; the correction adds (the alcoholmeter is the opposite: reads high); calibrated at the printed temperature, often 15.6 °C |
| methanol | concentrates in the heads | behaves much like ethanol–water and comes over across the run; keep it low via the fruit and fermentation |
| fusel alcohols | land in tails because they boil high | volatility relative to ethanol in the pot liquid decides it; they are more volatile than ethanol in a watery pot, so they come over late in the run |
| Rayleigh equation for ethanol–water | constant-α closed form | α falls from over 10 to 1 across a run; integrate numerically with VLE data |
| dilution | ignore contraction | ethanol–water shrinks on mixing, so the result is slightly *stronger* than the target |
| q-line slope | partly vaporized feed has positive slope | slope $q/(q-1)$: partly vaporized negative; superheated vapor positive, between 0 and 1; saturated liquid vertical; saturated vapor horizontal |
| softmax temperature | $T \to 0$ gives uniform | $T \to 0$ approaches one-hot argmax; $T \to \infty$ approaches uniform |
| KD types | "distillation" means one thing | token-level KD matches teacher logits at each position (needs logits and a shared tokenizer); sequence-level KD trains on teacher-generated text (works through an API) |
| example distilled models | TinyLlama, MiniCPM as KD examples | use documented cases: DistilBERT, Llama 3.2 1B/3B, Gemma 2 2B/9B, Minitron, DeepSeek-R1-Distill |
| links to other notes | `note:other-note`, `../notes/…`, "see the GWAS note" | no link; give what is needed in a sentence or two |
| figure captions | caption on the line straight after `</svg>` (shows literal `*…*` and raw `$…$`) | a blank line between `</svg>` and the italic caption |
| display math | `$$y = \frac{a}{b}$$` on one line (renders inline and cramped) | `$$` alone on the line above and the line below the formula |
| Raoult's law | "assumes a binary mixture" | holds for any number of components; only the Txy and x–y diagrams are binary |
| data citations | a textbook appendix cited from memory | a source that was actually opened: NIST WebBook, DOI, or edition and table |
| DOIs and page numbers | written from memory (wrong volume, pages, journal or author) | resolved through Crossref and copied from the result |
| distillate | ends with a `[link](…)` | plain text; a citation goes in the body |
| apparent attenuation | "the fraction of extract the yeast consumed" | that is *real* attenuation; apparent attenuation overstates it, because ethanol pulls the final gravity down |
| sugar left vs. ABV ceiling | gap blamed on volume contraction | ABV counts ethanol by mass ÷ 0.789, so contraction doesn't enter; the gap is unfermented extract and the yield below theory |
| attention scaling | $1/\sqrt{d_k}$ "does no visible work" at small $d_k$ | it changes the weights noticeably even at $d_k = 4$; compute both versions before claiming either |
| GWAS sample size | a 2×2 table of allele counts read as people | each person carries two alleles: 800 alleles = 400 people |
| winner's curse in MR | understates the instrument | inflates the discovery effect $\beta_{XG}$, so a two-sample estimate is biased toward the null |
| HDL Mendelian randomization | variant in LPA | LIPG Asn396Ser (Voight et al. 2012); Lp(a) is a separate, causal risk factor |
| PRS clumping | the same as LD pruning | clumping keeps the most significant SNP in each LD block; pruning ignores p-values |
| PRS accuracy | quoting heritability as the score's variance explained | heritability is the ceiling; the score explains less (for height about 40% in European ancestry, less elsewhere) |
| OMOP drug queries | `drug_exposure` filtered on the ingredient concept | real rows are clinical drugs; go through `concept_ancestor` from the ingredient |
| moments don't determine a distribution | comparing two distributions that share only the mean | match both moments, e.g. a normal N(μ, σ²) with the same mean and variance |
| Sources link text | the full URL as the link text | a short label (itl.nist.gov, 1.3.6.6); a long URL can't wrap and scrolls the page sideways on a phone |

## 8. Template for a long note

```md
---
title: <Short noun phrase or question>
summary: <What it covers, in one line> — <part>, <part>, <part>.
date: YYYY-MM-DD
tags: [<cheme|ml/llm|qi/qc> or <stats|genes|data> or <history|language|geography>, from one notebook]
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
tags: [ml/llm]
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
- [ ] The note passes the five tests in [The bar](#the-bar-depth-not-polish); say in the PR how
      it meets tests 1 and 2.
- [ ] No links to other notes and no "see the … note"; the note stands on its own.
- [ ] `npm run similar -- <id>` was run, and the closest notes were checked for overlap
      (section 10, step 3).
- [ ] Display math has `$$` alone on its own line before and after the formula.
- [ ] Code runs as written, and every output block was pasted from a real run (with a seed if
      random). SVG uses CSS variables and computed coordinates.
- [ ] Every figure was rendered and checked: no label crosses a curve, region labels sit in their
      regions, and it reads in dark mode.
- [ ] Every cited work is in `## Sources` with a link, and every DOI was resolved, not recalled.
- [ ] Each source supports the sentence that cites it (its abstract was read), and each view in
      a comparison is given to the author who holds it (section 7, rules 15–17).
- [ ] Each cited work is described by what its abstract says, and each is used in the text.
- [ ] Every "because", "causes" or "the reason" has a source or a calculation behind it, and
      every direction (high/low, up/down, toward/away from the null) was checked.
- [ ] Any number also used in another note matches there (search with `grep`).
- [ ] Distiller: no lab, hospital, university or employer named or implied as the author's.
  Working notes: no unpublished results, internal or patient data, or colleagues; the school and courses only.
- [ ] Rounded values are the same everywhere, and each worked equation checks with them.
- [ ] No H1, no em dashes in body text, no hype, no "in this note we will".
- [ ] No `## Limits` section. Each caveat sits in the section it qualifies and would mislead a
      careful reader if cut.
- [ ] Anything unchecked is cut, or marked in the note itself (rule 20), or the note is `rough: true`.

Paste this list into the PR description with each box ticked or not, and add a section
**Not verified** listing every claim, number or source you couldn't check. An empty list is fine
only if it's true.

## 10. Workflow: draft cheap, review strong

Most notes are drafted by a cheaper model and reviewed by a stronger one. A guide like this
fixes structure and voice well, but a smaller model will still make factual errors, so the
review is where accuracy comes from. The reviewer follows `REVIEWING.md`.

1. **Branch.** `git fetch origin main` and `git switch -c <short-name> origin/main`. A branch cut
   from an old `main` follows an old version of this file; one draft broke its whole page that way.
2. **Draft** with this file, one reference note, and the source material. Don't read the other
   notes on nearby topics first: as the notebooks grow, reading them all costs more time and
   tokens than the overlap it prevents. Plan the note against the five tests in The bar before
   writing. Run the code, run `npm run check` and `npm run build`, and open the page.
3. **Check for overlap after drafting.** Run `npm run similar -- <note-id>`. It ranks the existing
   notes by shared vocabulary and prints their section headings, without reading them in full.
   Open only the ones near the top whose headings look close to the draft's, and look for real
   overlap: a section that repeats another note's explanation, or the same worked example. If
   there is some, cut the draft's version to the sentence or two this note needs, or, when the
   draft does it better, trim the older note in the same PR. Say in the PR which notes you
   checked and what you found, even if it was nothing.
4. **Open a PR**, never a direct push to `main`. The description has the self-check from section
   9, the **Not verified** list, and the commands you ran with their result.
5. **Review** with a stronger model, following `REVIEWING.md`. The review lists errors as *must
   fix* and *should fix*.
6. **Fix** on the same branch. Address every item; in the PR, say for each one what you changed,
   or why you didn't. Don't fix things the review didn't ask for in the same commit.
7. **Merge** only when Sungmin approves. A drafting model never merges its own PR.

When a review finds a new kind of mistake, add it to the known-traps table in section 7, so the
next draft avoids it.

This split is one option, not a requirement. A note can also be written and checked by one
model, or by hand. Whatever the route, the accuracy rules in section 7 still apply, `model`
lists every model that wrote or revised the note, and `reviewed_by` is filled in only when a
separate review pass took place.

## Reference notes

These notes show the target quality. Give a drafting model one of them as a model of style and
depth (the first, unless another is much closer in kind):

- `likelihood-and-fisher-information.md` (`stats`): the bar's example. Derivations a reader can
  check, one worked example that exposes a disagreement (Wald vs. likelihood-ratio intervals),
  and ideas connected inside the note (cross-entropy, natural gradient, EWC).
- `moments-of-a-distribution.md` (`stats`): one running example from definitions to the method
  of moments versus maximum likelihood, with a simulation that shows the difference.

- `what-is-model-distillation.md` (`ml/llm`): soft targets, a six-token worked example with
  gradients, a runnable loss function.
- `reading-a-mccabe-thiele-diagram.md` (`cheme`): one worked column from mass balance to stage
  count, cross-checked by shortcut methods, with a computed SVG figure.
- `how-spirits-distillation-works.md` (`cheme`, hidden from the site): real VLE data,
  numerically integrated runs, and corrections of common myths.
- `raoults-law-and-vle.md` (`cheme`): Antoine constants cited to NIST, a bubble-point solver,
  and a computed Txy figure with a tie line.
- `magic-state-distillation.md` (`qi/qc`): the Sources format, and a dated "Where things stand"
  section.
- `medical-codes.md` (`data`): identifiers checked against their sources, and numbers kept in
  sync with another note.
- `when-the-three-kingdoms-tipped.md` (`history`): the qualitative bar's example. A position
  argued from primary sources quoted in classical Chinese, census registers as the worked
  example, and each historian's view attributed.


When a new note becomes a better example, add it here and add any new trap to section 7.
