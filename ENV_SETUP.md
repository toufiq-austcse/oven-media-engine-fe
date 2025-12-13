# Environment Variables

This project uses environment variables to configure API endpoints and authentication tokens.

## Setup

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual values:
   ```env
   # API Configuration
   VITE_API_BASE_URL=http://your-server-ip:3333
   VITE_API_PORT=8081
   VITE_WHIP_ENDPOINT=http://your-server-ip:3333/app/stream?direction=whip
   VITE_RTMP_ENDPOINT=rtmp://your-server-ip:1935/app/stream

   # Authentication
   VITE_AUTH_TOKEN=Basic your-base64-encoded-token-here
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for the OvenMediaEngine API | `http://188.166.217.2:3333` |
| `VITE_API_PORT` | Port for the OvenMediaEngine API (for RTMP push) | `8081` |
| `VITE_WHIP_ENDPOINT` | WHIP endpoint URL for WebRTC streaming | `http://188.166.217.2:3333/app/stream?direction=whip` |
| `VITE_RTMP_ENDPOINT` | RTMP endpoint URL for pushing streams | `rtmp://188.166.217.2:1935/app/stream` |
| `VITE_AUTH_TOKEN` | Authentication token (Basic or Bearer) | `Basic b21lLWFjY2Vzcy10b2tlbg==` |

## Important Notes

- The `.env` file is ignored by git to prevent committing sensitive data
- All Vite environment variables must be prefixed with `VITE_` to be exposed to the client
- Never commit the `.env` file to version control
- Update `.env.example` when adding new environment variables

## Development

After updating the `.env` file, restart the development server for changes to take effect:

```bash
pnpm dev
```

