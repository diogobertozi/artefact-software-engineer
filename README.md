# Task Manager

A small Next.js 15 and tRPC app for the Artefact Software Engineer written case. Create, list, edit and delete tasks. The app starts with an empty list.

## Run locally

Use Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). No environment variables, credentials or external services are needed.

## How it works

- The home route renders on each request and calls the tRPC list procedure on the server. The initial HTML includes the current tasks.
- React forms use the typed tRPC HTTP client for mutations. The list refreshes after a delete. The UI reports success, errors and pending operations.
- Tasks have a UUID, a required title, an optional description and a UTC creation timestamp. Updates preserve the ID and timestamp.
- Zod checks inputs on the server. Missing tasks return `NOT_FOUND`. Whitespace-only titles return `BAD_REQUEST`.
- The Node process keeps tasks in a `Map`. Its memory clears on restart and differs across instances. This local demo has one shared list. A deployed multi-user version would require a shared store and per-task authorization.

## Verify

```sh
npm run build
npm run typecheck
npm start
```

With the production server running, open another terminal in this directory and run `npm test`. The integration test exercises CRUD through HTTP, checks that a newly created task appears in the server-rendered HTML, and verifies invalid titles and missing-task errors. Set `TEST_APP_URL` if the server uses a different port.
