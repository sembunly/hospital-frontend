# Hospital Frontend

React and Vite frontend for the Hospital Laravel Microservices project. It provides staff authentication, protected routing, and a responsive hospital dashboard.

## Features

- Login through the Laravel authentication service
- Token-based protected dashboard route
- Responsive sidebar with collapsible menu groups
- Logged-in staff profile display
- Logout through the existing authentication API
- Custom React and CSS interface without an admin template

## Requirements

- Node.js 18 or newer
- npm
- The hospital Laravel microservices running locally

## Backend services

| Service | API URL |
| --- | --- |
| Authentication | `http://127.0.0.1:8001/api` |
| Patient | `http://127.0.0.1:8081/api` |
| OPD | `http://127.0.0.1:8003/api` |
| Doctor consultation | `http://127.0.0.1:8004/api` |

## Local development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Vite prints the local application URL in the terminal, normally `http://localhost:5173`.

## Available commands

```bash
npm run dev      # Start the development server
npm run lint     # Check JavaScript and React code
npm run build    # Create a production build
npm run preview  # Preview the production build
```

## Application routes

| Route | Access |
| --- | --- |
| `/login` | Public |
| `/dashboard` | Requires a token in local storage |
| `/patients/register` | Register a patient |
| `/patients` | List, edit, and delete patients |
| `/patients/search` | Search patients |

## Project structure

```text
Hospital-frontend/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Repository hygiene

The repository excludes installed dependencies, generated production builds, local environment files, logs, editor settings, and operating system metadata. Keep `package-lock.json` committed so installations remain reproducible.
