# Installation and Testing Guide

This guide will walk you through installing and testing the SurrealDB Docker Extension locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop 4.8.0 or later**
  - Download from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
  - Ensure Extensions are enabled in Docker Desktop settings
  
- **Node.js 18 or later** (for development)
  - Download from [https://nodejs.org/](https://nodejs.org/)
  
- **Git**
  - Download from [https://git-scm.com/](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ajeetraina/surrealdb-docker-extension.git
cd surrealdb-docker-extension
```

### 2. Build the Extension

```bash
# Using Make (recommended)
make build

# Or using Docker directly
docker build -t raveendiranrr/surrealdb-docker-extension:latest .
```

This will:
- Install all frontend dependencies
- Build the React application
- Create the extension Docker image

### 3. Install the Extension

```bash
# Using Make
make install

# Or using Docker directly
docker extension install raveendiranrr/surrealdb-docker-extension:latest
```

### 4. Verify Installation

1. Open Docker Desktop
2. Click on **Extensions** in the left sidebar
3. You should see **SurrealDB** in the list
4. Click on it to open the extension

## Testing the Extension

### Test 1: Start SurrealDB

1. In the extension, navigate to the **Database Manager** tab
2. Click the **Start** button
3. Wait for the status to change to "CONNECTED" (green)
4. Verify you see the container information

**Expected Result**: SurrealDB container starts successfully and shows connected status.

### Test 2: Execute Queries

1. Navigate to the **Query Editor** tab
2. Try one of the example queries:
   ```sql
   CREATE users SET name = "Test User", age = 25;
   ```
3. Click **Execute Query**
4. Verify you see query results

**Expected Result**: Query executes and returns results in JSON format.

### Test 3: Explore Data

1. Navigate to the **Data Explorer** tab
2. Click on a table in the left sidebar
3. Verify data is displayed in the table view

**Expected Result**: Table data is displayed in an organized format.

### Test 4: Update Settings

1. Navigate to the **Settings** tab
2. Modify any connection parameter
3. Click **Save Settings**
4. Verify success message appears

**Expected Result**: Settings are saved successfully.

### Test 5: Stop SurrealDB

1. Return to the **Database Manager** tab
2. Click the **Stop** button
3. Verify status changes to "DISCONNECTED"

**Expected Result**: SurrealDB container stops successfully.

## Development Mode

For active development with hot reload:

### 1. Start the UI Development Server

```bash
cd ui
npm install
npm run dev
```

This starts Vite dev server on http://localhost:3000

### 2. Enable Extension Dev Mode

In another terminal:

```bash
# Using Make
make dev

# Or manually
docker extension dev debug raveendiranrr/surrealdb-docker-extension
docker extension dev ui-source raveendiranrr/surrealdb-docker-extension http://localhost:3000
```

### 3. Make Changes

Now you can edit files in `ui/src/` and see changes immediately in Docker Desktop without rebuilding.

## Troubleshooting

### Build Fails

**Issue**: `docker build` fails with errors

**Solutions**:
- Ensure Docker Desktop is running
- Check you have enough disk space
- Try cleaning Docker: `docker system prune`

### Extension Won't Install

**Issue**: `docker extension install` fails

**Solutions**:
- Remove any existing version: `docker extension rm raveendiranrr/surrealdb-docker-extension`
- Restart Docker Desktop
- Check Docker Desktop Extensions are enabled in Settings → Extensions

### Port 8000 Already in Use

**Issue**: SurrealDB won't start due to port conflict

**Solutions**:
- Stop any service using port 8000
- Or modify `docker-compose.yaml` to use a different port:
  ```yaml
  ports:
    - "8000:8000"  # Change 8001 to any available port
  ```

### UI Not Loading

**Issue**: Extension installs but UI doesn't appear

**Solutions**:
- Check browser console for errors
- Verify the build completed successfully
- Try reinstalling: `make update`

### Dev Mode Not Working

**Issue**: Changes not reflected in dev mode

**Solutions**:
- Ensure Vite dev server is running on port 3000
- Check Docker can access localhost:3000
- Restart the dev server and try again

## Updating the Extension

After making changes:

```bash
# Rebuild and update
make update

# Or manually
docker build -t raveendiranrr/surrealdb-docker-extension:latest .
docker extension update raveendiranrr/surrealdb-docker-extension:latest
```

## Uninstalling

To remove the extension:

```bash
# Using Make
make remove

# Or using Docker directly
docker extension rm raveendiranrr/surrealdb-docker-extension
```

## Testing Checklist

Use this checklist to verify all features work:

- [ ] Extension installs without errors
- [ ] Extension appears in Docker Desktop Extensions list
- [ ] Can start SurrealDB container
- [ ] Status indicator shows "CONNECTED" when running
- [ ] Can execute SurrealQL queries
- [ ] Query results display correctly
- [ ] Can browse tables in Data Explorer
- [ ] Can view table data
- [ ] Can save settings
- [ ] Can stop SurrealDB container
- [ ] Can restart SurrealDB container

## Next Steps

Once testing is complete:

1. **Report Issues**: If you find bugs, create an issue on GitHub
2. **Submit PR**: If you've made improvements, submit a pull request
3. **Share Feedback**: Let us know what features you'd like to see

## Additional Commands

```bash
# Validate the extension
make validate

# View extension logs
make logs

# Clean build artifacts
make clean

# View all available commands
make help
```

## Getting Help

If you encounter issues:

1. Check the [README](README.md) for general information
2. Review the [GitHub Issues](https://github.com/Raveendiran-RR/surrealdb-docker-extension/issues)
3. Create a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Docker Desktop version
   - OS and version
   - Extension version

## Contributing

See [README.md](README.md) for contribution guidelines.
