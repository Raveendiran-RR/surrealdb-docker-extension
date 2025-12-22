#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║       Installing SurrealDB Extension                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if extension is already installed
if docker extension ls | grep -q "ajeetraina777/surrealdb-docker-extension"; then
    echo "📦 Extension is installed, updating..."
    docker extension update ajeetraina777/surrealdb-docker-extension:latest
else
    echo "📦 Extension not installed, installing..."
    docker extension install ajeetraina777/surrealdb-docker-extension:latest
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✅ EXTENSION READY! ✅                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🎉 Open Docker Desktop → Extensions → SurrealDB"
echo ""
echo "📋 Quick test:"
echo "   1. Click START to launch SurrealDB"
echo "   2. Go to Query Editor"
echo "   3. Run: CREATE users SET name = 'Ajeet';"
echo ""
