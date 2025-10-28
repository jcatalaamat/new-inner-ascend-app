# Setting Up Supabase for a New Project

This guide explains how to set up local Supabase in a new project when you already have another project (like inner-ascend-app) configured.

## Important: One Supabase Instance at a Time

**You can only run ONE local Supabase instance at a time** because all projects use the same host ports (54321, 54322, 54323, 54324).

Before starting Supabase in your new project, you MUST stop the currently running instance.

## Step-by-Step Setup

### 1. Stop the Currently Running Supabase

In your current project (inner-ascend-app):

```bash
cd /path/to/inner-ascend-app
npx supabase stop
```

This stops all Supabase Docker containers and saves your data to Docker volumes.

### 2. Initialize Supabase in Your New Project

```bash
cd /path/to/your-new-project
npx supabase init
```

This creates a `supabase/` directory with:
- `config.toml` - Supabase configuration
- `migrations/` - Database migration files
- Other setup files

### 3. Configure a Unique Project ID

**This is the critical step!**

Edit `supabase/config.toml` and change the `project_id`:

```toml
# A string used to distinguish different Supabase projects on the same host. Defaults to the working
# directory name when running `supabase init`.
project_id = "your-new-project-name"  # ← Change this!
```

Example:
```toml
project_id = "my-awesome-app"
```

**Why this matters:**
- Creates unique Docker container names: `supabase_db_my-awesome-app`
- Isolates your data in separate Docker volumes
- Prevents conflicts with other projects

### 4. Keep Default Ports

**Do NOT change the port numbers in config.toml!**

Leave these as defaults:
```toml
[api]
port = 54321  # ← Leave as default

[db]
port = 54322  # ← Leave as default

[studio]
port = 54323  # ← Leave as default

[inbucket]
port = 54324  # ← Leave as default
```

The Supabase CLI doesn't support running multiple instances with different ports simultaneously.

### 5. Start Supabase

```bash
npx supabase start
```

This will:
- Download Docker images (if needed)
- Create Docker containers named with your project_id
- Initialize the database
- Start all Supabase services

### 6. Access Your Local Supabase

Once started, you'll see:

```
API URL: http://127.0.0.1:54321
Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Mailpit URL: http://127.0.0.1:54324
```

Open Studio in your browser: http://127.0.0.1:54323

## Switching Between Projects

### To switch from Project A to Project B:

```bash
# Stop Project A
cd /path/to/project-a
npx supabase stop

# Start Project B
cd /path/to/project-b
npx supabase start
```

### To switch back to Project A:

```bash
# Stop Project B
cd /path/to/project-b
npx supabase stop

# Start Project A
cd /path/to/project-a
npx supabase start
```

**Your data is preserved!** Each project's database is stored in Docker volumes labeled with the project_id.

## Quick Reference

### Check which Supabase is running:
```bash
docker ps | grep supabase
```

Look for container names like:
- `supabase_db_my-awesome-app`
- `supabase_db_inner-ascend-app`

### View all Supabase Docker volumes:
```bash
docker volume ls | grep supabase
```

### Stop Supabase without knowing the project:
```bash
npx supabase stop
```
(Run this in any project directory)

### Check Supabase status:
```bash
npx supabase status
```

## Common Issues

### "Port already in use" error

**Solution:** Another Supabase instance is running. Stop it first:

```bash
# Find which project is running
docker ps | grep supabase

# Stop it
npx supabase stop
```

### Database container is unhealthy

**Solution:** The data might be corrupted or incompatible. Delete volumes and restart:

```bash
npx supabase stop
docker volume rm $(docker volume ls --filter label=com.supabase.cli.project=your-project-name --format "{{.Name}}")
npx supabase start
```

⚠️ **Warning:** This deletes all local data for that project!

### Forgot to set unique project_id

**Solution:** Stop Supabase, edit config.toml, delete volumes, and restart:

```bash
npx supabase stop
# Edit supabase/config.toml - change project_id
docker volume ls | grep supabase  # Find the default volumes
docker volume rm supabase_db_supabase supabase_storage_supabase supabase_config_supabase
npx supabase start
```

## Environment Variables

Update your `.env` or `.env.local` file:

```bash
# Local Supabase URLs (same for all projects)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321

# Get these from: npx supabase status
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Run `npx supabase status` to get your local API keys.

## Summary Checklist

Before starting Supabase in a new project:

- [ ] Stop any running Supabase instance: `npx supabase stop`
- [ ] Initialize Supabase: `npx supabase init`
- [ ] Edit `supabase/config.toml` and set unique `project_id`
- [ ] Keep all ports as default (543xx)
- [ ] Start Supabase: `npx supabase start`
- [ ] Update your `.env` file with the local URLs and keys

That's it! Your new project now has its own isolated Supabase instance.
