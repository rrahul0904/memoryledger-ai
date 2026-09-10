# Project Plan

## Goal

Build MemoryLedger AI into a production-grade persistent AI workspace that remembers durable project state across long-running conversations and files while keeping every important memory inspectable and traceable.

## Product thesis

Traditional chat history is not enough for long-running work. The product should treat decisions, facts, requirements, constraints, and preferences as first-class state with provenance and version history.

## Milestones

### M0 — Foundation
- Monorepo and web shell
- Memory domain contracts
- AI provider abstraction
- Postgres/pgvector schema
- Demo mode
- Docker and CI
- Core documentation

### M1 — Persistent workspace
- Authentication
- Organizations/workspaces
- Conversation persistence
- Transactional memory repository
- Memory Inspector
- Version history
- Hybrid retrieval
- Streaming responses

### M2 — Evidence intelligence
- PDF/DOCX/text ingestion
- Chunking and embeddings
- Source citations
- Contradiction detection
- Confidence controls
- Memory approval workflows

### M3 — Integrations
- GitHub
- Google Drive
- Gmail
- Slack
- Connector sync jobs and permissions

### M4 — Commercial hardening
- Billing and quotas
- Model-cost accounting
- Admin console
- Security review
- Retention controls
- Load testing and SLOs

## Definition of done

A milestone is not complete until the code is implemented, tests pass, the main user path is verified end to end, documentation reflects reality, and known blockers are recorded with an owner and remediation.
