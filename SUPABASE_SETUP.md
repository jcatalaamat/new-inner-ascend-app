# Supabase Local Development Setup

This document explains how to run multiple Supabase instances locally without port conflicts.

## Configuration

This project uses **custom ports and project ID** to prevent conflicts with other Supabase projects.

### Project Settings

- **Project ID**: `inner-ascend-app`
- **API Port**: `54421` (instead of default `54321`)
- **DB Port**: `54422` (instead of default `54322`)
- **Studio Port**: `54423` (instead of default `54323`)
- **Inbucket Port**: `54424` (instead of default `54324`)
- **Analytics Port**: `54427` (instead of default `54327`)

### Configuration Files

The custom ports are configured in:

1. **[supabase/config.toml](supabase/config.toml)** - Main Supabase configuration
   - `project_id = "inner-ascend-app"` (line 3)
   - All port configurations

2. **[.env.example](.env.example)** - Environment variables template
   - `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54421`
   - `EXPO_PUBLIC_SUPABASE_URL=http://localhost:54421`

## Running Multiple Projects

When you have multiple Supabase projects on the same machine, each needs:

1. **Unique project_id** in `supabase/config.toml`
2. **Unique port numbers** for all services
3. **Updated environment variables** pointing to the correct ports

### Example Port Scheme

For multiple projects, use port ranges:

| Project | API Port | DB Port | Studio Port |
|---------|----------|---------|-------------|
| inner-ascend-app | 54421 | 54422 | 54423 |
| project-2 | 54521 | 54522 | 54523 |
| project-3 | 54621 | 54622 | 54623 |

## Docker Container Names

With the custom `project_id`, Docker containers are named uniquely:

```
supabase_db_inner-ascend-app
supabase_auth_inner-ascend-app
supabase_kong_inner-ascend-app
supabase_storage_inner-ascend-app
...
```

This prevents container name conflicts between projects.

## Commands

### Start Supabase
```bash
npx supabase start
```

### Stop Supabase
```bash
npx supabase stop
```

### Stop a Specific Project (if you have multiple)
```bash
npx supabase stop --project-id inner-ascend-app
```

### Check Status
```bash
npx supabase status
```

### Reset Database (apply migrations)
```bash
npx supabase db reset
```

## Access URLs

When running:

- **API**: http://127.0.0.1:54421
- **Database**: postgresql://postgres:postgres@127.0.0.1:54422/postgres
- **Studio**: http://127.0.0.1:54423
- **Mailpit (email testing)**: http://127.0.0.1:54424

## Setting Up a New Project

To configure a new project to avoid conflicts:

1. **Edit `supabase/config.toml`**:
   ```toml
   project_id = "your-project-name"

   [api]
   port = 54521  # Choose unique port range

   [db]
   port = 54522

   [studio]
   port = 54523

   [inbucket]
   port = 54524
   # ... etc
   ```

2. **Update `.env.example` and `.env`**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54521
   EXPO_PUBLIC_SUPABASE_URL=http://localhost:54521
   ```

3. **Update OAuth redirect URIs** in `supabase/config.toml`:
   ```toml
   redirect_uri = "http://127.0.0.1:54521/auth/v1/callback"
   ```

## Troubleshooting

### Port Already in Use

If you see `port is already allocated`:

1. Check what's running:
   ```bash
   docker ps | grep supabase
   ```

2. Stop the conflicting project:
   ```bash
   npx supabase stop --project-id <old-project-id>
   ```

3. If containers are orphaned:
   ```bash
   docker stop $(docker ps -q --filter "name=supabase")
   ```

### Reset Everything

To completely reset (will lose local data):

```bash
npx supabase stop
docker volume prune
npx supabase start
```

## Important Notes

- **Never commit `.env`** - it contains secrets
- **`.env.example`** should only have placeholder values
- Each developer can run their own local Supabase instance
- Local data is stored in Docker volumes labeled with the project_id
- Port configurations must match across all config files
