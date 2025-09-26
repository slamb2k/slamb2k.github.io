#!/bin/bash

# Vercel CI/CD Setup Script
# This script helps configure Vercel deployment through GitHub Actions

echo "==================================="
echo "Vercel CI/CD Setup Script"
echo "==================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Installing Vercel CLI globally..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Initialize Vercel project
echo "📦 Initializing Vercel project..."
echo "When prompted:"
echo "  - Select your scope/team"
echo "  - Choose 'N' when asked to link to existing Git repository"
echo "  - Set project name and configure as needed"
echo ""
vercel

# Get project information
echo ""
echo "🔍 Getting project information..."
vercel project ls

echo ""
echo "==================================="
echo "Next Steps:"
echo "==================================="
echo ""
echo "1. Copy the PROJECT_ID and ORG_ID from above"
echo ""
echo "2. Update .vercel/project.json with these values:"
echo "   - Replace VERCEL_PROJECT_ID with your project ID"
echo "   - Replace VERCEL_ORG_ID with your org/team ID"
echo ""
echo "3. Create a Vercel token at:"
echo "   https://vercel.com/account/tokens"
echo ""
echo "4. Add the following secrets to GitHub:"
echo "   (Repository → Settings → Secrets and variables → Actions)"
echo ""
echo "   - VERCEL_TOKEN: Your Vercel token"
echo "   - VERCEL_ORG_ID: Your org/team ID (optional if personal account)"
echo "   - VERCEL_PROJECT_ID: Your project ID"
echo ""
echo "5. Commit and push the updated .vercel/project.json"
echo ""
echo "✅ Setup complete! Your CI/CD pipeline is ready to deploy."