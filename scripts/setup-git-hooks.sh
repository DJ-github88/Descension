#!/bin/bash

# Setup script for git hooks
# Run this once to install pre-commit hooks

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔧 Setting up git hooks...${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy pre-commit hook
if [ -f ".githooks/pre-commit" ]; then
    cp .githooks/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo -e "${GREEN}✅ Pre-commit hook installed${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: .githooks/pre-commit not found${NC}"
fi

# Set git hooks path (optional, for team consistency)
git config core.hooksPath .githooks

echo -e "${GREEN}🎉 Git hooks setup complete!${NC}"
echo -e "${BLUE}📋 What this does:${NC}"
echo -e "   • Runs build test before each commit"
echo -e "   • Checks for common issues (console.log, merge conflicts)"
echo -e "   • Runs linter if available"
echo -e "   • Warns about large files and TODOs"
echo -e ""
echo -e "${BLUE}💡 To bypass hooks (emergency only):${NC}"
echo -e "   git commit --no-verify -m \"Emergency commit\""
