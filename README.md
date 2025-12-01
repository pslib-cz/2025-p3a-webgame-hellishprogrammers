# The Devil's Deck

Webová strategická karetní hra inspirovaná Robloxem (Hitman Card Game). Kombinuje prvky *ruské rulety*, taktického myšlení ve stylu *Exploding Kittens* a napětí, kdy jeden špatný tah může rozhodnout.

---

## 🛠️ Technologie

### Frontend

* React.ts
* CSS
* Axios nebo Fetch API

### Backend

* ASP.NET Core Web API (C#)

### Databáze

* Prozatím:
  * Data v paměti pro lokální úložiště<br>
  * MSSQL (hlavně GET) pro získávání dat pro webové prvky
* Později:<br>
  Přidání long-pollingu pro podporu multiplayeru

---

## 🎮 Pravidla hry (zjednodušeně)

### Balíček karet obsahuje:
- Bezpečné karty  
- Uživatelské karty (Skip, Defuse, Shuffle atd.)  
- Ďáblovy karty  

### Průběh tahu
Každý hráč (nebo AI) si v tahu vezme 1 kartu z balíčku.

### Hrozba
- Pokud hráč vytáhne Ďáblovu kartu → je vyřazen  
- Zachránit se může obrannou kartou (např. Bodyguard, Disguise)  
- Pokud obrannou kartu použije, Ďáblova karta se vrací do balíčku.  
- Pokud ne → Ďáblova karta se odstraní a hráč končí.

### Výhra
Vyhrává poslední přeživší hráč (nebo AI).

---

## 👥 Tým a rozdělení práce

### **Mykhailo — Frontend**
**Zaměření:** UI/UX, React komponenty, animace

#### Úkoly:
- Inicializace React (TypeScript) projektu a struktury složek.
- Návrh a implementace vizuálního stylu karet a herní plochy.
- Animace (tah karty, míchání, vyřazení, UI přechody).
- Obrazovky: Menu, Nastavení, Hra, Game Over, Statistiky.
- Práce s mock daty do doby, než backend poskytne API.

**Výstup:** Responzivní, přehledné a vizuálně příjemné UI.

---

### **Matěj — Backend**
**Zaměření:** API, serverová logika, persistence

#### Úkoly:
- Vytvoření ASP.NET Core Web API projektu.
- Implementace endpointů, např.:
  - `POST /start-game` — vytvoření nové hry  
  - `POST /draw-card` — táhnutí karty / provedení akce  
  - `GET /game-state` — získání aktuálního stavu hry
- Logika práce s balíčkem (vytvoření, míchání, odstranění karet).
- Jednotkové testy základní logiky.
- Návrh rozhraní pro přechod na multiplayer (long-polling / websockets).

**Výstup:** Stabilní a testovatelný backend s dokumentovanými endpointy (Swagger).

---

### **Daniel — Logika & Integrace**
**Zaměření:** herní pravidla, state management, integrace FE ↔ BE

#### Úkoly:
- Implementace jádra hry v backendu: třídy `Card`, `Player`, `Deck`, event-handlery.
- Definice a implementace pravidel (efekty karet, životy, pořadí tahů).
- Implementace jednoduché AI pro singleplayer (různé úrovně agresivity).
- Nastavení sdíleného state na frontendu (React Context / Redux) + napojení na API.
- End-to-end testy chování „táhni kartu“ a odezvy UI.

**Výstup:** Funkční herní logika a hladká integrace mezi UI a API.

---

## 📅 Roadmapa

---

### **Fáze 1 — Singleplayer (Prototype)**  
**Cíl:** rychle fungující hratelný prototyp

#### Úkoly:
- Implementovat základní balíček karet a logiku v C#.
- Zprovoznit REST API se základními endpointy.
- Vytvořit React UI pro hraní proti jednoduchému botovi.
- Testování a ladění stavu hry a koncových stavů (vyřazení, game over).

#### Milníky:
- Backend: CRUD pro hru + endpoint `draw-card`.
- Frontend: herní obrazovka + vizualizace tahu.
- AI: jednoduchý náhodný / heuristický bot.

---

### **Fáze 2 — Vylepšení & rozšíření**  
**Cíl:** obohatit hratelnost a vizuální stránku

#### Úkoly:
- Přidat efekty uživatelských karet (Skip, Attack, Shuffle, Defuse atd.).
- Vylepšit AI (strategie, reakce na karty).
- Přidat animace, zvuky, notifikace a zlepšit UX.
- Přidat sledování skóre a statistiky hráče.

#### Milníky:
- Implementace všech hlavních typů karet a jejich efektů.
- Vylepšený bot s různými obtížnostmi.
- Ukládání statistik do MSSQL.

---

### **Fáze 3 — Multiplayer**  
**Cíl:** hrát s reálnými hráči v reálném čase

#### Úkoly:
- Implementovat real-time komunikaci (WebSockets / long-polling).
- Vytvořit lobby systém (sezení, vytváření her, pozvánky).
- Implementovat synchronizaci stavu hry mezi klienty.
- Přidat in-game chat a základní reputační systém.

#### Milníky:
- Stabilní real-time synchronizace více klientů.
- Lobby + matchmaking.
- Bezpečnostní a škálovatelnostní úvahy (autentizace, ochrana proti cheatům).
