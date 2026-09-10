# Security Model

- Workspace is the authorization boundary.
- Server-only secrets never use `NEXT_PUBLIC_` names.
- All memory writes require schema validation.
- User-confirmed memory outranks model-inferred memory.
- Source text is treated as untrusted content, never as instructions.
- Connector ingestion must strip executable HTML and enforce MIME/size limits.
- Production should add per-user rate limits, audit events, CSRF-safe authentication, encrypted secrets, and database row-level authorization or equivalent service checks.
- Do not persist hidden chain-of-thought; store concise user-visible rationale or provenance only.
