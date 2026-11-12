---
title: What did Champollion have that Young lacked?
summary: 'The decipherment of Egyptian hieroglyphs read through four royal names — what came before the Rosetta Stone, what Thomas Young found and what he missed, how Coptic let Champollion check a reading, the stages of Egyptian from the pyramids to Coptic, and what computers add now that the script can be read.'
date: 2026-11-12
tags: [language, history]
distillate: 'Thomas Young had sound values for some signs by 1819, but he held that sounds were spelled out only for foreign names, so his values could spell Ptolemy but had nothing to be checked against. Champollion''s advantage was a language: reading the name Ramesses as Ra plus the Coptic verb mise, to give birth, turned a guess at a sign into a word that meant something, and showed that Egyptians wrote their own names with sound signs. Coptic, the last stage of Egyptian, written in Greek letters with vowels, is why that check was possible, though it also misled him where the older language had changed. Computers do not decipher anything here: they encode the signs (1,071 in Unicode in 2009, 3,995 more in 2024), build dictionaries and corpora, and translate hieroglyphs into German at 20 to 23 BLEU in the one study that reports scores, all on top of the reading the 1820s established.'
model: [Claude Opus 5.5]
---

Egyptian hieroglyphs were last carved in 394 CE, at the temple of Isis at Philae, and for the
next fourteen centuries nobody could read them. The usual story gives the decipherment to one
man, Jean-François Champollion, and one stone, the Rosetta Stone, and adds a quarrel: the
English physicist Thomas Young said he had got there first. This note asks what, precisely,
Champollion had that Young did not. The answer argued here is not a better eye for signs, where
Young was often as good, but a language to read them in. Champollion knew Coptic, the last
stage of Egyptian, and used it to test a reading by whether it made a word. That test is also
the line between what computers do for Egyptian now and what the headlines say they do.

Egyptian terms are given in the transliteration of the Thesaurus Linguae Aegyptiae (TLA), the
Berlin academy's dictionary and corpus, with its English gloss. Coptic words are given in Coptic
letters with the meanings in W. E. Crum's *A Coptic Dictionary* (1939). French quotations are
translated here; the translations are our own.

## Four names

The decipherment was worked out on royal names, because names sit inside an oval ring, the
cartouche (Egyptian *šn*, "shen-ring"), and so can be found in a text nobody can read. Four of
them carry the argument, and the later sections return to each row.

| Name | Egyptian (TLA) | Read by | When | Checked by |
| --- | --- | --- | --- | --- |
| Ptolemy | *Ptwlmys* | Young | by 1819 | the Greek text |
| Cleopatra | *Qlwptr.t* | Champollion | 1822 | signs shared with Ptolemy |
| Ramesses | *Rꜥw-ms-sw* | Champollion | 1822–23 | Coptic ⲣⲏ "sun", ⲙⲓⲥⲉ "bear" |
| Thutmose | *Ḏḥw.tj-ms.w* | Champollion | 1822–23 | Thoth's ibis, ⲙⲓⲥⲉ |

The first two are Greek names spelled in Egyptian signs, and a Greek text gave the answer in
advance. The last two are Egyptian names, and nothing gave the answer in advance. The whole
dispute over credit turns on the step from the second row to the third.

## Pictures of ideas

Before the nineteenth century the obstacle was a theory, not a lack of material. Renaissance
readers took their lead from the *Hieroglyphica* attributed to Horapollo, probably written in
the fourth century CE, found in Greece around 1422, and read hieroglyphs as a universal language
of images rather than a way of writing down speech. The Jesuit Athanasius Kircher, in *Oedipus
Aegyptiacus* (1652–55), produced long symbolic "translations", most of them wrong.

Kircher also had the one idea the decipherment would need. He learned Coptic in 1633, published
its first grammar, the *Prodromus Coptus*, in 1636, and argued that Coptic preserved the last
stage of ancient Egyptian. That view was widely accepted. He even gave one sign a correct sound
value, the water sign for *mu*. But he never put the two together: if hieroglyphs were pictures
of ideas, there was no reason to read them through any language.

Two eighteenth-century scholars moved closer. Jean-Jacques Barthélemy suggested in 1762 that
the cartouches held the names of kings or gods, and Georg Zoëga, in a book on obelisks (1797),
showed that the direction the signs face gives the direction of reading and suggested that some
signs stood for sounds. Neither tried to decipher the script.

## The stone and its three scripts

French soldiers found the Rosetta Stone in July 1799 while rebuilding a fort near Rashid
(Rosetta) in the Nile delta. It is a slab of granodiorite about 112 by 76 cm, now in the British
Museum (EA24), carrying a decree of 196 BCE in honour of Ptolemy V. The decree is written three
times: 14 lines of hieroglyphs, 32 of demotic, and 54 of Greek. The decree itself names
the three scripts: in Wikipedia's rendering, the "language of the gods", the "language of
documents" and the "language of the Greeks".

The Egyptian names behind those phrases say how the Egyptians saw their own writing.
Hieroglyphs were *mdw-nṯr*, "god's words; sacred writings". Demotic was *zẖꜣ.w-n-šꜥ.t*, from
*zẖꜣ*, "to write", and *šꜥ.t*, "document; letter; book": the writing of documents, a fast cursive
for contracts and letters that by Ptolemaic times looked nothing like the pictures it came from.
Young called the middle script *enchorial*, from Greek ἐγχώριος (*enkhṓrios*), "in or of the
country", the native script as against the Greek.

The Greek was read at once, so everyone knew what the Egyptian texts said. The difficulty was
that knowing a translation does not tell you how a script works. Silvestre de Sacy and the
Swedish diplomat Johan David Åkerblad worked on the demotic in 1802. De Sacy picked out the names
Ptolemy, Alexander and Arsinoe; Åkerblad proposed an alphabet of 29 demotic signs, about half of
which turned out to be right. Both assumed demotic was spelled out letter by letter, and both
stopped.

## Young's key

Young began on the stone in 1814 and published his results anonymously in an article, "Egypt",
in a supplement to the *Encyclopaedia Britannica*.[^young-date] He saw that demotic was
related to the hieroglyphs, correlating about 80 signs between them, and that it mixed signs for sounds with
signs for words, which de Sacy and Åkerblad had missed. The article offered conjectural
translations of 218 demotic and 200 hieroglyphic words.

In the hieroglyphs he took the Ptolemy cartouche apart and assigned sound values to its signs.
Of the 13 sound values he proposed there, Wikipedia's account counts six correct, three partly
correct and four wrong. He tried the name Berenice too, with less success: only its *n* was
right. That is the first row of the table, and it is real progress.

What stopped him was a belief, not a mistake about a sign. Young was convinced that phonetic
hieroglyphs were used only for words that were not Egyptian: foreign rulers like Ptolemy, whose
names had no meaning in the language and had to be spelled out. Native names and words, he
thought, were written with signs for ideas. On that view the sound values were a special
device for Greek names, and the Egyptian language did not come into it. There was nothing to
check a value against except the Greek name it was supposed to spell.

## From names to a language

Champollion was further from the answer than Young as late as 1821, when he believed that none
of the Egyptian scripts was phonetic. A year later he had changed his mind. His *Lettre à M.
Dacier*, read to the Académie des Inscriptions on 27 September 1822 and published that autumn,
worked out the sound values from the names of the Greek and Roman rulers of Egypt. The Cleopatra
cartouche did the checking: three of his values from Ptolemy, *p*,
*l* and *o*, fell in the right places in Cleopatra too. That is the second row, and in method it
is still Young's: Greek names, checked against Greek spellings.

The letter ends with a hint of something larger. The same phonetic signs, Champollion wrote,

> sont employés aussi dans les textes hiéroglyphiques gravés fort antérieurement à l'arrivée des
> Grecs en Égypte
>
> are also used in hieroglyphic texts carved long before the Greeks arrived in Egypt
>
> Champollion, *Lettre à M. Dacier* (1822), in the 1921 reprint, p. XXVI[^ocr]

That claim is the third row. In copies of inscriptions from the temple of Abu Simbel, carved
long before the Greeks came, he found a cartouche with four signs. The first was a sun disc; Coptic for
"sun" is ⲣⲏ (*rē*), and Egyptian *rꜥw* is the sun and the god Ra. The last two were the *s* he
already knew from Ptolemy. The second he read as *m*, which gave Ra-m-s-s: Ramesses. The group *ms* also made a word. Coptic
ⲙⲓⲥⲉ (*mise*) means "bear, bring forth" in Crum's dictionary, and the name came out as a
sentence, *Rꜥw-ms-sw*, Ra is the one who bore him. The second cartouche began with an ibis,
the bird of the god Thoth, *Ḏḥw.tj*, followed by the same sign: Thoth-mes, Thutmose.

This is the step Young's view had ruled out, and it differs in kind from the first two rows. A
value proposed for a sign was now tested by whether the word it produced existed in Egyptian,
and Coptic was the only Egyptian anyone could read. A wrong value turns *ms* into a string that
means nothing; the right one turns it into "bear" and a royal name into a phrase about a god. It
also showed that sound signs were not a device for foreigners. Egyptians wrote their own names,
and their own words, with them. By his *Précis* of 1824, a summary of the hieroglyphic system, Champollion
described the script as a mixture of sound signs and signs for ideas, used together, in his
phrase as Wikipedia translates it:

> in one and the same text, in one and the same sentence, and, I might even venture, one and the same word
>
> Champollion, *Précis* (1824), as translated by Wikipedia[^precis-quote]

**When this happened is itself disputed.** The traditional date for the Abu Simbel reading is 14
September 1822, eight days before the letter to Dacier was finished, and comes from the
biography by Hermine Hartleben (1906). Andrew Robinson suggests that Champollion realised how far phonetic writing went only in
December 1822, and Jed Buchwald and Diane Josefowicz find no sign in the primary documents of
the breakthrough before March 1823. If they are right, the hint at the end of the letter was a
guess that Abu Simbel later confirmed, not the report of a reading already made. That is why the
table gives 1822–23. These dates are known here from Wikipedia's summary of the three works, not
from the works themselves.

## Who deciphered it

Both men described the same events in print, and each title shows the claim. Young's book of
1823 is called:

> An Account of Some Recent Discoveries in Hieroglyphical Literature, and Egyptian Antiquities.
> Including the Author's Original Alphabet, as Extended by Mr. Champollion
>
> Young (1823), title page

"Original" and "extended" put the alphabet in Young's hands and Champollion's work after it. In
private correspondence after the reading of the letter to Dacier, Young also wrote that if
Champollion had borrowed an English key, "the lock was so dreadfully rusty, that no common arm
would have strength enough to turn it": a compliment that keeps the key English.[^rusty]

Champollion answered in the introduction to the *Précis*. He begins by declaring his high esteem for Young:

> Je me hâte donc de déclarer la haute estime que je professe pour la personne et les travaux de M. le docteur Young
>
> So I hasten to declare the high esteem I profess for the person and the works of Dr Young
>
> Champollion, *Précis* (1824), pp. 7–8[^ocr]

Then he turns it into a demand: Young must
recognise in his turn that on 27 September 1822 he

> n'avait encore, 1.° aucune idée fixe sur l'existence ni sur la nature générale de l'écriture
> phonétique […] ni aucune certitude sur la valeur, ou alphabétique, ou syllabique, ou
> dissyllabique
>
> still had, first, no settled idea of the existence or the general nature of phonetic writing
> […] nor any certainty about the value, whether alphabetic, syllabic or two-syllable
>
> Champollion, *Précis* (1824), p. 8[^ocr]

of eleven of the thirteen signs Young had read in Ptolemy and Berenice. He adds that Young's
values for eight of them were wrong, and that "mon alphabet seul y a ramené et l'auteur et le
public": his alphabet alone, he says, had brought both Young and the public back to them.

Read closely, the two passages are not about the same thing. Young's title counts signs, and on
signs he has a case: he had values before Champollion, and some were right. Champollion's reply
counts something else, an "idée fixe" about phonetic writing as a system, and on that he has the
better case, because Young's settled idea was the wrong one. Champollion's count is also harsher than
the modern one (eight wrong, where Wikipedia's account has four wrong and three partly right),
which is a reason to read him as an advocate.

Modern verdicts follow the same line. John Ray writes that Young "probably deserves to be known
as the decipherer of demotic"; Richard Parkinson puts it as "Young discovered parts of an
alphabet, a key, but Champollion unlocked an entire language". The quarrel was also national, the
British tending to back Young and the French Champollion, and it ran on after both men had died
(Champollion in 1832). The position taken here is Parkinson's, with a reason
attached: what made Champollion's work a decipherment rather than an alphabet was that it could
be checked against a language, and that was the part Young's belief about foreign names had
closed off.

## Why Coptic was the key, and where it misled

Coptic could do this because it is the same language as the hieroglyphs, two and a half thousand
years on, written in a different script. Egyptian is a branch of the Afroasiatic family, and its
history runs in stages, each with its own grammar.

<svg viewBox="0 0 640 236" role="img" aria-label="Timeline from 2600 BCE to 1900 CE: Old, Middle, Late, Demotic and Coptic Egyptian, with the periods of hieroglyphic, demotic and Coptic writing, the Rosetta Stone in 196 BCE and the decipherment in 1822" xmlns="http://www.w3.org/2000/svg">
<title>Stages of the Egyptian language and the scripts that wrote it</title>
<rect x="70.0" y="34" width="73.3" height="24" style="fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent)"/>
<text x="106.7" y="50" text-anchor="middle" font-size="14" fill="currentColor">Old</text>
<rect x="143.3" y="34" width="79.5" height="24" style="fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent)"/>
<text x="183.1" y="50" text-anchor="middle" font-size="14" fill="currentColor">Middle</text>
<rect x="222.8" y="34" width="79.4" height="24" style="fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent)"/>
<text x="262.5" y="50" text-anchor="middle" font-size="14" fill="currentColor">Late</text>
<rect x="302.2" y="34" width="134.5" height="24" style="fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent)"/>
<text x="324.2" y="50" text-anchor="middle" font-size="14" fill="currentColor">Demotic</text>
<rect x="412.2" y="64" width="183.4" height="24" style="fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent)"/>
<line x1="595.6" y1="76.0" x2="620.0" y2="76.0" style="stroke: var(--accent); stroke-dasharray: 4 3"/>
<text x="503.9" y="80" text-anchor="middle" font-size="14" fill="currentColor">Coptic</text>
<rect x="70.0" y="110" width="365.9" height="24" style="fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent)"/>
<text x="252.9" y="126" text-anchor="middle" font-size="14" fill="currentColor">hieroglyphs (to 394)</text>
<rect x="308.3" y="140" width="134.7" height="24" style="fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent)"/>
<text x="449.0" y="156" text-anchor="start" font-size="14" fill="currentColor">demotic (to 452)</text>
<rect x="400.0" y="170" width="220.0" height="24" style="fill: var(--accent); fill-opacity: 0.18; stroke: var(--accent)"/>
<text x="510.0" y="186" text-anchor="middle" font-size="14" fill="currentColor">Coptic alphabet</text>
<text x="64" y="50" text-anchor="end" font-size="14" style="fill: var(--muted)">language</text>
<text x="64" y="126" text-anchor="end" font-size="14" style="fill: var(--muted)">scripts</text>
<line x1="70" y1="210" x2="620" y2="210" style="stroke: var(--ink)"/>
<line x1="82.2" y1="210" x2="82.2" y2="215" style="stroke: var(--ink)"/>
<text x="82.2" y="228" text-anchor="middle" font-size="12" fill="currentColor">2500 BCE</text>
<line x1="143.3" y1="210" x2="143.3" y2="215" style="stroke: var(--ink)"/>
<text x="143.3" y="228" text-anchor="middle" font-size="12" fill="currentColor">2000 BCE</text>
<line x1="204.4" y1="210" x2="204.4" y2="215" style="stroke: var(--ink)"/>
<text x="204.4" y="228" text-anchor="middle" font-size="12" fill="currentColor">1500 BCE</text>
<line x1="265.6" y1="210" x2="265.6" y2="215" style="stroke: var(--ink)"/>
<text x="265.6" y="228" text-anchor="middle" font-size="12" fill="currentColor">1000 BCE</text>
<line x1="326.7" y1="210" x2="326.7" y2="215" style="stroke: var(--ink)"/>
<text x="326.7" y="228" text-anchor="middle" font-size="12" fill="currentColor">500 BCE</text>
<line x1="387.9" y1="210" x2="387.9" y2="215" style="stroke: var(--ink)"/>
<text x="387.9" y="228" text-anchor="middle" font-size="12" fill="currentColor">1 CE</text>
<line x1="448.9" y1="210" x2="448.9" y2="215" style="stroke: var(--ink)"/>
<text x="448.9" y="228" text-anchor="middle" font-size="12" fill="currentColor">500 CE</text>
<line x1="510.0" y1="210" x2="510.0" y2="215" style="stroke: var(--ink)"/>
<text x="510.0" y="228" text-anchor="middle" font-size="12" fill="currentColor">1000 CE</text>
<line x1="571.1" y1="210" x2="571.1" y2="215" style="stroke: var(--ink)"/>
<text x="571.1" y="228" text-anchor="middle" font-size="12" fill="currentColor">1500 CE</text>
<line x1="363.8" y1="26" x2="363.8" y2="210" style="stroke: var(--ink); stroke-width: 1.2"/>
<text x="363.8" y="22" text-anchor="middle" font-size="12" fill="currentColor">Rosetta Stone, 196 BCE</text>
<line x1="610.5" y1="26" x2="610.5" y2="210" style="stroke: var(--ink); stroke-width: 1.2"/>
<text x="614.5" y="22" text-anchor="end" font-size="12" fill="currentColor">decipherment, 1822</text>
</svg>

*Stages of Egyptian (top two rows) and the scripts that wrote it (bottom three), from 2600 BCE.
Archaic Egyptian, before about 2600 BCE, is left off. Dates are approximate and follow
Wikipedia's articles on Egyptian, Coptic and the hieroglyphs; the dashed line is Coptic's
survival in church use, where the Coptic alphabet is still written.*

| Stage | Approximate dates |
| --- | --- |
| Old Egyptian | 2600–2000 BCE |
| Middle Egyptian | 2000–1350 BCE |
| Late Egyptian | 1350–700 BCE |
| Demotic | 700 BCE – 400 CE |
| Coptic | from about 200 CE |

The scripts and the stages are different things. Hieroglyphs wrote Old, Middle and later
Egyptian for three thousand years; demotic is both a script, from the seventh century BCE, and
the name of the stage of the language written in it. Coptic is the stage written in the
Coptic alphabet: the Greek alphabet plus six or seven letters taken from demotic, depending on
the dialect, for sounds Greek lacked, such as ϣ (*š*) and ϥ (*f*). The earliest Coptic text is
from the first century CE. Until the tenth century Coptic remained the spoken language of the native population outside
the capital; it survived as a first language in places until at least the seventeenth,
and is still used in the liturgy of the Coptic Orthodox and Coptic Catholic churches. Its own
name for the language is ϯⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ (*timetremǹkhēmi*), "Egyptian"; in hieroglyphic texts
the country is *Km.t*, "Black-land".

Two things made Coptic the key. First, it was a living tradition with grammars and dictionaries,
from Kircher on, so Champollion could learn it as a language with words and grammar. Second, it was **the first stage
written with vowels**. Hieroglyphs, hieratic and demotic do not normally write vowels: *nfr*, "good", is
pronounced *nefer* in modern Egyptology only by a convention of inserting *e*. Coptic letters
include the vowels, so for words that survived into Coptic it gives an actual pronunciation, if a
late one. The other direct evidence for vowels comes from the outside: Hittite cuneiform letters
spell the name of Ramesses II as *Riamessesa*, an earlier witness whose vowels do not simply
match the Coptic ones (*Ria-* against ⲣⲏ, *rē*).

The same reliance misled him. Champollion often overestimated how close classical Egyptian was to
Coptic, and he treated most sound signs as single letters, like an alphabet. The *ms* sign in the
Ramesses cartouche, which he read as *m*, in fact stands for two consonants, *ms*, and many signs
stand for two or three. It was Karl Richard Lepsius, in 1837, who showed that many hieroglyphs
represented combinations of two or three sounds, not one, and corrected one of the most
fundamental faults in Champollion's system. The Coptic test worked because the words had
survived; it could not show how the script spelled them, which had to be learned from the
inscriptions themselves.

## What computers add

The script has been readable since the 1820s, so nothing a computer does for Egyptian is
decipherment. Its contributions are of four kinds, and the published work is more modest than
the way it tends to be described.

**Encoding.** For hieroglyphs to be searched, they first need code points. Unicode added an
Egyptian Hieroglyphs block of 1,071 signs in version 5.2 (2009), one more in 15.0 (2022), and a
block called Egyptian Hieroglyphs Extended-A, with 3,995 more, in 16.0 (2024). The repertoire to
be covered is large: about 900 distinct signs in the Middle Kingdom, and more than 5,000 by the
Greco-Roman period.

**Dictionaries and corpora.** The TLA has been online since 2004, run by the Berlin-Brandenburg
Academy of Sciences, with a new version since 2022. A January 2018 extract released under a CC
BY-SA licence, the *Ancient Egyptian Dictionary* data, has a word list with 35,052 entries, of
which 3,409 are roots and 9,244 are names (counted here from its `dictionary.xml`), and more than
11,000 texts. Every transliteration in this note's table comes from it. This is the
infrastructure everything else stands on, and it was built by hand.

**Translation.** Philipp Wiesenbach and Stefan Riezler (2019) trained a neural model to translate
Middle Egyptian from hieroglyph codes into German, on 29,269 sentence pairs from the TLA. The
baseline scored 19.77 BLEU; adding related tasks (transliteration, parts of speech) raised it by
about 3 points, to about 22.8; translating from a human transliteration instead scored 27.67. A
BLEU score in the twenties means output that shares a fair number of word sequences with the
reference translation, not a usable translation, and the authors make no claim that it is. One of
their examples has the baseline put the god Re-Harakhte where the text names Thoth. So Miyagawa
(2025) adds a retrieved Coptic–Egyptian lexicon to a general language model (Claude 3.5 Sonnet)
and reports, on one text, a coronation decree of the early 18th dynasty, that it gave the most accurate of
the translations compared; the abstract gives no scores.

**Restoration and "decipherment".** Two well-known results are not about Egyptian at all, and
both start from a language that is already known. Ithaca (Assael et al., 2022) restores damaged Greek inscriptions: alone
it restores damaged text with 62% accuracy, and historians working with it improve from 25% to 72%.
No comparable published system for Egyptian was found for this note. Jiaming Luo, Yuan Cao and
Regina Barzilay (2019) describe "neural decipherment" of Ugaritic and Linear B, and the model
correctly translates 67.3% of Linear B cognates. But both scripts had already been read by hand
long before,[^linearb] and the method works by matching words to a **known related language** (for Linear B, Greek). That is Champollion's Coptic check, automated. It suits a
script whose language has a known relative, and has nothing to match against when the language
has none. For Egyptian, the relative was found in 1822.

So a claim that AI is "deciphering" hieroglyphs should be read as something narrower. Every
system described here starts from the reading of the 1820s and from corpora and dictionaries
that Egyptologists built by hand, and produces a draft or a guess for a person to check. That
saves time. None of it reads a text that Egyptologists cannot.

## Where the evidence is thin

- **Most of the history is secondhand.** The accounts of Kircher, Barthélemy, Zoëga, de Sacy,
  Åkerblad and Young's article, and the counts of their right and wrong values, come from
  Wikipedia's articles on the decipherment, Champollion, Young and Kircher, which cite Iversen,
  Robinson, Ray, Parkinson and others. None of those books was opened.
- **The primary texts were read as OCR.** The quotations from the *Lettre*, the *Précis* and
  Young's book come from machine-read scans of the 1921 reprint and the 1824 and 1823 editions;
  obvious OCR errors were corrected, and the corrected readings have not been compared with the
  page images.
- **The Abu Simbel reading.** The details given here (sun disc, *m*, two *s*; Coptic ⲣⲏ and ⲙⲓⲥⲉ;
  the ibis) are from Wikipedia's English and French accounts, not from Champollion's own
  description, which is in the part of the *Précis* that could not be read. Its date is disputed,
  as above.
- **The Greek of the decree** was not opened; its names for the three scripts are given through
  Wikipedia's English.
- **Recent technology.** Only the abstracts of the 2025 THOTH AI paper and the 2022 Ithaca paper,
  and the full text of the 2019 translation paper, were read.

## Sources

- J.-F. Champollion, *Lettre à M. Dacier relative à l'alphabet des hiéroglyphes phonétiques* (Firmin-Didot, 1822), reprinted in *Monuments et mémoires de la Fondation Eugène Piot* 25 (1921), p. XXVI. [archive.org](https://archive.org/details/champollion-lettre-a-monsieur-dacier), [doi:10.3406/piot.1921.1813](https://doi.org/10.3406/piot.1921.1813)
- J.-F. Champollion, *Précis du système hiéroglyphique des anciens Égyptiens* (Treuttel et Würtz, 1824), introduction, pp. 7–9. [archive.org](https://archive.org/details/prcisdusystm00cham)
- T. Young, *An Account of Some Recent Discoveries in Hieroglyphical Literature, and Egyptian Antiquities* (John Murray, 1823), title page and preface. [archive.org](https://archive.org/details/anaccountsomere00youngoog)
- British Museum, "The Rosetta Stone", EA24, collection record. [britishmuseum.org](https://www.britishmuseum.org/collection/object/Y_EA24)
- W. E. Crum, *A Coptic Dictionary* (Clarendon Press, 1939), pp. 185a (ⲙⲓⲥⲉ) and 287b (ⲣⲏ), as digitised by the ⲣⲉⲙⲛ̀Ⲭⲏⲙⲓ project. [ⲙⲓⲥⲉ](https://github.com/pishoyg/coptic/blob/main/docs/crum/26.html), [ⲣⲏ](https://github.com/pishoyg/coptic/blob/main/docs/crum/1314.html)
- S. D. Schweitzer (ed.), *aed-tei: Corpus of Egyptian Texts for the AED*, from the TLA database of January 2018 (2019), `dictionary.xml`: entries *mdw-nṯr*, *zẖꜣ.w-n-šꜥ.t*, *šꜥ.t*, *zẖꜣ*, *msi̯*, *rꜥw*, *Km.t*, *šn*, *Ḏḥw.tj* and the four royal names. [doi:10.5281/zenodo.3580939](https://doi.org/10.5281/zenodo.3580939), [github.com](https://github.com/simondschweitzer/aed-tei)
- Thesaurus Linguae Aegyptiae, version 1 (corpus version 16, 2014). [aaew.bbaw.de](https://aaew.bbaw.de/tla/)
- P. Wiesenbach, S. Riezler, "Multi-Task Modeling of Phonographic Languages: Translating Middle Egyptian Hieroglyphs", *Proceedings of the International Workshop on Spoken Language Translation* (IWSLT 2019). [cl.uni-heidelberg.de](https://www.cl.uni-heidelberg.de/statnlpgroup/publications/IWSLT2019_v2.pdf)
- S. Miyagawa, "RAG-Enhanced Neural Machine Translation of Ancient Egyptian Text: A Case Study of THOTH AI", *Proceedings of NLP4DH 2025*, 33–40 (2025). [doi:10.18653/v1/2025.nlp4dh-1.4](https://doi.org/10.18653/v1/2025.nlp4dh-1.4)
- J. Luo, Y. Cao, R. Barzilay, "Neural Decipherment via Minimum-Cost Flow: From Ugaritic to Linear B", *Proceedings of the 57th Annual Meeting of the ACL*, 3146–3155 (2019). [doi:10.18653/v1/P19-1303](https://doi.org/10.18653/v1/P19-1303)
- Y. Assael, T. Sommerschield, B. Shillingford et al., "Restoring and attributing ancient texts using deep neural networks", *Nature* 603, 280–283 (2022). [doi:10.1038/s41586-022-04448-z](https://doi.org/10.1038/s41586-022-04448-z)
- "Decipherment of ancient Egyptian scripts", *Wikipedia* (read November 2026), for Horapollo, Kircher, Barthélemy, Zoëga, de Sacy, Åkerblad, Young's article and values, the Cleopatra and Abu Simbel readings, the dating dispute (Hartleben, Robinson, Buchwald and Josefowicz), the views of Ray and Parkinson, Young's "rusty" letter, Lepsius, the last hieroglyphic and demotic inscriptions, and the English of the *Précis* sentence. [en.wikipedia.org](https://en.wikipedia.org/wiki/Decipherment_of_ancient_Egyptian_scripts)
- "Jean-François Champollion", *Wikipedia* in English and French (read November 2026), for his 1821 views, the Abu Simbel cartouches and his death. [en.wikipedia.org](https://en.wikipedia.org/wiki/Jean-Fran%C3%A7ois_Champollion), [fr.wikipedia.org](https://fr.wikipedia.org/wiki/Jean-Fran%C3%A7ois_Champollion)
- "Thomas Young (scientist)", *Wikipedia* (read November 2026), for his dates and the national division over credit. [en.wikipedia.org](https://en.wikipedia.org/wiki/Thomas_Young_(scientist))
- "Athanasius Kircher", *Wikipedia* (read November 2026), for his Coptic work. [en.wikipedia.org](https://en.wikipedia.org/wiki/Athanasius_Kircher)
- "Rosetta Stone", *Wikipedia* (read November 2026), for the find and the decree's names for the scripts. [en.wikipedia.org](https://en.wikipedia.org/wiki/Rosetta_Stone)
- "Egyptian language", "Coptic language", "Coptic script" and "Egyptian hieroglyphs", *Wikipedia* (read November 2026), for the stages, the Coptic alphabet and dates, vowels and sign counts. [Egyptian](https://en.wikipedia.org/wiki/Egyptian_language), [Coptic](https://en.wikipedia.org/wiki/Coptic_language), [Coptic script](https://en.wikipedia.org/wiki/Coptic_alphabet), [hieroglyphs](https://en.wikipedia.org/wiki/Egyptian_hieroglyphs)
- "Ramesses II", *Wikipedia* (read November 2026), for the cuneiform form of the name. [en.wikipedia.org](https://en.wikipedia.org/wiki/Ramesses_II)
- "Egyptian Hieroglyphs (Unicode block)" and "Egyptian Hieroglyphs Extended-A", *Wikipedia* (read November 2026). [block](https://en.wikipedia.org/wiki/Egyptian_Hieroglyphs_(Unicode_block)), [Extended-A](https://en.wikipedia.org/wiki/Egyptian_Hieroglyphs_Extended-A)

[^young-date]: Wikipedia's articles on the decipherment and on Champollion date the article 1819; its article on Young says it was written for the 1818 edition. The supplement's own title page wasn't checked.
[^ocr]: Quoted from the OCR text of the archive.org scan, with obvious OCR errors corrected (for example *lerles* to *textes*); not compared with the page image. The page number is read from the OCR's page markers and may be off by one.
[^precis-quote]: The French original of this sentence wasn't found in the parts of the *Précis* that could be read. Wikipedia's article on the decipherment attributes it to the *Précis*; its article on the *Lettre* attributes a version of it to the letter of 1822.
[^rusty]: Known here only from Wikipedia's article on the decipherment, which cites John Ray, *The Rosetta Stone and the Rebirth of Ancient Egypt* (2007), pp. 67–69, and Lesley and Roy Adkins, *The Keys of Egypt* (2000), pp. 188–189. Not found in the part of Young's 1823 book that was read.
[^linearb]: From general knowledge, not checked against a source here: Ugaritic was read in 1929–30, and Linear B by Michael Ventris in 1952. The Luo et al. abstract itself calls Linear B a script for a language "related to ancient Greek".
