# Writing notes for the 3-way distiller

This is the style and accuracy guide for the notes in `src/content/notes/`. It is written so that
any model, including a small local one, can read it and draft a note that matches the existing
ones. Read all of it before drafting. If there is room in the context, also read one finished
note as a model to imitate (see [Reference notes](#reference-notes)).

The notebook is personal: Sungmin writes things down here to understand them properly. The
reader is a curious, technical person, often Sungmin a year from now. Write for that reader.

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
tags: [ml/llm]                         # ml/llm, cheme, spirits; zero or more
summary: One line for the index.       # long notes
distillate: The boiled-down version.   # long notes
rough: true                            # unfinished thinking; leave out otherwise
draft: true                            # not published; leave out otherwise
model: [Claude Opus 5.5]               # model(s) that wrote or revised it; never shown on the site
reviewed_by: [Claude Opus 5.5]         # optional: model(s) that did a separate review pass
---
```

- **Tags:** only `ml/llm` (machine learning and language models), `cheme` (chemical engineering, separations),
  and `spirits` (fermentation, distilling, drinks). Don't invent new tags; ask first.
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
tags: [spirits]
---
An alcoholmeter is calibrated at 20 °C, and a warm sample is less dense, so the meter sinks
deeper and **reads high**. A 40% spirit measured at 30 °C reads several points too strong. Cool
the sample to 20 °C or use the correction table that came with the meter.
```

**A long note** has a title, `summary`, `distillate`, and sections. The existing long notes run
1,500–3,000 words. Length should come from worked detail, not from repetition.

Use `rough: true` for a note that is honest thinking-in-progress: unchecked numbers, open
questions, an argument you're not sure of. Say in the text what is unchecked.

## 4. The summary and the distillate

**`summary`** is one line on the index under the title. It says what the note covers, and a
long one may list its parts after an em dash: "Knowledge distillation for language models,
worked through on one next-token example — soft targets and temperature, the T² factor, …".

**`distillate`** is shown at the top of the note. It is the note boiled down to two to four
sentences that make sense alone: the conclusion, the key numbers, and the main limit. A reader
who stops after the distillate should still come away knowing the answer. It is not a teaser
and not a table of contents.

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
5. **Limits** of the method or model, stated plainly.
6. **Optional ending:** a `## Summary` paragraph, or `## Open questions`
   as a short list. Don't do both.

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
build doesn't warn about it, so check the rendered page.

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

**Code.** Python unless there is a reason otherwise. It must run as written: include imports,
name the shapes in comments (`# [batch, seq, vocab]`), and keep it under about 30 lines. Code
illustrates the idea; it isn't a library.

**Figures.** Inline `<svg>` only, with `role="img"`, a descriptive `aria-label`, and a
`<title>`. Colors come from CSS variables so dark mode works: `style="stroke: var(--ink)"`,
`var(--muted)`, `var(--accent)`, `var(--rule)`, and `fill="currentColor"` for text. Put an
italic caption on the line right after the SVG. **Plot data from coordinates computed by a
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
and Rush (2016)". Footnotes (`[^1]`) for asides and for sources you want to keep out of the
sentence. Never cite a paper, model, or number you aren't sure exists.

**Cite only what a reader can check.** A source must be specific enough to look up: a DOI or
arXiv id, a standard's number, a stable database page (for physical data, the
[NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/)), or a book with its edition and
the table or page. Never cite from memory: a textbook appendix named from memory, for constants
that turn out not to be in it, is worse than no citation. If you can't open the source, say
where the number came from ("standard Antoine constants, not checked against a primary source
here") or mark the note `rough: true`.

## 7. Accuracy rules

The style is easy to copy; the accuracy is not. Earlier drafts of all three notes had real
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
| links | `../posts/other-note/` | `note:other-note` |
| display math | `$$y = \frac{a}{b}$$` on one line (renders inline and cramped) | `$$` alone on the line above and the line below the formula |
| Raoult's law | "assumes a binary mixture" | holds for any number of components; only the Txy and x–y diagrams are binary |
| data citations | a textbook appendix cited from memory | a source that was actually opened: NIST WebBook, DOI, or edition and table |

## 8. Template for a long note

```md
---
title: <Short noun phrase or question>
summary: <What it covers, in one line> — <part>, <part>, <part>.
date: YYYY-MM-DD
tags: [<ml/llm|cheme|spirits>]
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

## Limits

<What this method or model assumes, and where it breaks.>
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

- [ ] Frontmatter has `date` and `model` (plus `reviewed_by` if a separate review happened); a long note also has `title`, `summary`,
      `distillate`, and tags from the allowed three.
- [ ] No "I", "me" or "my" anywhere; "we" only where unavoidable.
- [ ] The distillate stands alone, gives the answer and a key number, and matches the body.
- [ ] One worked example runs through the note, with its parameters in a table.
- [ ] Every number has units and a basis, and every number in the example was recomputed.
- [ ] Every symbol is defined in words on first use.
- [ ] Every named paper, model, and dataset is real and described correctly.
- [ ] None of the known traps in section 7 appears.
- [ ] Internal links use `note:` and point to notes that exist.
- [ ] Display math has `$$` alone on its own line before and after the formula.
- [ ] Code runs as written. SVG uses CSS variables and computed coordinates.
- [ ] The figure was rendered and checked: no label crosses a curve, region labels sit in their
      regions, and it reads in dark mode.
- [ ] Every citation points to something that can be looked up (DOI, NIST, edition and table).
- [ ] Rounded values are the same everywhere, and each worked equation checks with them.
- [ ] No H1, no em dashes in body text, no hype, no "in this note we will".
- [ ] Anything unchecked is either cut or flagged, with `rough: true`.

## 10. Workflow: draft cheap, review strong

A guide like this fixes structure and voice well, but a smaller model will still make factual
errors. The cheapest way to keep quality is to split the work:

1. **Draft** with the cheaper or local model. Give it this file, one reference note on the same
   topic, and the source material (papers, data, your own notes). Ask it to finish with the
   self-check in section 9 and to list what it couldn't verify.
2. **Recompute** the worked example by running the numbers, ideally with a short script.
3. **Review** with a stronger model in one pass. Prompt it with this file and the draft:
   *"Review this note against WRITING.md. Check every factual claim, number, unit and citation;
   recompute the worked example; list each error with the fix; then return the corrected note.
   Don't rewrite sentences that are already correct."*
4. **Read it yourself** before merging. You are the last check.

This split is one option, not a requirement. A note can also be written and checked by one
model, or by hand. Whatever the route, the accuracy rules in section 7 still apply, `model`
lists every model that wrote or revised the note, and `reviewed_by` is filled in only when a
separate review pass took place.

A review pass reads and corrects one note, so it costs a small fraction of having the strong
model write it.

## Reference notes

These notes show the target quality. Give a drafting model the one closest to the
new note's topic:

- `what-is-model-distillation.md` (`ml/llm`): soft targets, a six-token worked example with
  gradients, a runnable loss function.
- `reading-a-mccabe-thiele-diagram.md` (`cheme`): one worked column from mass balance to stage
  count, cross-checked by shortcut methods, with a computed SVG figure.
- `how-spirits-distillation-works.md` (`spirits`): real VLE data, numerically integrated runs,
  and corrections of common myths.
- `raoults-law-and-vle.md` (`cheme`): Antoine constants cited to NIST, a bubble-point solver,
  and a computed Txy figure with a tie line.

When a new note becomes a better example, add it here and add any new trap to section 7.
