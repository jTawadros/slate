# Slate

> Stop drowning in text.  
> Paste your notes (or that monster email thread) → get a tight summary in two clicks.

**Live demo:** <https://www.slateworks.app>

---

## What It Does (right now)

* **Summarizer** – feeds your text to the backend (FastAPI + OpenAI) and sends back something you can actually read.
* **Auth** – email + password via Firebase.  
  * Change display name / email / password from the account panel.  
  * Upload an avatar – old file is deleted from Storage so we’re not hoarding junk.
* **Guest guard** – visitors are capped at **150 words** per request. Logged-in users aren’t capped yet.
* **Clean UI** – React + Tailwind, dark by default, animated blob so it doesn’t look 1999.

---

## Tech Stack

| Layer     | Stuff I used |
|-----------|--------------|
| Front-end | React 19 · Vite 6 · Tailwind 3 |
| Auth / DB | Firebase (Auth, Firestore, Storage) |
| Summaries | FastAPI + OpenAI (private repo, lives in `backend/`) |
| Deploy    | Railway (Docker) |

No secrets live in this repo – they’re injected as Railway env vars.
