# Sources and physical grounding

This file records the external historical grounding used while tuning the scenarios.  
For now it focuses on **Agincourt (1415)** because that is the battle implemented with the most explicit proxy choices.

## Agincourt (1415)

### Formation and frontage
- **Anne Curry, _Agincourt: A New History_ (2005).** Used for the lower-end modern estimate of roughly 9,000 English and 12,000 French, which keeps the validation metadata close to a conservative scholarly reconstruction rather than the much larger traditional totals.
- **Juliet Barker, _Agincourt: Henry V and the Battle That Made England_ (2005).** Used as the narrative cross-check for the English deployment: dismounted men-at-arms in the centre, longbowmen on the wings, and a battlefield constricted by woodland.
- **World History Encyclopedia, “Battle of Agincourt”.** Used as a quick-access secondary source confirming that Agincourt featured an unusually high archer-to-men-at-arms ratio, approximately 3:1, which is mirrored in the scenario’s 10 archers to 4 men-at-arms split. <https://www.worldhistory.org/Battle_of_Agincourt/>
- **British Battles, “Battle of Agincourt”.** Used for the physical description of a narrow, rain-soaked, ploughed field squeezed by woods; that directly motivated the combined `corridorObstacles(...)` + `muddyField(...)` terrain model. <https://www.britishbattles.com/one-hundred-years-war/battle-of-agincourt/>

### Terrain and mobility
- **Encyclopedia.com, “Hundred Years’ War (1337–1453)”.** Used as an additional secondary source for the core physical claim that muddy ground disproportionately punished heavily armoured French attackers. <https://www.encyclopedia.com/history/encyclopedias-almanacs-transcripts-and-maps/hundred-years-war-1337-1453>
- **The Metropolitan Museum of Art, “Arms and Armor—Common Misconceptions and Frequently Asked Questions”.** Used to ground armor mass and mobility assumptions: full field armor is typically around 20–25 kg and does not make a wearer immobile by itself. That is why the Agincourt French archetypes are not made intrinsically helpless; instead, the extra burden is represented by higher fatigue and lower stability when combined with mud. <https://www.metmuseum.org/it/essays/arms-and-armor-common-misconceptions-and-frequently-asked-questions>

### Projectile performance
- **Mary Rose Trust, “Archery and longbows on the Mary Rose”.** Used to ground the warbow as a very high-draw ranged weapon rather than a generic medieval bow. The surviving bows are reported with estimated draw weights ranging from roughly 65 to 175 pounds, peaking around 110 pounds; that supports keeping the Agincourt archer archetype stronger and less fatigable than the generic human base. <https://maryrose.org/discover/collections/the-weaponry-of-the-mary-rose/longbows-and-arrows/>
- **Royal Armouries, “The Hundred Years’ War 1337–1453”.** Used as a museum-side equipment sanity check for late-medieval anti-armour weapons such as maces and polearms, supporting the Agincourt loadout choice that pushes the melee exchange toward short, armor-focused weapons after contact. <https://royalarmouries.org/objects-and-stories/stories/the-hundred-years-war-1337-1453>

## Modeling notes
- I treated **mud + compression + fatigue** as the main physically grounded mechanism at Agincourt, not raw one-shot lethality.
- I kept the English force **bow-heavy** because that is one of the most stable points across modern summaries and campaign accounting.
- I did **not** model horses, individual stakes, or sequential reserve arrivals because the current Ananke arena kernel does not expose those mechanics; those omissions are documented inside the scenario validation metadata as explicit substitutions.
