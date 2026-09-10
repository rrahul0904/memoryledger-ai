# API Contracts

## POST /api/chat

Request:
```json
{"workspaceId":"demo","message":"Move production hosting to Render"}
```

Response:
```json
{
  "message": {"role":"assistant","content":"..."},
  "memoryOperations": [{"operation":"SUPERSEDE","key":"deployment_provider","value":"Render"}],
  "context": {"memoryCount": 4, "demo": true}
}
```

## GET /api/memories?workspaceId=demo
Returns active memory records for the workspace.

## POST /api/memories
Creates a user-confirmed memory. Production implementations should authenticate membership before mutation.

## GET /api/health
Returns application health and execution mode.
