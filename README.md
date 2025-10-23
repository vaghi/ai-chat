## AI Chat — Portfolio Project

An AI-powered chat application built with React, TypeScript, and Vite on the frontend, and a lightweight Express server on the backend. The backend proxies requests to the Groq API, augmenting prompts with clear system directions and a curated curriculum vitae to provide context-aware answers.

### Demo Goals

- Showcase frontend engineering (UI/UX, state, modular components)
- Demonstrate full-stack integration and API design
- Use a real LLM provider (Groq) with a clean prompt engineering approach

---

## Tech Stack

### Frontend

- React 19, TypeScript
- Vite 7
- SCSS Modules
- Component-driven structure with hooks

### Backend

- Node.js (ESM) + Express
- Groq OpenAI-compatible Chat Completions API
- dotenv, cors

### Tooling

- ESLint (TypeScript config)
- Concurrent dev runner via `concurrently`

---

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Create `.env.local` in the project root with your Groq API key:

```bash
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 3) Run development servers

Run frontend and backend together:

```bash
npm start
# or
npm run dev:full
```

Notes: Vite requires Node.js version 20.19+ or 22.12+ to run

Run only backend:

```bash
npm run dev:backend
# server at http://localhost:3001
```

Run only frontend:

```bash
npm run dev
# Vite at http://localhost:5173
```

---

## API

Backend base URL: `http://localhost:3001`

### POST `/api/chat`

Request:

```json
{
  "prompt": "Your question for the AI"
}
```

Response:

```json
{
  "reply": "Model-generated response",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

Notes:

- The server sends three messages to Groq:
  - `system`: Directions (`BASE_PROMPT_DIRECTIONS`)
  - `system`: Curriculum JSON as text
  - `user`: Your prompt
- Model used: `llama-3.1-8b-instant`

---

## Frontend Integration

The chat UI uses a small network layer and a chat hook to manage state.

Key pieces:

- `src/network/api.ts`: Minimal API client with error handling
- `src/network/chat.service.ts`: Chat-specific endpoint wrapper
- `src/hooks/use-chat-history.ts`: Manages chat history, loading and error state, and calls the service

Example usage (hook):

```ts
const { chatHistory, isLoading, error, sendMessage } = useChatHistory();
await sendMessage("Tell me about my experience with React Native");
```

---

## Scripts

```json
{
  "dev": "vite", // frontend only
  "dev:backend": "node server/index.js", // backend only
  "dev:full": "concurrently --kill-others --prefix \"[{name}]\" --names \"backend,frontend\" \"npm run dev:backend\" \"npm run dev\"",
  "start": "npm run dev:full",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

---

## Development Notes

- This project follows a modular structure with clear separation of concerns.
- Prompts are structured to maximize relevance and clarity for the LLM.
- The chat input is controlled and auto-scrolls on new messages.
- Error and loading states are handled gracefully in the UI.

---

## License

This repository is part of a personal portfolio. Feel free to explore and reference code; please contact the author for reuse beyond evaluation or interview purposes.

---

## TODO

- Add tests
- Switch dark/light mode
- Persist on local storage with reset button
- Add en/es lang with i18n

---

## Author

**Agustín Vaghi** — Senior Full Stack Developer

- LinkedIn: https://www.linkedin.com/in/agustin-vaghi/
- Email: vaghi.agustin@gmail.com
