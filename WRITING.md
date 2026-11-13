# Writing notes

This is the style and accuracy guide for the notes in `src/content/notes/`, written so that any
model, including a small local one, can follow it. Read all of it before drafting, especially
[The bar](#the-bar-depth-not-polish). If there is room in the context, also read one finished
note as a model (see [Reference notes](#reference-notes)). Don't read the other notes on nearby
topics before drafting: the overlap check comes after the draft (section 10).

The site holds four notebooks (sections), each with its own tags, look and path:

- **notes from the 3-way distiller** (`/3-way-distillation/`, tags `cheme`, `ml/llm`, `qi/qc`): a
  personal notebook. Sungmin writes things down here to understand them properly. The reader is a
  curious, technical person, often Sungmin a year from now.
- **working notes** (`/working-notes/`, tags `stats`, `genes`, `data`): study and research notes
  from graduate school in data science, kept so that methods and results can be looked up later.
  The reader is a technical person who knows some statistics, often Sungmin a year from now.
- **marginalia** (`/marginalia/`, tags `history`, `language`, `geography`): notes on things
  outside mathematics, science and technology, written in English. The reader is curious and
  careful but not a specialist, and may not read the languages its sources are written in.
- **purgatorial thoughts** (`/purgatorial-thoughts/`, no tags): notes that fell below the bar.
  A note without tags lands here, so every new note needs a tag.

Write for that reader. A note's tags decide its notebook, so its tags all come from one of them.
The rules are the same for all notebooks except where a rule names one: the affiliation rule
(section 1), the tags (section 2), the language for code (section 6), the default version of the
bar, and the sources for qualitative notes (The bar). Rules for one family of sources, such as
Chinese, Korean or Japanese, live in `conventions/`. How to move, hide or unhide notes is in
`README.md`, not here.

The Korean notebook (사회학 개론) is a separate repository, `korean-notes`, with its own copy of
this guide. Shared code is kept in step with it (see `SHARED.md`).

## The hard rules

Every one of these was broken in an earlier draft and had to be fixed after review. If you
remember nothing else from this file, follow these. Details are in the sections named.

1. **Work on a branch from the current `main`, and open a pull request.** Never push to `main`,
   and never merge your own PR. Fetch `main` first, so you follow the current version of this
   file (section 10).
2. **Run `npm run check` and `npm run build`; both must pass.** Then **open the page** in a
   browser, at full width and at phone width. If you have no browser, say so in the PR and the
   reviewer renders it. Never write "it renders" unless you looked (sections 6 and 9).
3. **Every computed number comes from a calculation you ran.** Code output in a note is pasted
   from a real run, never typed. If you couldn't run it, say so in the PR and leave the output
   out (sections 6 and 7).
4. **Don't state a cause, a direction or a mechanism you can't support** with a source you
   opened or a calculation in the note (section 7).
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
   detail flagged only in the PR reads as checked to everyone who sees the page. An honest list
   is worth more than a clean-looking draft (sections 7 and 9).
10. **Meet the bar below, and don't link to other notes.** Each note stands on its own: explain
    what it needs in place rather than pointing elsewhere (section 6).

## The bar: depth, not polish

The bar comes in two versions, chosen by the kind of argument a note makes, not by its subject.
The **quantitative bar** is for notes that argue with models, derivations or calculations: the
mathematics, science and technology notes, and most economics. The **qualitative bar** is for
notes that argue from sources and interpretation: history, and qualitative social science such
as grounded theory. The distiller and working notes default to the quantitative bar, marginalia
to the qualitative one. A note may use the other version when its argument is of that kind (an
economic-history note built on a model, say), and the PR says which bar it was held to. The
Korean notebook has no bar for now.

A note is published only if it passes all five tests of its bar. They are about how much the note
explains, not about correctness or style, which the rest of this file covers. Read them before
planning a note: a note that fails them can't be fixed by editing, only by rethinking.

**The quantitative bar.** The likelihood note (`likelihood-and-fisher-information.md`) passes
all five.

1. **It derives or explains its central result.** The main formula or claim is shown to follow,
   in steps a reader can check, or is traced to a mechanism. A formula stated and then filled in
   with numbers doesn't count. The likelihood note proves that the score has mean zero and that
   its variance is minus the expected curvature, and says which regularity condition each step
   uses.
2. **Its worked example shows something the formula alone doesn't**: a behaviour, a limit or a
   disagreement. In the likelihood note, at n = 20 the Wald and likelihood-ratio intervals
   disagree, and a third interval appears on the log-odds scale. Numbers picked so that
   everything comes out as expected confirm the arithmetic and teach nothing beyond it.
3. **It connects ideas inside the note.** At least one link to another idea is explained, not
   just mentioned: why the two are the same thing, or why one causes the other. The likelihood
   note shows that cross-entropy is the negative log-likelihood, and that the Fisher information
   is the metric behind the natural gradient and EWC. A "see also" list or a paragraph of
   applications doesn't count.
4. **It says where the idea breaks, and why.** The assumptions appear where they are used, with
   what goes wrong without them: a uniform on [0, θ] breaks the mean-zero score, and the Wald
   interval drops below 0 for 1 success in 20.
5. **It is more than a survey.** A reader who knows the prerequisites leaves with something they
   wouldn't get from the opening pages of a textbook chapter or an encyclopedia entry. A tour of
   standards, findings or tools, each with its citation, fails unless an argument runs through it.

Some notes are different in kind: a dated survey of laws, or a note that is partly a reference
table of codes. For those, Sungmin may decide that tests 1 and 2 are met by the reasoning behind
the rules or the codes rather than by a derivation. A note that fails a test is held with
`draft: true` until it is reworked; it is not published to be improved later.

**The qualitative bar.** A note that argues from sources has no formula to derive, so the five
tests take this form. The Three Kingdoms note (`when-the-three-kingdoms-tipped.md`) is the
example.

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
   says what evidence would change its conclusion.
5. **It is more than a survey**, as in the quantitative bar.

**Sources for qualitative notes.** Primary texts in their original language, and scholarship
written in the language of the history, count as much as English, whose coverage is often the
thinnest. Quote the original, then translate it ("translations are our own" when they are). Cite
a primary text by work, author, date and the division its editions number by, linked to an
online text you opened, and check every quotation against it, character by character.

- **Titles.** In the text a work goes by its English title, with the original in parentheses at
  first mention; in Sources it gets the English title, then the romanization and the original.
  Don't mix a translated title in one place with a bare romanization or original in another. A
  modern title in another language keeps its original in Sources, followed by an English
  translation in square brackets. Every unit is translated into English too.
- **Names and terms** written in a non-Latin script give, at first mention, the original script
  plus its reading in the language the history belongs to.
- **Old spellings.** A word quoted from an older source keeps that source's spelling, and its
  first mention says how it is spelled today, from a source for the modern spelling: Cushing
  (1901) writes the Zuni sound now spelled *ł* as *thl*, and a note quoting him keeps *thl* and
  says so where the first such word appears. Never silently modernize a quotation.
- **Secondhand positions.** A newspaper column or reprinted essay may be cited for its author's
  position, attributed by name. A scholar's argument known only from someone else's summary is
  cited through that summary, and the text says so.
- **Numbers.** No code is needed, but every number computed from a source (a share, a ratio, a
  growth rate) still comes from a calculation that was run.
- **Chinese, Korean or Japanese sources:** also follow
  [`conventions/east-asian.md`](conventions/east-asian.md).

## 1. Voice

- **Plain, exact, and calm.** Say what is true and how we know. No hype, no "fascinating",
  no "in this note we will explore", no closing pleasantries or calls to action.
- **Explain, then show.** State the idea in a sentence, then make it concrete with a number,
  an equation, or a worked example.
- **Full sentences and short paragraphs** of two to five sentences. Lead each section with its
  point. Lists are for parallel items (sources, cases, options), not for a chain of reasoning.
- **No first-person singular.** Never "I", "me", "my" or "I'll". Write around it: "Throughout,
  the note uses one worked example", "isn't checked here". When a first person truly can't be
  avoided, use "we" ("Translations are our own"), sparingly. Contractions are fine.
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
  No em dashes (—) in body text; use a comma, a colon, or a new sentence. One em dash in the
  `summary` line is fine. No arrow chains (A → B → C) in prose.
- **Emphasis:** **bold** a key term where it is defined, or the one fact a reader must not miss.
  *Italics* for a term being introduced (*congeners*) and for quoted prompts or examples. Don't
  bold whole sentences.
- **Correct the common story when it's wrong**, briefly and without drama: "so it doesn't
  concentrate cleanly in the heads, contrary to the common story."
- **Hedge only where there is real uncertainty**, and say what it is. "A real pot still gives
  slightly stronger distillate than this one-stage model" is a good hedge. "It is generally
  thought that" is not.

## 2. Files and frontmatter

One Markdown file per note in `src/content/notes/`. The file name, in kebab-case, is the
note's id and URL: `soft-targets.md` → `/notes/soft-targets/`. Don't rename a published note;
it breaks links.

```md
---
title: Forward vs. reverse KL          # omit for a short note
date: 2026-11-12                       # required, YYYY-MM-DD
updated: 2026-11-20                    # only when a published note changes materially
tags: [ml/llm]                         # one notebook's tags (below)
summary: One line for the index.       # long notes
distillate: The boiled-down version.   # long notes
rough: true                            # unfinished thinking; leave out otherwise
draft: true                            # unfinished, not published; leave out otherwise
hidden: true                           # finished but withheld from the site; leave out otherwise
model: [Claude Opus 5.5]               # model(s) that wrote or revised it; never shown on the site
reviewed_by: [Claude Opus 5.5]         # optional: model(s) that did a separate review pass
---
```

- **Tags:** only these nine, three per notebook. The distiller's read as past, present and
  future: `cheme` (chemical engineering: separations, thermodynamics, fermentation and stills),
  `ml/llm` (machine learning and language models) and `qi/qc` (quantum information and
  computing). Working notes: `stats` (probability and statistics, the machinery underneath the
  other notes), `genes` (genetics and genomics) and `data` (health data and how it is stored,
  coded and shared: EHRs, CDWs, common data models, medical codes). Marginalia: `history`,
  `language` (languages, their history and the words people use) and `geography` (places,
  borders, rivers and maps: how land was divided and why). The list lives in `site.config.mjs`,
  and the build fails on any other tag. A note may carry more than one tag, all from one
  notebook: give a second tag when a reader browsing that tag would want the note too, as with a
  note on a word's history (`[language, history]`). The first tag is the main one. Don't invent
  new tags; ask first.
- **`hidden` and `draft`** both keep a note off the site (no page, index entry, tag page, RSS or
  search); `draft` means unfinished. `ADMIN.md`, regenerated by every build, lists every note
  with its status. The repo is public, so hidden notes are still readable there.
- **Model:** list every model that drafted or substantially revised the note, earliest first,
  as it calls itself (`[Mistral Large 4, Claude Opus 5.5]`). Add a name when a model revises the
  note; never remove one. Leave it out for a note written by hand.
- **Reviewed by (optional):** the model(s) that did a separate review pass (section 10). A
  reviewer that also edits the text goes in `model` too, so `model` is always the full list.
  Leave it out when no separate review happened.
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

**`rough: true`** is for a note whose argument is still uncertain or contested, and the text says
what is unchecked. Not being able to read a book page by page is not, by itself, a reason for it:
a claim about a book is checked when it rests on the book's contents page or publisher
description, on a peer-reviewed source whose abstract states it, or on a quoted passage. List
what rests on secondary sources in the PR's **Not verified** instead.

## 4. The summary and the distillate

**`summary`** is one line on the index under the title. It says what the note covers, and a
long one may list its parts after an em dash: "Knowledge distillation for language models,
worked through on one next-token example — soft targets and temperature, the T² factor, …".

**`distillate`** is shown at the top of the note. It is the note boiled down to two to four
sentences that make sense alone: the conclusion, the key numbers, and the main limit. A reader
who stops after the distillate should still come away knowing the answer. It is not a teaser
and not a table of contents. It is **plain text**: no links, bold or code, which would show up
as literal brackets and asterisks.

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
   "The q-line", "Why match a distribution and not just the answer".
5. **Caveats where they bite, not in a closing section.** There is no `## Limits` section. When an
   assumption changes a result, say so in the section that uses it ("this holds only for constant
   molar overflow"). Keep a caveat only if a careful reader would be misled without it; cut generic
   lines such as "real data is messier".
6. **Optional ending:** a `## Summary` paragraph, or `## Open questions` as a short list, not both.
7. **`## Sources` last**, listing every cited work with its link (section 6).


## 6. Conventions

**Math (KaTeX).** Inline `$x_D$`. For display math, the opening `$$` and the closing `$$` each
go on **a line by themselves**, with the formula between; on one line it renders as cramped
inline math (`npm run check` catches it):

```md
$$
D = F\,\frac{x_F - x_B}{x_D - x_B} = 100 \cdot \frac{0.45}{0.90} = 50 \text{ kmol/h}
$$
```

Define every symbol in words the first time it appears ("where $W$ is the moles of liquid in
the pot"). Show the general formula, then substitute the example's numbers. Use `\text{}` for
units and words inside math, and `\mathrm{KL}`, `\mathrm{ABV}` for named operators. Matrix rows
end with `\\`, never a single `\`.

**Keep display equations narrow.** A long equation is clipped at the column edge, worst on a
phone. If a formula, its substituted numbers and its result don't fit in about 60 characters of
rendered width, split it into two display blocks (the general form, then the numbers), or move
the unit into the sentence. Check every equation at phone width (about 400 px).

**Numbers and units.** Always give units and the basis: mole fraction, wt %, or ABV (% by
volume at 20 °C); kmol/h; nats. State the temperature and pressure that data holds at. Use a
space between number and unit (78.4 °C, 2.4 L), and × for multiplication in prose. Keep only as
many digits as the source supports, usually two or three significant figures.

**Tables.** For data, comparisons, and the steps of a worked example. Units go in the header or
the first column. Cite the source of any data table in the sentence above it.

**Code.** Python, except in `genes` notes. `data` notes use the standard library, such as
`sqlite3` for a query. **Base R for `genes` notes**, since R is the standard in that field: only
what ships with R (`stats`, `graphics`), no CRAN or Bioconductor packages. Code must run as
written: include imports, name the shapes in comments (`# [batch, seq, vocab]`), keep lines to 70
characters and the block under about 30 lines (a simulation that feeds a figure may run longer).
Code illustrates the idea; it isn't a library.

**Code output is pasted, never written.** Run the code exactly as it appears in the note, and copy
what it printed into the output block below it. Every number the prose takes from the code must
appear in that output. Set a seed for random numbers (`set.seed(1)`, `np.random.default_rng(1)`).
If you can't run the code, include no output block, and say in the PR that the code is unrun.

**Figures.** Add one wherever a picture shows an idea better than a table or a sentence: the
shape of a curve, a tail, a comparison, a geometric construction; never one that only repeats a
table. There is no limit on how many. Each is compact: about 640 units wide and at most about
300 tall in its `viewBox`. Two related plots can be two panels in one SVG.

- Inline `<svg>` only, with `role="img"`, a descriptive `aria-label`, and a `<title>`. Colors
  come from CSS variables so dark mode works: `style="stroke: var(--ink)"`, `var(--muted)`,
  `var(--accent)`, `var(--rule)`, and `fill="currentColor"` for text.
- An italic caption follows, with **a blank line** between `</svg>` and the caption.
- **Plot data from coordinates computed by a script, never by hand.** If you can't compute them,
  leave the figure out and write `<!-- TODO figure: … -->`.
- **Render the figure** and check that no label or number crosses a curve or line, that each
  region label sits in its region, that axis labels line up with their values, and that it reads
  in dark mode.

**Links.** No links to other notes, and no "see the X note": every note stands on its own. If
the note needs an idea that another note covers, give it here in a sentence or two. Don't borrow
another note's worked example by reference; if two notes share numbers on purpose, each defines
them. Links to a heading in the same note (`[the q-line](#the-q-line)`) are fine. A note with
four or more `##` sections gets a contents list built from its headings, so keep headings short.
External links go only to primary or stable sources (papers, standards, official docs).

**Citations.** Name the authors and year in the text: "Hinton, Vinyals and Dean (2015)", "Kim
and Rush (2016)". Collect every cited work in a `## Sources` list at the end of the note, one
entry per line, in this format:

```md
## Sources

- S. Bravyi, A. Kitaev, "Universal quantum computation with ideal Clifford gates and noisy ancillas", *Phys. Rev. A* 71, 022316 (2005). [arXiv:quant-ph/0403025](https://arxiv.org/abs/quant-ph/0403025)
- B. F. Voight et al., "Plasma HDL cholesterol and risk of myocardial infarction: a mendelian randomisation study", *Lancet* 380, 572–580 (2012). [doi:10.1016/S0140-6736(12)60312-2](https://doi.org/10.1016/S0140-6736(12)60312-2)
```

- **Every entry has a link**: `https://doi.org/…` for a paper with a DOI, `https://arxiv.org/abs/…`
  for a preprint (both when both exist), or the official page for a standard, dataset or piece of
  software. The link text is a short label (doi:…, itl.nist.gov), never a long URL, which can't
  wrap on a phone.
- **Check every entry before you write it.** Resolve the DOI (`https://api.crossref.org/works/<doi>`
  returns the title, authors, journal, volume and pages) and copy the details from what comes
  back; details written from memory were wrong about ten times in four early notes. If you can't
  resolve a work, don't cite it; say in the PR that the claim needs a source.
- **Crossref describes the edition the DOI points to.** A reissue's record gives the reissue year
  and sometimes the wrong author or subtitle. Take the original publisher, year and authors from
  the book or a library record, and when the link is a later edition, say so ("linked: 3rd ed.").
- **Cite only what the text needs**: a work the note quotes a number, result or method from. Not
  background reading, not a second source for the same point.
- **Describe a cited work only by what it says.** Read its abstract or the publisher's
  description and check that it supports the sentence that cites it. A paper's topic is not its
  finding, and a paper whose title criticizes a theory is not support for it.
- **Cite a novel, play or poem by its own divisions** (chapter, act and scene, line), not by
  page, since pages change between editions ("*Brave New World*, ch. 12"). A page number may be
  added for a scholarly edition named in Sources.
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

The style is easy to copy; the accuracy is not. Earlier drafts of most notes had real errors.
These rules matter more than anything above.

1. **Recompute every number** in a worked example, preferably with code, and check that tables,
   prose, distillate and figure agree. Every conclusion drawn from the example must follow from
   what it shows (the attention-scaling trap in the table below). Don't claim the example's
   result is new or "absent from the literature".
2. **Round once, then use the rounded numbers everywhere.** The distillate, tables, prose and
   each substituted equation use the rounded value the body quotes, and an equation written with
   rounded inputs must give its stated result with those inputs: if the text says "at 95.1 °C",
   the vapor pressures shown are the ones at 95.1 °C. When rounding makes a check miss (759
   instead of 760 mmHg), quote one more digit or say "about".
3. **Don't invent precision.** "About 97% ABV" beats a fake "96.85%".
4. **Stay inside a fit's range.** Empirical fits (Antoine constants, correlations) come with a
   stated range; say so when a calculation or figure goes beyond it.
5. **Check every claim against a source you opened that supports it.** If you can't, cut the
   claim. A detail that stays anyway, such as a name, a reading or a date added from memory, gets
   a footnote in the note saying what it rests on ("from memory; not found in the sources
   above"), and goes in the PR's **Not verified**. Never mention it only in the PR: the reader of
   the page never sees the PR. If a whole argument is unchecked, use `rough: true` (section 3).
6. **Name a real example only if it is documented** to be what you say. A model trained from
   scratch is not a distilled model because it is small.
7. **Check the basis and the direction twice.** Watch the basis of every percentage (mole, mass,
   volume). For every effect, bias, correction or sign, ask which way it goes and why (reads high
   or low, rises or falls, toward or away from the null), then check it against a source or a
   small calculation. Reversed directions have been caught in several drafts.
8. **Prefer mechanism over folklore, and give a cause only with evidence.** Explain why something
   happens; if the usual explanation is wrong, say so and give the right one. Write "X causes Y"
   or "Y happens because X" only when a source you opened says so or the note's own numbers show
   it, and compute it when the note can. Otherwise write what is known ("one proposed reason is",
   with a source) or leave it out.
9. **Count the right thing.** Say what each number counts and keep it the same through the
   calculation: alleles or people, moles or kilograms, tokens or words, per head or per layer.
10. **Check every identifier against its source**: gene names, concept ids, model names, version
    numbers, dates. One letter can reverse a well-known result.
11. **Keep shared numbers in sync.** Before changing a number, search the other notes for it
    (`grep -rn "1.49" src/content/notes/`) and update every note that quotes it in the same PR.
    The medical-codes note reuses the GWAS note's toy numbers, for example.
12. **Date anything that will go stale**: records, the state of a field, a pending court case,
    "the largest so far". Put it in a section that says "as of" a month and year. A dated section
    is a snapshot: refresh it only when the note is edited for another reason.
13. **Attribute each position to the person who holds it.** When a note contrasts schools or
    authors, or quotes a result, every claim says whose it is and rests on that author's own
    work or a source that states it. A speedup reported in one paper belongs to that paper's
    models and hardware, not to the method in general; an approximation is not the exact result
    it approximates (the equal-variance binormal AUC is not the liability-threshold result of
    Wray et al., 2010).
14. **Keep look-alike distinctions apart.** When two concepts or notations resemble each other,
    state each from its source and never map one onto the other. A draft wrote the normal as
    $N(\mu, \sigma)$ and later as $N(np, np(1-p))$, switching the second argument from standard
    deviation to variance.

### Known traps (each one appeared in an earlier draft)

| Topic | Wrong | Right |
| --- | --- | --- |
| ethanol–water azeotrope | "95.6% ABV" | 95.6 wt % ≈ 97% ABV (mole fraction 0.894), boils at 78.2 °C at 1 atm |
| alcoholmeter temperature | warm sample reads low | warm sample is less dense and **reads high**; calibrated at 20 °C |
| hydrometer temperature | warm sample reads high | warm sample is less dense, so it sinks deeper and reads **low**; the correction adds (the alcoholmeter is the opposite); calibrated at the printed temperature, often 15.6 °C |
| methanol | concentrates in the heads | behaves much like ethanol–water and comes over across the run; keep it low via the fruit and fermentation |
| fusel alcohols | land in tails because they boil high | volatility relative to ethanol in the pot liquid decides it; they are more volatile than ethanol in a watery pot, so they come over late in the run |
| Rayleigh equation for ethanol–water | constant-α closed form | α falls from over 10 to 1 across a run; integrate numerically with VLE data |
| dilution | ignore contraction | ethanol–water shrinks on mixing, so the result is slightly *stronger* than the target |
| q-line slope | partly vaporized feed has positive slope | slope $q/(q-1)$: partly vaporized negative; superheated vapor positive, between 0 and 1; saturated liquid vertical; saturated vapor horizontal |
| Raoult's law | "assumes a binary mixture" | holds for any number of components; only the Txy and x–y diagrams are binary |
| apparent attenuation | "the fraction of extract the yeast consumed" | that is *real* attenuation; apparent attenuation overstates it, because ethanol pulls the final gravity down |
| sugar left vs. ABV ceiling | gap blamed on volume contraction | ABV counts ethanol by mass ÷ 0.789, so contraction doesn't enter; the gap is unfermented extract and the yield below theory |
| softmax temperature | $T \to 0$ gives uniform | $T \to 0$ approaches one-hot argmax; $T \to \infty$ approaches uniform |
| KD types | "distillation" means one thing | token-level KD matches teacher logits at each position (needs logits and a shared tokenizer); sequence-level KD trains on teacher-generated text (works through an API) |
| example distilled models | TinyLlama, MiniCPM as KD examples | use documented cases: DistilBERT, Llama 3.2 1B/3B, Gemma 2 2B/9B, Minitron, DeepSeek-R1-Distill |
| attention scaling | $1/\sqrt{d_k}$ "does no visible work" at small $d_k$ | it changes the weights noticeably even at $d_k = 4$; compute both versions before claiming either |
| GWAS sample size | a 2×2 table of allele counts read as people | each person carries two alleles: 800 alleles = 400 people |
| winner's curse in MR | understates the instrument | inflates the discovery effect $\beta_{XG}$, so a two-sample estimate is biased toward the null |
| HDL Mendelian randomization | variant in LPA | LIPG Asn396Ser (Voight et al. 2012); Lp(a) is a separate, causal risk factor |
| PRS clumping | the same as LD pruning | clumping keeps the most significant SNP in each LD block; pruning ignores p-values |
| PRS accuracy | quoting heritability as the score's variance explained | heritability is the ceiling; the score explains less (for height about 40% in European ancestry, less elsewhere) |
| OMOP drug queries | `drug_exposure` filtered on the ingredient concept | real rows are clinical drugs; go through `concept_ancestor` from the ingredient |
| OMOP citations | a process-mining study on OMOP data cited as documenting a hospital's OMOP conversion | cite a source whose abstract describes the conversion |
| moments don't determine a distribution | comparing two distributions that share only the mean | match both moments, e.g. a normal N(μ, σ²) with the same mean and variance |

## 8. Template for a long note

```md
---
title: <Short noun phrase or question>
summary: <What it covers, in one line> — <part>, <part>, <part>.
date: YYYY-MM-DD
tags: [<tags from one notebook>]
distillate: <The answer in one sentence.> <The key number from the worked example.> <The main limit or caveat.>
model: [<the model writing this>]
---

<What it is and why it matters, two to four sentences. Who named it and when.>

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| <parameter> | <value with units> |

## <First idea>

<State it. Define symbols. General formula, then the example's numbers.>

## Sources

- <Authors>, "<Title>", *<Journal>* <vol>, <pages> (<year>). [doi:<doi>](https://doi.org/<doi>)
```

## 9. Self-check before handing over a draft

`npm run check` already catches the mechanical rules (`date`, `model`, tags, a plain distillate,
`$$`, captions, links to notes, H1, `## Limits`, "I", em dashes, "my lab"-style phrases, Sources
without links). This list is for what it can't see. Fix anything that fails, then report what you could not verify.

- [ ] `npm run check` and `npm run build` pass, and the page was opened at full width and phone
      width (or the PR says no browser was available): no red KaTeX errors, no clipped
      equations, no literal `$`, `*` or `[`.
- [ ] The note passes the five tests of its bar; the PR says which bar and how it meets tests 1
      and 2.
- [ ] A long note has a `title`, `summary` and `distillate`; the distillate stands alone, gives
      the answer and a key number, and matches the body.
- [ ] One worked example runs through the note, with its parameters in a table.
- [ ] Every number was recomputed, has units and a basis, and is rounded the same everywhere.
- [ ] Every symbol is defined in words on first use.
- [ ] Code runs as written, and every output block was pasted from a real run (seeded if random).
- [ ] Every figure uses computed coordinates and was rendered and checked, in dark mode too.
- [ ] Every named paper, model and dataset is real; every DOI was resolved, not recalled; each
      source is used and supports the sentence that cites it; each view is given to the author
      who holds it.
- [ ] Every "because", "causes" or "the reason", and every direction, has a source or a
      calculation behind it.
- [ ] None of the known traps in section 7 appears.
- [ ] Any number also used in another note matches there (search with `grep`).
- [ ] No affiliation or private detail (section 1).
- [ ] Each caveat sits in the section it qualifies and would mislead a careful reader if cut.
- [ ] `npm run similar -- <id>` was run after drafting and the closest notes checked (section 10).
- [ ] Anything unchecked is cut, or marked in the note itself (section 7, rule 5), or the note is
      `rough: true`.

Paste this list into the PR description with each box ticked or not, and add a section
**Not verified** listing every claim, number or source you couldn't check. An empty list is fine
only if it's true.

## 10. Workflow: draft cheap, review strong

Most notes are drafted by a cheaper model and reviewed by a stronger one, following
`REVIEWING.md`. A guide fixes structure and voice well, but a smaller model still makes factual
errors, so the review is where accuracy comes from. The split is one option: a note can also be
written and checked by one model, or by hand, and the rules above apply either way.

1. **Branch.** `git fetch origin main` and `git switch -c <short-name> origin/main`. A branch cut
   from an old `main` follows an old version of this file.
2. **Draft** with this file, one reference note, and the source material. Plan the note against
   the five tests of its bar before writing. Don't read the other notes on nearby topics first:
   reading them costs more than the overlap it prevents. Run the code, run `npm run check` and
   `npm run build`, and open the page.
3. **Check for overlap after drafting.** Run `npm run similar -- <note-id>`. It ranks the existing
   notes by shared vocabulary and prints their section headings. Open only the ones near the top
   whose headings look close, and look for real overlap: a section that repeats another note's
   explanation, or the same worked example. Cut the draft's version to the sentence or two this
   note needs, or, when the draft does it better, trim the older note in the same PR. Say in the
   PR which notes you checked and what you found, even if nothing.
4. **Open a PR**, never a direct push to `main`. The description has the self-check from section
   9, the **Not verified** list, and the commands you ran with their result.
5. **Review and fix** on the same branch or a branch into it. Each review item gets a change or a
   reason for not making one; nothing the review didn't ask for goes in the same commit.
6. **Merge** only when Sungmin approves. A drafting model never merges its own PR.

## Reference notes

Give a drafting model one of these as a model of style and depth: the one for its kind of note,
or the first.

- `likelihood-and-fisher-information.md` (`stats`): the quantitative bar's example; checkable
  derivations, an example that exposes a disagreement, ideas connected inside the note.
- `when-the-three-kingdoms-tipped.md` (`history`): the qualitative bar's example; a position
  argued from primary sources quoted in classical Chinese, each historian's view attributed.
- `what-is-model-distillation.md` (`ml/llm`): a six-token worked example with gradients and a
  runnable loss function.
- `moments-of-a-distribution.md` (`stats`): one running example, with a simulation that shows
  the difference between two methods.
- `reading-a-mccabe-thiele-diagram.md` (`cheme`) and `raoults-law-and-vle.md` (`cheme`): data
  cited to NIST, cross-checked calculations, computed SVG figures.
- `magic-state-distillation.md` (`qi/qc`): the Sources format, and a dated "Where things stand"
  section.
- `medical-codes.md` (`data`): identifiers checked against their sources, and numbers kept in
  sync with another note.
