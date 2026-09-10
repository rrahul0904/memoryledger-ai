# Technical Architecture

## Objective

Build a persistent AI workspace where conversational state is explicit, versioned, source-linked, and retrievable across long-running work.

## Components

### Web application
Next.js App Router. Server Components own the shell; interactive workspace surfaces are client components. Route handlers expose chat, memory, and health APIs.

### Memory engine
The memory engine is domain code independent of Next.js. It defines memory types, extraction operations, conflict handling, ranking, and context assembly.

### AI provider layer
A small adapter boundary isolates model APIs. The initial provider uses OpenAI; deterministic demo behavior remains available for development and CI.

### Persistence
PostgreSQL is the system of record. pgvector stores embeddings for semantic retrieval. Drizzle owns schema definitions and migrations.

## Request flow

1. User sends a message.
2. API loads active workspace memories and recent messages.
3. Retrieval ranks memories by type, lexical/semantic relevance, recency, and importance.
4. Context assembler constructs system instructions + relevant memories + recent chat + user request.
5. Model produces assistant response.
6. Extraction pass proposes typed memory operations.
7. Validator rejects malformed, low-confidence, or contradictory operations.
8. Accepted operations create a new memory or immutable memory version.
9. UI exposes the resulting ledger and provenance.

## Memory invariants

- One active canonical memory for a stable `(workspace, type, key)` tuple.
- Updates never destroy history; they append a version.
- Superseded memories remain queryable for audit history.
- Provenance should point to the originating message/document chunk.
- Model-generated memory cannot silently override user-confirmed memory.
- Sensitive connector data is scoped to workspace membership and never enters global memory by default.

## Scale path

Initial deployments use Postgres + pgvector. At higher scale, separate ingestion/extraction work into a queue, batch embeddings, use partitioning on messages/memory_versions, and move high-volume telemetry to an analytical store without changing the memory domain API.
