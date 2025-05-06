# Gabriel Studio — Developer Setup Guide

Welcome to the **Gabriel Studio** codebase!
This guide walks you through setting up the project locally with **Tailwind CSS**, **PostCSS**, and **npm**. Let's get your dev environment up and running!

---

## Prerequisites

Make sure you have the following installed:

* [Node.js & npm](https://nodejs.org/)
* A code editor (VS Code recommended)
* Terminal or command line access

---

## 1. Clone the Repository

```bash
git clone https://github.com/Shahnoor-26/Gabriel-Studio.git
cd Gabriel-Studio
```

---

## 2. Initialize npm

This step is already done in your `package.json`, so you can skip it unless you’re starting fresh.

---

## 3. Install Dev Dependencies

You already have the dependencies installed via `package.json`:

```json
"dependencies": {
  "@tailwindcss/cli": "^4.0.17",
  "tailwindcss": "^4.0.17"
}
```

To install them:

```bash
npm install
```

---

## 4. Generate Config Files

If not already present, generate Tailwind config files:

```bash
npx tailwindcss init -p
```

This adds:

* `tailwind.config.js`
* `postcss.config.js`

---

## 5. Configure Tailwind

Edit `tailwind.config.js` to include relevant file paths:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## 6. Create Tailwind CSS Entry File

Inside `src/`, create a file named `input.css` with the following content:

```css
@import "tailwindcss";
```

---

## 7. Start the Tailwind CLI

You're already set with a `dev` script in your `package.json`:

```json
"scripts": {
  "dev": "npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch"
}
```

Run it with:

```bash
npm run dev
```

Make sure your HTML files link to `src/output.css`:

```html
<link href="./src/output.css" rel="stylesheet">
```

---

## 8. Start a Live Server

Use the [Live Server extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or any static server to preview changes in real time.

---

## Done!

You’re ready to build and style with Tailwind in **Gabriel Studio**.

---

## Optional Tips

* Use `npm run` scripts to automate build processes.
* Add `dist/` or `src/output.css` to `.gitignore` if you don’t want to commit generated files.
* Extend the theme and add plugins in `tailwind.config.js` to customize your design.
