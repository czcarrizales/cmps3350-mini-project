# CMPS 3350 Mini Project - Calculator

A calculator web application built with a React/TypeScript frontend and a Python/Flask backend.

## Project Structure

```text
cmps3350-mini-project/
├── backend/
│   ├── app.py
│   ├── calculations.py
│   └── parser.py
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── requirements.txt
└── README.md
```

- `backend/` - Flask API and calculator/parser logic
- `frontend/` - React + TypeScript + Vite user interface
- `requirements.txt` - Python dependencies

---

# Running the Project

The frontend and backend run separately.

**You need TWO terminals open while developing:**

```text
Terminal 1 → Flask backend
Terminal 2 → React frontend
```

Both must be running for the full calculator to work.

---

## Prerequisites

Make sure you have these installed:

- Git
- Python 3
- Node.js and npm

You can check with:

```bash
git --version
python --version
node --version
npm --version
```

On macOS, Python may need to be checked with:

```bash
python3 --version
```

---

# First-Time Setup

## 1. Clone the Repository

```bash
git clone https://github.com/czcarrizales/cmps3350-mini-project.git
cd cmps3350-mini-project
```

---

## 2. Set Up the Backend

The Python virtual environment should be created in the **root project folder**.

### Windows - PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m backend.app
```

### macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m backend.app
```

The backend should start at:

```text
http://127.0.0.1:5000
```

Opening that address in your browser should show a message indicating that the calculator backend is running.

> Run the backend from the **root project directory** using `python -m backend.app`.
>
> Do not `cd backend` and run `python app.py`, because the backend imports modules using the `backend` package path.

Leave this terminal running.

---

## 3. Set Up the Frontend

Open a **second terminal** in the project root.

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local frontend address in the terminal, usually:

```text
http://localhost:5173
```

Open that address in your browser.

Keep the backend terminal running at the same time.

---

# Starting the Project Later

You only need to install the dependencies the first time.

After that, starting the project is much shorter.

## Terminal 1 - Backend

### Windows

```powershell
.\.venv\Scripts\Activate.ps1
python -m backend.app
```

### macOS

```bash
source .venv/bin/activate
python -m backend.app
```

## Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

---

# Git Workflow

## Important: Keep Your Branch Updated With `main`

Do **not** work for days on a branch that has not received recent changes from `main`.

As other people's code gets merged into `main`, your branch becomes older.

Regularly bring the newest `main` into your branch.

### Recommended Workflow

Suppose your branch is called:

```text
solo
```

Switch to your branch:

```bash
git switch solo
```

Download the latest information from GitHub:

```bash
git fetch origin
```

Then merge the newest remote `main` into your current branch:

```bash
git merge origin/main
```

This means:

```text
origin/main
     ↓
   solo
```

Your work on `solo` is **not erased**.

Git combines the changes from `main` with the changes already on your branch.

If the same code was changed in both places, Git may ask you to resolve a merge conflict.

### Do This Regularly

Especially:

- before starting a large amount of work
- after major changes have been merged into `main`
- before opening a pull request
- when GitHub says your branch is behind `main`

---

# Creating a New Branch

Before creating a new branch, make sure your local `main` is current:

```bash
git switch main
git pull origin main
```

Then create your branch:

```bash
git switch -c your-branch-name
```

Because you created it from the updated `main`, the new branch starts with the newest project code.

---

# Saving and Pushing Your Work

Check what changed:

```bash
git status
```

Stage your changes:

```bash
git add .
```

Commit them:

```bash
git commit -m "Describe what you changed"
```

Push the branch:

```bash
git push
```

If this is the first time pushing a new branch:

```bash
git push -u origin your-branch-name
```

After that, regular `git push` is enough.

---

# Git Cheat Sheet

| Command | What It Does |
|---|---|
| `git status` | Shows your current branch and changed/staged files |
| `git diff` | Shows changes you have made but have not staged |
| `git branch` | Shows your local branches |
| `git switch branch-name` | Switches to another branch |
| `git switch -c branch-name` | Creates a new branch and switches to it |
| `git fetch origin` | Downloads information about the newest remote commits **without changing your files** |
| `git pull` | Fetches and integrates the configured remote branch into your current branch |
| `git pull origin main` | Fetches `main` and integrates it into whichever branch you are currently on |
| `git merge origin/main` | Merges the latest fetched remote `main` into your current branch |
| `git add .` | Stages your current changes |
| `git commit -m "message"` | Saves the staged changes as a Git commit |
| `git push` | Uploads your commits to GitHub |
| `git log --oneline` | Shows recent commits in a compact format |

## `git fetch` vs `git pull`

This distinction is important.

```bash
git fetch origin
```

means:

> "GitHub, tell me about the newest commits."

It **does not change your current branch**.

Meanwhile:

```bash
git pull
```

roughly means:

```text
fetch + integrate
```

But a plain `git pull` normally updates your current branch from its configured remote branch.

For example, if you are on:

```text
solo
```

then:

```bash
git pull
```

will normally update `solo` from `origin/solo`.

It does **not automatically bring `main` into `solo`**.

That is why this is the clearest way to update your branch from `main`:

```bash
git fetch origin
git merge origin/main
```

---

# Merge Conflicts

A merge conflict means Git found changes in both branches that it cannot safely combine automatically.

For example:

```bash
git switch solo
git fetch origin
git merge origin/main
```

may report a conflict.

Open the conflicted files and resolve the conflicting sections.

Then:

```bash
git add .
git commit
git push
```

If GitHub says:

```text
These conflicts are too complex to resolve in the web editor
```

resolve the merge locally instead using the commands above.

---

# Branch Direction Matters

If you are currently on `solo` and run:

```bash
git merge origin/main
```

you are doing:

```text
main → solo
```

You are **not** putting `solo` into `main`.

Your feature branch should normally be merged into `main` through a Pull Request:

```text
solo → Pull Request → main
```

A good team workflow is therefore:

```text
main → your branch     regularly while working

your branch → main     when the work is finished/reviewed
```

---

# Troubleshooting

## Frontend Loads but Calculations Do Not Work

Make sure the Flask backend is also running:

```text
http://127.0.0.1:5000
```

The frontend communicates with the backend on port `5000`.

## `ModuleNotFoundError: No module named 'backend'`

Make sure you are in the repository root and start Flask with:

```bash
python -m backend.app
```

not from inside the `backend` folder.

## `npm` Is Not Recognized

Install Node.js, then reopen your terminal.

## Frontend Dependencies Changed

If somebody changes `package.json` or `package-lock.json`, run:

```bash
cd frontend
npm install
```

again after pulling the changes.

## Backend Dependencies Changed

After pulling changes, run:

```bash
python -m pip install -r requirements.txt
```

again if `requirements.txt` changed.

---

# Project Requirements

## Core Requirements

- Addition, subtraction, multiplication, and division
- Calculator UI/display
- Decimal input
- PEMDAS/operator precedence
- Parentheses
- Clear/reset
- Calculation history
- Results limited to 4 decimal places
- Error handling/input validation

## Stretch Goals

- Exponents
- Square root
- Modulo
- Factorial
- π and e
- Fractions
- Trigonometric functions
- Logarithms
- Scientific notation
- Themes
- Sound/visual effects
- Graphing
- Matrices/tables

---

# Team Coordination

We communicate through Discord and use the GitHub Project board to track tasks and progress.
