# SurrealDB Docker Extension

A Docker Desktop extension for managing SurrealDB databases with an intuitive UI.

<img width="1565" height="959" alt="image" src="https://github.com/user-attachments/assets/5aedf6df-146c-493e-8751-5d1705c4c81e" />



## Features

- 🚀 **Easy Database Management**: Start, stop, and restart SurrealDB instances with one click
- 📝 **Query Editor**: Write and execute SurrealQL queries with syntax highlighting
- 🔍 **Data Explorer**: Browse tables and view data in a clean, organized interface
- ⚙️ **Configurable Settings**: Customize connection parameters and preferences
- 🎨 **Modern UI**: Built with Material-UI for a polished user experience

## Extension Architecture 
```mermaid
graph TB
    A[Docker Desktop] --> B[SurrealDB Extension]
    B --> C[Database Manager]
    B --> D[Query Editor]
    B --> E[Data Explorer]
    B --> F[Settings Panel]
    
    C --> G[SurrealDB Container]
    D --> G
    E --> G
    
    G --> H[(SurrealDB Database)]
    
    style A fill:#2496ED,color:#fff
    style B fill:#FF00A0,color:#fff
    style G fill:#9945FF,color:#fff
    style H fill:#00D4AA,color:#fff
```

## Prerequisites

- Docker Desktop 4.55.0 or later
- Docker Engine 20.10.0 or later

## Installation

### From Docker Desktop Marketplace (Coming Soon)

1. Open Docker Desktop
2. Navigate to the Extensions marketplace
3. Search for "SurrealDB"
4. Click "Install"

### Manual Installation (Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/raveendiranrr/surrealdb-docker-extension.git
   cd surrealdb-docker-extension
   ```

2. Build the extension:
   ```bash
   docker build -t raveendiranrr/surrealdb-docker-extension:1.0.0 .
   ```

3. Install the extension:
   ```bash
   docker extension install raveendiranrr/surrealdb-docker-extension:1.0.0
   ```

## Usage

### Starting SurrealDB

1. Open Docker Desktop
2. Navigate to the Extensions section
3. Click on "SurrealDB"
4. Click on the surrealist tab and create a new connection
5. Choose http and type : http://localhost:8000 with username and password as root

### How the data flows :
```mermaid
sequenceDiagram
    participant User
    participant UI as React UI
    participant Docker as Docker SDK
    participant SurrealDB as SurrealDB Container
    participant DB as Database
    
    User->>UI: Click "Start Database"
    UI->>Docker: Execute docker-compose up
    Docker->>SurrealDB: Start container (port 8000)
    SurrealDB->>DB: Initialize database
    DB-->>SurrealDB: Ready
    SurrealDB-->>UI: Status: Running ✓
    UI-->>User: Show "Connected"
    
    User->>UI: Write query in editor
    UI->>SurrealDB: HTTP POST /sql
    SurrealDB->>DB: Execute SurrealQL
    DB-->>SurrealDB: Return results
    SurrealDB-->>UI: JSON response
    UI-->>User: Display formatted data
```

### Running Queries

1. Switch to the "Query Editor" tab
2. Write your SurrealQL query in the editor
3. Click "Execute Query"
4. View results in the results panel

Example queries:
```sql
-- Create a new user
CREATE users SET name = "John Doe", age = 30, email = "john@example.com";

-- Select all users
SELECT * FROM users;

-- Update a user
UPDATE users SET age = 31 WHERE name = "John Doe";

-- Delete a user
DELETE users WHERE name = "John Doe";
```

### Exploring Data

1. Navigate to the "Data Explorer" tab
2. Select a table from the left sidebar
3. View table data in the main panel

### Configuring Settings

1. Go to the "Settings" tab
2. Modify connection parameters as needed
3. Click "Save Settings"

```mermaid
sequenceDiagram
    participant User
    participant Settings as Settings Panel
    participant Storage as LocalStorage
    participant API as SurrealDB API
    participant DB as Database
    
    User->>Settings: Enter credentials
    Settings->>Storage: Save encrypted config
    
    User->>API: Execute query
    API->>Storage: Retrieve credentials
    Storage-->>API: root:root (Base64)
    API->>API: Add Authorization header
    API->>DB: Authenticated request
    
    alt Valid Credentials
        DB-->>API: Success + Data
        API-->>User: Display results
    else Invalid Credentials
        DB-->>API: 401 Unauthorized
        API-->>User: Show error + redirect to Settings
    end
```

## Default Configuration

The extension uses the following default settings:

- **Host**: localhost
- **Port**: 8000
- **Username**: root
- **Password**: root
- **Namespace**: test
- **Database**: test

## Development

### Project Structure

```
surrealdb-docker-extension/
├── Dockerfile                 # Extension container definition
├── metadata.json             # Extension metadata
├── docker-compose.yaml       # SurrealDB service definition
├── surrealdb.svg            # Extension icon
├── ui/                      # Frontend React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

### Building the Extension

```bash
# Build the extension
docker build -t ajeetraina/surrealdb-docker-extension:1.0.0 .

# Install for testing
docker extension install ajeetraina/surrealdb-docker-extension:1.0.0

# Update the extension
docker extension update ajeetraina/surrealdb-docker-extension:1.0.0

# Remove the extension
docker extension rm ajeetraina/surrealdb-docker-extension:1.0.0
```

### Local Development

For UI development with hot reload:

```bash
cd ui
npm install
npm run dev
```

Then use the Docker Extension CLI to enable dev mode:

```bash
docker extension dev debug raveendiranrr/surrealdb-docker-extension:1.0.0
docker extension dev ui-source raveendiranrr/surrealdb-docker-extension:1.0.0 http://localhost:3000
```




