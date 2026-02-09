# 🏙️ Synergy District

**Synergy District** je strategická budovatelská webová hra založená na mřížce (grid-based), kde hlavním cílem je efektivní umisťování budov pro maximalizaci zisku a spokojenosti obyvatel. Hra klade důraz na **synergie** – vzájemné ovlivňování sousedících budov.

## 🎮 O hře

Hráč staví město na omezené ploše. Každá budova má svou cenu, požadavky a především bonusy (nebo postihy), které závisí na tom, co stojí vedle ní.

### Klíčové mechaniky
* **Grid systém:** Stavění probíhá na čtvercové síti.
* **Synergie:** Umístění továrny vedle domu sníží spokojenost, ale park vedle domu přiláká více lidí.
* **Management zdrojů:** Musíte balancovat 5 hlavních statistik.
* **Časový tlak / Cíle:** Hra obsahuje herní módy s časovým limitem nebo cílem (např. "dosáhni 100 populace").

## 📊 Statistiky a Zdroje

Hráč musí balancovat následující metriky:

| Statistika | Význam |
| :--- | :--- |
| **👥 People** (Lidé) | Nutní pro fungování budov. Získávají se z Domů. |
| **💰 Money** (Peníze) | Generují se v čase. Potřeba pro nákup nových budov. |
| **😊 Happiness** (Štěstí) | Násobič výsledného skóre.  |
| **⚡ Electricity** (Elektřina)| Vyžadována pro pokročilé budovy. |
| **🏭 Industry** (Průmysl) | Využíváno pro pokročilé budovy |

## 🏗️ Budovy a Synergie

Příklady interakcí ve hře:

* **Domy (Domy):** Získávají bonus štěstí za každý sousední Park.
* **Kanceláře:** +20 % peněz, bonus se násobí "Blue" synergií.
* **Obchod:** Vydělává jenom pokud sousedí s Domem.
* **Továrna:** Generuje peníze, ale snižuje štěstí v okolí a spotřebovává industry.
* **Park:** Zvyšuje štěstí, ale více parků vedle sebe může mít klesající efekt.

## Rozdělení práce

### Mykhailo: Frontend & UI

* Návrh budov, jejich hodnot a jejich synergií
* Statistiky

### Matěj: Backend & Data Model

* Vykreslování mapy
* Generace mapy

### Daniel: Gameplay Loop & State Management

* Tutorial: Implementace tutorialu.
* UI a jejich komponenty
