# MemoryLedger AI

MemoryLedger AI is a SkyOS-inspired persistent AI workspace built around one principle: important facts, decisions, constraints, and requirements should become durable, inspectable, versioned state instead of being repeatedly compressed into lossy summaries.

## What is implemented

- Next.js conversational workspace with a three-pane UI
- Streaming-ready chat API with a deterministic demo fallback
- Typed memory ledger (`fact`, `decision`, `requirement`, `constraint`, `preference`)
- Memory extraction operation contract (`ADD`, `UPDATE`, `SUPERSEDE`, `DELETE`, `IGNORE`)
- Relevance scoring and context assembly
- Conflict/supersession support and provenance fields
- PostgreSQL + pgvector Drizzle schema
- Model provider abstraction and OpenAI adapter
- Docker Compose development database
- Unit-test structure for memory behavior
- CI for typecheck, test, and build
- Architecture, API, security, product, project-plan, and implementation documentation

## Architecture

```text
Web UI -> /api/chat -> Context Assembler -> AI Provider
                      ^               |
                      |               v
                 Memory Retriever <- Memory Extractor
                      ^
                      |
             Postgres + pgvector
```

The app runs in **demo mode by default**, so it can be evaluated without database or AI credentials. When `MEMORYLEDGER_DEMO_MODE=false`, configure `DATABASE_URL` and `OPENAI_API_KEY`.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev -- --filter=@memoryledger/web
```

Open http://localhost:3000.

### With PostgreSQL

```bash
docker compose up -d
npm run db:push
```

## Production checklist

1. Set `MEMORYLEDGER_DEMO_MODE=false`.
2. Provision PostgreSQL with pgvector.
3. Set `DATABASE_URL`, `OPENAI_API_KEY`, and `SESSION_SECRET`.
4. Run migrations.
5. Configure authentication and billing provider adapters before public launch.
6. Enable rate limiting and observability at the deployment edge.

See [Technical Architecture](docs/ARCHITECTURE.md), [Project Plan](docs/PROJECT_PLAN.md), and [Implementation Plan](docs/IMPLEMENTATION_PLAN.md).
