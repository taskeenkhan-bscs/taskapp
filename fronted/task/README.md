# Task Management System

## Run the desktop app in VS Code

From the repository root:

```bash
npm run dev
```

This starts Vite, launches the Electron window, and starts the backend on
`http://localhost:3000` automatically.

## Build the installer

```bash
npm run build
```

The Windows installer is written to `fronted/task/release`.

The development frontend uses the local backend. Production builds use the
configured deployed backend from `.env.production`.
