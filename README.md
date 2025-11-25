# The Devil's Deck

A web-based strategic card game inspired by the Roblox **"Hitman Card Game"**, combining elements of *Russian Roulette*, *Exploding Kittens*-style strategy, and suspense-driven gameplay.

---

## 🎯 Overview

This project is built with:

* **Frontend:** React
* **Backend:** ASP.NET Core Web API

**Current Status:** Phase 1 — *Singleplayer Prototype*
**Future Goal:** Phase 2 — *Multiplayer with real-time gameplay*

---

## 🛠️ Tech Stack

### Frontend

* React.ts
* CSS
* Axios or Fetch API

### Backend

* ASP.NET Core Web API (C#)

### Data

* Initially:
  In-memory data for local storage
  MSSQL for getting data for web elements
* Later: SQL for multiplayer support

### Communication

* Phase 1: REST API (mainly GET)
* Phase 2: Adding Long Polling for multiplayer 

---

## 🎮 Game Rules (Simplified)

### The Deck

Contains:

* Safe cards
* Utility cards (Skip, Defuse, Shuffle, etc.)
* Devil cards

### Turn Structure

Each player draws one card per turn.

### The Threat

* Drawing a **Devil card** eliminates the player
* Unless they play a defensive card (e.g., *Bodyguard*, *Disguise*)
* After playing the defensive card, the Devil card is returned to the deck,
  otherwise, it is removed

### Winning

Last surviving player (or AI) wins.

---

## 🚀 Setup & Installation

### Prerequisites

* Node.js & npm
* .NET SDK (6.0 or 7.0+)

---

### 1. Backend Setup (ASP.NET Core)

```sh
cd backend
dotnet restore
dotnet run
```

API runs at:

```
http://localhost:5000
```

---

### 2. Frontend Setup (React)

```sh
cd frontend
npm install
npm start
```

React app runs at:

```
http://localhost:3000
```

---

## 👥 Team & Work Split

Below is a recommended 3-person division for efficient development.

### Mykhailo — Frontend Specialist

**Focus:** UI/UX, React components, animations

**Responsibilities:**

* Initialize React project structure
* Build card visuals & game board layout
* Create animations (draw, shuffle, elimination)
* Implement UI screens (Menu, Game, Game Over)
* Display mock JSON data until API is ready

**Key Deliverable:** A polished, responsive UI

---

### Matěj — Backend Specialist

**Focus:** API architecture, server logic

**Responsibilities:**

* Create ASP.NET Core Web API project
* Build endpoints:

  * `POST /start-game`
  * `POST /draw-card`
  * `GET /game-state`
* Implement deck generation & card distribution
* Prepare future multiplayer architecture

**Key Deliverable:** A fully testable game loop in Swagger/Postman

---

### Daniel — Logic & Integration

**Focus:** Game rules, state management, and cross-team integration

**Responsibilities:**

* Implement core game logic (Card, Player, Deck classes)
* Create rule handlers (HP, card triggers, etc.)
* Set up React Context or Redux
* Connect frontend actions → backend API
* Implement basic AI for Phase 1

**Key Deliverable:** Fully connected “Draw Card” interaction

---

## 📅 Roadmap

### Phase 1 — Singleplayer Prototype

* [ ] Basic deck logic (C#)
* [ ] React UI layout
* [ ] Random-drawing bot opponent
* [ ] Game over states

### Phase 2 — Refinement

* [ ] Utility card effects (Skip, Attack, Shuffle)
* [ ] Improved animations
* [ ] Score tracking

### Phase 3 — Multiplayer

* [ ] Real-time support
* [ ] Lobby system
* [ ] In-game chat

---

Made with ❤️ — feel free to copy this into `README.md` at the root of your repository. (Easter Egg)
