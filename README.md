# 💸 SignalBudget

**SignalBudget** is a modern, reactive expense tracking application built with Angular’s latest **Signals API** and **NgRx SignalStore**.
It demonstrates a clean, scalable approach to state management, real-time UI updates, and local persistence — without relying on traditional RxJS-heavy patterns.

---

## 🚀 Live Demo

https://flogey82.github.io/SignalBudget/

---

## 🧠 Why this project?

This project was built to explore **modern Angular architecture** using Signals and to replace classical observable-based state management with a more **predictable and ergonomic approach**.

Key focus areas:

* Reactive UI without subscriptions
* Clean separation of state, logic, and presentation
* Minimal but scalable architecture
* Developer-friendly patterns with strong typing

---

## ✨ Features

* Add, edit and delete transactions
* Real-time balance calculation (income / expenses)
* Filter and sort transactions dynamically
* Persistent state via LocalStorage
* Slide-in Drawer UI for seamless editing
* Fully reactive state powered by Signals

---

## 🏗️ Architecture

### State Management

The application uses **NgRx SignalStore** for state handling:

* `transactions` → core data source
* `filter` → UI state (query + sort order)
* `computed signals`:

  * `summary` → derived financial overview
  * `filteredTransactions` → UI-ready data

All state updates are handled via **immutable updates (`patchState`)**, ensuring predictability and traceability.

---

### Reactive Design

* No manual subscriptions
* UI reacts automatically via Signals
* Derived state handled with `computed()`
* Side effects (LocalStorage sync) handled via `effect()`

---

### Persistence Layer

State is automatically synchronized with **LocalStorage**, ensuring:

* Data persistence across reloads
* Instant restoration on app startup
* Lightweight, backend-free storage solution

---

## 🧩 Tech Stack

* **Angular (Standalone Components)**
* **Angular Signals**
* **@ngrx/signals (SignalStore)**
* **TypeScript (strict typing)**
* **SCSS (custom UI styling)**

---

## 🎨 UI / UX Highlights

* Floating Action Button (FAB) for primary actions
* Slide-in Drawer for creating/editing transactions
* Clean, minimal layout with responsive spacing
* Visual feedback for active filters and sorting
* Toast notifications for user feedback
* Smooth micro-interactions and transitions

---

## 🧪 Code Quality & Practices

* Strong TypeScript typing (Signals & Computeds)
* ESLint + Prettier for consistent code style
* Clear separation of concerns
* Reusable and composable UI components

---

## ⚡ Getting Started

```bash
npm install
npm start
```

App runs on:

```
http://localhost:4200
```

---

## 📌 Key Takeaways

This project demonstrates how Angular Signals can:

* Simplify state management
* Reduce boilerplate compared to RxJS-heavy approaches
* Improve developer experience and readability
* Enable highly reactive UIs with minimal complexity

---

## 📄 License

MIT
