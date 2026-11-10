---
title: "Fermentation math: sugar, gravity, and ABV"
summary: How much ethanol a fermentable sugar can make and how to read it off a hydrometer — the Gay-Lussac stoichiometry, grams of sugar per liter per % ABV, Plato from specific gravity, and the OG–FG formulas, worked on one 20 L batch.
date: 2026-11-10
tags: [spirits]
distillate: Fermentation turns sugar into ethanol with a theoretical yield of 0.511 g ethanol per g of glucose; since 1% ABV is 7.89 g of ethanol per liter, that is 15.4 g of sugar per liter per % ABV, about 17 g/L in practice. A 20 L batch at OG 1.048 holds about 2.50 kg of sugar, a ceiling near 8.1% ABV, and when it ferments to FG 1.008 the standard rule gives 5.25% ABV (the accurate variant 5.31%). The ceiling assumes every gram of extract is fermentable sugar and the readings are at 20 °C; real worts and warm samples break both.
model: [Mistral Large 4]
---

Fermentation is the step that makes the alcohol, before any still is involved. Yeast converts sugar into ethanol and carbon dioxide, and two questions decide what a batch can become: how much ethanol the sugar could possibly make, and how much it actually made, which a hydrometer answers from the gravity drop. This note works both on one batch. What happens to the resulting wash is covered in the [spirits note](note:how-spirits-distillation-works); the [law note](note:home-brewing-and-distilling-law) uses the same 20 L wash size as its example.

Throughout, the note uses one worked example:

| | value |
| --- | --- |
| batch | 20 L of wort |
| original gravity OG | 1.048 |
| final gravity FG | 1.008 |
| hydrometer | calibrated at 20 °C, samples read at 20 °C |
| assumption | all extract is fermentable sugar |

## The stoichiometry

Gay-Lussac (1815) wrote the fermentation of glucose as

$$
\mathrm{C_6H_{12}O_6 \rightarrow 2\,C_2H_5OH + 2\,CO_2}
$$

With molar masses 180.16 g/mol for glucose and 46.07 g/mol for ethanol (from C 12.011, H 1.008, O 15.999), the **theoretical yield** is

$$
Y = \frac{2 \times 46.07}{180.16} = 0.511 \text{ g ethanol per g glucose}
$$

No fermentation reaches this: some sugar goes to yeast biomass and byproducts such as glycerol. A typical fermentation reaches roughly 90% of theoretical, which is where the practical rules of thumb below come from.

## Grams of sugar per % ABV

**ABV** is percent by volume at 20 °C, so 1% ABV is 10 mL of ethanol per liter. Ethanol's density at 20 °C is 0.789 g/mL (NIST Chemistry WebBook, ethanol[^1]), so

$$
1\%\,\mathrm{ABV} = 10 \text{ mL/L} \times 0.789 \text{ g/mL} = 7.89 \text{ g ethanol per L}
$$

and at the theoretical yield that costs

$$
\frac{7.89\ \mathrm{g/L}}{0.511\ \mathrm{g/g}} = 15.4\ \mathrm{g\ sugar\ per\ L\ per\ \%\ ABV}
$$

Dividing by the typical 90% of theoretical gives about 17 g/L per % ABV, the rule brewers use to size a recipe.

[^1]: NIST Chemistry WebBook, [ethanol](https://webbook.nist.gov/cgi/cbook.cgi?ID=C64175): liquid density 0.789 g/mL at 20 °C.

## Reading the sugar from gravity

Before fermentation, the sugar is read indirectly: a **hydrometer** measures the **specific gravity** (SG) of the wort, the ratio of its density to water's. Dissolved sugar raises the SG above 1.000. Brewers usually convert SG to **Plato degrees** (°P, grams of extract per 100 g of solution) with the standard polynomial,

$$
^\circ\mathrm{P} = -616.868 + 1111.14\,\mathrm{SG} - 630.272\,\mathrm{SG}^2 + 135.997\,\mathrm{SG}^3
$$

which checks out at the ends: SG 1.000 gives about 0 °P and SG 1.040 gives 10.0 °P. For the example batch, °P at OG 1.048 is 11.91, and the wort weighs 20 L × 1.048 kg/L = 20.96 kg, so it holds

$$
11.91\ \mathrm{g/100\,g} \times 20.96\ \mathrm{kg} = 2.50\ \mathrm{kg\ of\ extract}
$$

Under the note's assumption, that is 2.50 kg of sugar.

Hydrometers are calibrated at 20 °C, and a warm sample is less dense, so the hydrometer sinks deeper and **reads high**. Cool the sample to 20 °C or apply the correction table that came with the meter.

## The ceiling on ABV

If all 2.50 kg of sugar fermented at the theoretical yield, the batch would make

$$
2.50\ \mathrm{kg} \times 0.511\ \mathrm{g/g} = 1.28\ \mathrm{kg}\ \rightarrow\ \frac{1.28}{0.789} = 1.62\ \mathrm{L\ ethanol}
\quad\Rightarrow\quad \frac{1.62}{20} = 8.1\%\ \mathrm{ABV}
$$

That is the ceiling: 20 L at 8.1% ABV contains 1.62 L of ethanol, about the 1.6 L of ethanol in the 20 L at 8% ABV wash the [law note](note:home-brewing-and-distilling-law) starts from.

## Estimating the actual ABV from the gravity drop

In the example the batch ferments from OG 1.048 down to FG 1.008. The standard brewing rule converts that drop directly to ABV:

$$
\mathrm{ABV} \approx 131.25 \times (\mathrm{OG} - \mathrm{FG}) = 131.25 \times 0.040 = 5.25\%
$$

A more accurate empirical variant, which accounts for the OG level and the final density, gives

$$
\mathrm{ABV} = 76.08\,\frac{\mathrm{OG}-\mathrm{FG}}{1.775-\mathrm{OG}} \times \frac{\mathrm{FG}}{0.794} = 76.08 \times \frac{0.040}{0.727} \times \frac{1.008}{0.794} = 5.31\%
$$

so the batch is about 5.3% ABV by either formula. The drop also gives the **apparent attenuation**, the fraction of extract the yeast consumed: $(1.048 - 1.008)/(1.048 - 1) = 83\%$.

The gravity-drop formulas sit below the stoichiometric ceiling on purpose: they are empirical fits to real fermentations and already include the yield shortfall (byproducts, biomass) and the fact that ethanol–water mixtures shrink when mixed. The ceiling above ignores both, so it is an upper bound, not a prediction.

## Measuring ABV directly

Once fermented, ABV is measured with an **alcoholmeter** (or estimated as above). Like the hydrometer, it is calibrated at 20 °C and a warm sample **reads high**. ABV, weight percent, and mole fraction differ substantially; the conversion table is in the [spirits note](note:how-spirits-distillation-works). When diluting a spirit with water, the mixture contracts, so the result measures slightly *stronger* than the volume arithmetic suggests.

## The whole calculation in Python

```python
# Worked example: 20 L of wort, OG 1.048, FG 1.008, readings at 20 C.
OG, FG, volume_L = 1.048, 1.008, 20.0
M_GLUCOSE, M_ETHANOL = 180.16, 46.07   # g/mol (C 12.011, H 1.008, O 15.999)
RHO_ETOH = 0.789                        # g/mL at 20 C (NIST WebBook, ethanol)
YIELD = 2 * M_ETHANOL / M_GLUCOSE       # theoretical g ethanol per g sugar

def plato(sg):  # standard SG -> Plato polynomial (g extract per 100 g solution)
    return -616.868 + 1111.14 * sg - 630.272 * sg**2 + 135.997 * sg**3

wort_kg = volume_L * OG                  # 1 L of wort at SG 1.048 weighs 1.048 kg
sugar_g = plato(OG) / 100 * wort_kg * 1000
ethanol_L = sugar_g / 1000 * YIELD / RHO_ETOH
print(f"Plato at OG: {plato(OG):.2f} degP; sugar: {sugar_g/1000:.2f} kg")
print(f"ethanol ceiling: {ethanol_L:.2f} L -> {ethanol_L / volume_L * 100:.1f}% ABV")
abv_simple = (OG - FG) * 131.25
abv_alt = 76.08 * (OG - FG) / (1.775 - OG) * (FG / 0.794)
print(f"ABV from gravity drop: {abv_simple:.2f}% (simple), {abv_alt:.2f}% (accurate)")
print(f"apparent attenuation: {(OG - FG) / (OG - 1) * 100:.0f}%")
```

which prints:

```
Plato at OG: 11.91 degP; sugar: 2.50 kg
ethanol ceiling: 1.62 L -> 8.1% ABV
ABV from gravity drop: 5.25% (simple), 5.31% (accurate)
apparent attenuation: 83%
```

## Limits

The ceiling assumes every gram of extract is fermentable sugar; real wort contains unfermentable sugars and proteins, and the °P polynomial is itself an approximation. The 131.25 rule is an empirical fit, accurate to a few tenths of a percent ABV at typical gravities, and both OG and FG must be temperature-corrected if the samples were not at 20 °C. ABV is defined at 20 °C; wt % and mole fraction are different bases. None of this models the yeast: how far a fermentation actually attenuates depends on the strain, temperature, and nutrients.
