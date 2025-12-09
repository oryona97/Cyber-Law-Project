#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=========================================="
echo "      Preparing Project Environment       "
echo "=========================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

echo "--> Updating local dependencies (to keep lockfiles fresh)..."

# Backend
if [ -d "backend" ] && [ -f "backend/package.json" ]; then
    echo "    (Backend)..."
    (cd backend && npm install)
fi

# Frontend
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    echo "    (Frontend)..."
    (cd frontend && npm install)
fi

echo "=========================================="
echo "      Starting Project with Docker        "
echo "=========================================="

echo "--> Building and starting services..."
docker-compose up --build


