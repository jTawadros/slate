# Slate

**Live demo → [slateworks.app](https://www.slateworks.app)**  
No screenshots, no hype—just hit the link and play with it.

---

## What it does (today)

| Logged-in users | Guests |
|-----------------|--------|
| Unlimited words, unlimited summaries | 150-word limit, 5 summaries/day |

* Paste notes or email chains → get a clean AI summary (OpenAI under the hood).  
* Account panel: change display name, email, password, avatar (old avatar auto-deleted).  
* Clean, responsive UI — Tailwind + some animated flair so it doesn’t look 1999.  

---

## Stack

| Layer   | Stuff I used |
|---------|--------------|
| Frontend | React 19 · Vite 6 · Tailwind 3 |
| Auth / DB | Firebase (Auth, Firestore, Storage) |
| Summarizer | FastAPI + OpenAI (private repo, not in this tree) |
| Hosting | Railway (Docker) |

No secrets in this repo — they’re in Railway env vars.

---
