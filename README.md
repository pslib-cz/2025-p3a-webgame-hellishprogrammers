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
| **😊 Happiness** (Štěstí) | Ovlivňuje produktivitu. Nízké štěstí = pomalejší práce. |
| **⚡ Electricity** (Elektřina)| Vyžadována pro pokročilé budovy. |
| **🏭 Industry** (Průmysl) | Využíváno pro pokročilé budovy |

## 🏗️ Budovy a Synergie

Příklady interakcí ve hře:

* **Domy (Domy):** Získávají bonus +2 lidi za každý sousední Park.
* **Kanceláře:** +20 % peněz, bonus se násobí "Blue" synergií.
* **Obchod:** Zdvojnásobuje výnos, pokud sousedí s jinou komerční budovou.
* **Továrna:** Generuje průmysl, ale snižuje štěstí (-1) a peníze (-1).
* **Park:** Zvyšuje štěstí (+2), ale více parků vedle sebe může mít klesající efekt.

## Rozdělení práce

### Mykhailo: Frontend & UI
*Zodpovědnost: To, jak hra vypadá a jak se ovládá.*

* Rozhodnutí Canvas vs. HTML Grid: Rozlousknout "Technologický problém" z tabulky.
* UI Layout: Vytvořit postranní panel (Nabídka budov) a horní lištu (Statistiky: Money, People, Happiness...).
* Interaktivita: Implementovat drag & drop nebo "click to build" systém pro umisťování budov do mřížky.
* Vizuální feedback: Zobrazit šipky nebo barvy (zelená/červená) při umisťování budovy, aby hráč viděl synergie.

### Matěj: Backend & Data Model
*Zodpovědnost: Logika na pozadí, ukládání a validace.*

* API Endpointy: Vytvořit Controller v ASP.NET pro:
  * GET /gamestate (načtení hry)
  * POST /build (pošle souřadnice a typ budovy, vrátí nový stav surovin).
* Logika výpočtu (Engine): Zde se bude dít "magie". Potřeba vytvořit C# třídy pro budovy.
 * Implementovat algoritmus, který po každém tahu přepočítá sousedy a aplikuje bonusy (Synergie).
 * Udělat to robustně, aby se dalo snadno přidat nové pravidlo (např. Factory -1 Happiness).
* Ukládání postupu: stačí jednoduchá JSON serializace do souboru nebo in-memory databáze pro začátek.

### Daniel: Gameplay Loop & State Management
*Zodpovědnost: Propojení frontendu a backendu, pravidla hry.*

* React State: Držet aktuální stav peněz a surovin na klientovi, aby se UI aktualizovalo okamžitě (optimistic updates), než přijde potvrzení ze serveru.
* Game Loop (Timer): Implementovat "Časování".
* Timer, který každých X sekund přidá peníze na základě statistiky "Money per second".
* Podmínky prohry/výhry: Implementovat logiku "Cíl" (např. "Máš 5 minut na získání 1000 peněz").
* Generace mapy: Implementovat "Překážky na mapě" – náhodně zablokovat některá políčka (voda/skály), kde nejde stavět.
