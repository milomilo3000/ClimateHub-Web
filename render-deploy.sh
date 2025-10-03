#!/bin/bash

# Render Deployment Script for ClimateHub
echo "🚀 Starting Render deployment for ClimateHub..."

# Set environment
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build output
echo "✅ Verifying build..."
if [ -d "build" ]; then
    echo "Build directory exists"
    ls -la build/
    
    # Check if index.html exists
    if [ -f "build/index.html" ]; then
        echo "✅ index.html found"
    else
        echo "❌ index.html not found!"
        exit 1
    fi
    
    # Check if static assets exist
    if [ -d "build/static" ]; then
        echo "✅ Static assets found"
        ls -la build/static/
    else
        echo "⚠️ No static assets directory found"
    fi
else
    echo "❌ Build directory not found!"
    exit 1
fi

echo "✅ Render deployment preparation complete!"
