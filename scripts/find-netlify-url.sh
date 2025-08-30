#!/bin/bash

# Script to help find and configure your Netlify site URL

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 Finding your Netlify site URL...${NC}"
echo ""

# Check if netlify CLI is installed
if command -v netlify &> /dev/null; then
    echo -e "${GREEN}✅ Netlify CLI found${NC}"
    echo -e "${BLUE}📋 Getting site information...${NC}"
    
    # Try to get site info
    if netlify status 2>/dev/null | grep -q "Site url:"; then
        SITE_URL=$(netlify status 2>/dev/null | grep "Site url:" | awk '{print $3}')
        echo -e "${GREEN}🎉 Found your Netlify site URL: ${SITE_URL}${NC}"
        echo ""
        
        # Update configuration files
        echo -e "${BLUE}🔧 Updating configuration files...${NC}"
        
        # Update verification script
        if [ -f "scripts/verify-deployment.js" ]; then
            sed -i.bak "s|https://your-site.netlify.app|${SITE_URL}|g" scripts/verify-deployment.js
            echo -e "${GREEN}✅ Updated verify-deployment.js${NC}"
        fi
        
        # Update monitoring script
        if [ -f "scripts/monitor-deployment.sh" ]; then
            sed -i.bak "s|https://your-site.netlify.app|${SITE_URL}|g" scripts/monitor-deployment.sh
            echo -e "${GREEN}✅ Updated monitor-deployment.sh${NC}"
        fi
        
        # Update GitHub Actions workflow
        if [ -f ".github/workflows/deploy.yml" ]; then
            sed -i.bak "s|https://your-site.netlify.app|${SITE_URL}|g" .github/workflows/deploy.yml
            echo -e "${GREEN}✅ Updated GitHub Actions workflow${NC}"
        fi
        
        # Update deployment workflow guide
        if [ -f "DEPLOYMENT_WORKFLOW.md" ]; then
            sed -i.bak "s|https://your-site.netlify.app|${SITE_URL}|g" DEPLOYMENT_WORKFLOW.md
            echo -e "${GREEN}✅ Updated deployment workflow guide${NC}"
        fi
        
        echo ""
        echo -e "${GREEN}🎉 Configuration complete!${NC}"
        echo -e "${BLUE}📍 Your Netlify site URL: ${SITE_URL}${NC}"
        
    else
        echo -e "${YELLOW}⚠️  Could not automatically detect site URL${NC}"
        echo -e "${BLUE}💡 Please run: netlify link${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Netlify CLI not found${NC}"
    echo ""
    echo -e "${BLUE}📋 Manual steps to find your Netlify site URL:${NC}"
    echo ""
    echo -e "${YELLOW}Option 1: Install Netlify CLI${NC}"
    echo "  npm install -g netlify-cli"
    echo "  netlify login"
    echo "  netlify link"
    echo "  netlify status"
    echo ""
    echo -e "${YELLOW}Option 2: Check Netlify Dashboard${NC}"
    echo "  1. Go to https://app.netlify.com"
    echo "  2. Find your site (likely named after your repository)"
    echo "  3. Copy the site URL (usually ends with .netlify.app)"
    echo ""
    echo -e "${YELLOW}Option 3: Check recent deployments${NC}"
    echo "  Look at your recent commits on GitHub"
    echo "  Check for Netlify deployment notifications"
    echo ""
fi

echo ""
echo -e "${BLUE}🔧 Manual configuration (if needed):${NC}"
echo ""
echo -e "${YELLOW}If you know your site URL, run:${NC}"
echo "  export SITE_URL=\"https://your-actual-site.netlify.app\""
echo "  bash scripts/update-site-url.sh \$SITE_URL"
echo ""
echo -e "${YELLOW}Common Netlify URL patterns:${NC}"
echo "  • https://descension.netlify.app"
echo "  • https://mythrill.netlify.app"
echo "  • https://dj-github88-descension.netlify.app"
echo "  • https://[random-words].netlify.app"
