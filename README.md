# HSC Study Desk · 2027

A lightweight workspace for planning HSC study, tracking school assessments and Trials, and practising weak topics. The Year 12 starter checklists cover Mathematics Extension 1 and 2, Physics, Chemistry, Economics and English Advanced.

## Run locally

Requires Node.js 20 or later and Bash. There are no packages to install.

```sh
npm run dev
```

Open http://localhost:3000. Local preview uses an in-memory database that resets when the dev server stops.

## Build and validate

```sh
npm run build
npm run validate
```

The build generates `dist/server/index.js`. The hosted application expects a D1 binding called `DB`, the schema in `drizzle/`, and a trusted sign-in gateway that supplies the authenticated user ID. Keep the Worker behind that gateway. For a separate ChatGPT Site, set its project ID in `.openai/hosting.json` before packaging.

This repository contains application source and syllabus starter prompts. Personal study records are stored by the deployed application.
