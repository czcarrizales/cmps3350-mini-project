# CMPS 3350 Mini Project - Calculator

A calculator web application built with a React/TypeScript frontend and a Python/Flask backend.

---

## Before You Start

### Keep Your Branch Up to Date

Before beginning new work, make sure your branch includes the latest changes from `main`.

If you are already working on your own branch:

```bash
git pull origin main
```

This brings the latest changes from `main` into your current branch while preserving the work already on your branch.

It is recommended to update your branch:

- Before starting a new work session
- After major changes are merged into `main`
- Before opening a Pull Request
- Whenever GitHub shows that your branch is behind `main`

Keeping your branch current helps reduce merge conflicts and prevents you from developing against outdated code.

---

# Quick Start

If you have already completed the **First-Time Setup**, use these instructions whenever you want to run the project.

The frontend and backend run separately, so you will need **two terminals**.

```text
Terminal 1 → Flask backend
Terminal 2 → React frontend
```

## Run the Backend

### Windows - PowerShell

From the project root:

```powershell
.\.venv\Scripts\Activate.ps1
python -m backend.app
```

### macOS

From the project root:

```bash
source .venv/bin/activate
python -m backend.app
```

The backend should run at:

```text
http://127.0.0.1:5000
```

Keep this terminal open while using the application.

---

## Run the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm run dev
```

Vite will display the local frontend address, usually:

```text
http://localhost:5173
```

Open that address in your browser.

> Both the frontend and backend must be running for the calculator to work correctly.

---

# First-Time Setup

Only follow this section when setting up the project on a computer for the first time.

## 1. Install the Required Software

Make sure the following are installed:

- Git
- Python 3
- Node.js
- npm

Check your installations with:

```bash
git --version
node --version
npm --version
```

### Windows

```powershell
py --version
```

### macOS

```bash
python3 --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/czcarrizales/cmps3350-mini-project.git
cd cmps3350-mini-project
```

---

## 3. Set Up the Backend

The Python virtual environment will be stored in the project root as:

```text
.venv/
```

You only need to create the virtual environment once.

### Windows - PowerShell

From the project root:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

Then start the backend:

```powershell
python -m backend.app
```

---

### macOS

From the project root:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements.txt
```

Then start the backend:

```bash
python -m backend.app
```

The backend should be available at:

```text
http://127.0.0.1:5000
```

> You do **not** need to run `python -m venv .venv` every time.
>
> After the first setup, simply activate the existing virtual environment before running the backend.

---

## 4. Set Up the Frontend

Open another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

`npm install` installs the frontend dependencies listed in `package.json`.

You normally only need to run it:

- During the first setup
- When frontend dependencies have changed

After setup, starting the frontend only requires:

```bash
cd frontend
npm run dev
```

---

# Git Reference

## Check Your Current Status

```bash
git status
```

Shows:

- Your current branch
- Modified files
- Staged files
- Untracked files

This is a good command to run whenever you are unsure what Git is currently tracking.

---

## View Your Branches

```bash
git branch
```

The branch with `*` next to it is your current branch.

---

## Switch Branches

```bash
git switch branch-name
```

Example:

```bash
git switch solo
```

---

## Create a New Branch

Before creating a branch, make sure `main` is current:

```bash
git switch main
git pull
```

Then create and switch to your new branch:

```bash
git switch -c branch-name
```

Example:

```bash
git switch -c calculator-history
```

---

## Update Your Current Branch

```bash
git pull
```

A normal `git pull` updates your current branch from its corresponding branch on GitHub.

For example, if you are on:

```text
solo
```

then `git pull` will normally update:

```text
origin/solo → solo
```

---

## Bring the Latest `main` Into Your Branch

While you are on your own branch:

```bash
git pull origin main
```

For example, if you are on `solo`:

```text
origin/main
     ↓
   solo
```

This does **not** merge your branch into `main`.

It updates your branch with the latest work that has already been added to `main`.

Use this regularly so your branch does not become significantly outdated.

---

## Download Remote Changes Without Modifying Your Branch

```bash
git fetch origin
```

`git fetch` downloads information about new commits and branches from GitHub, but it does **not** automatically change your current files.

This is useful when you want to check what has changed remotely before merging anything.

---

## See Your Changes

```bash
git diff
```

Shows changes you have made but have not yet staged.

---

## Stage Your Changes

Stage everything you changed:

```bash
git add .
```

Or stage one specific file:

```bash
git add filename
```

---

## Commit Your Changes

```bash
git commit -m "Describe what you changed"
```

Use a short message that clearly describes the work in the commit.

Example:

```bash
git commit -m "Add calculator history display"
```

---

## Push Your Changes

```bash
git push
```

If this is the first time pushing a new branch:

```bash
git push -u origin branch-name
```

Example:

```bash
git push -u origin calculator-history
```

After that, regular `git push` is enough.

---

## Typical Work Session

A normal work session may look like this:

```bash
git switch your-branch
git pull
git pull origin main
```

Then work on your code.

When you are ready to save and upload your changes:

```bash
git status
git add .
git commit -m "Describe your changes"
git push
```

---

## Merge Conflicts

If Git reports a merge conflict, it means both branches changed the same part of a file and Git cannot safely decide which version should be used.

Resolve the conflicting sections in the affected files, then:

```bash
git add .
git commit
git push
```

If GitHub says:

```text
These conflicts are too complex to resolve in the web editor
```

resolve the conflict locally in VS Code instead.

---

# Project Structure

```text
cmps3350-mini-project/
├── backend/
│   ├── app.py
│   ├── calculations.py
│   ├── parser.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── ...
│
├── .venv/
└── README.md
```

### Backend

The backend uses Python and Flask to process calculator expressions and return results to the frontend.

### Frontend

The frontend uses React, TypeScript, and Vite to provide the calculator interface.

---

# Project Requirements

## Core Requirements

- Addition
- Subtraction
- Multiplication
- Division
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

The team communicates through Discord and uses the GitHub Project board to track tasks and progress.
