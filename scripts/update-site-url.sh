#!/bin/bash

# Script to update Netlify site URL in all configuration files

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Please provide your Netlify site URL${NC}"
    echo ""
    echo "Usage: $0 <netlify-site-url>"
    echo ""
    echo "Example:"
    echo "  $0 https://your-site.netlify.app"
    exit 1
fi

SITE_URL="$1"

# Validate URL format
if [[ ! "$SITE_URL" =~ ^https?:// ]]; then
    echo -e "${RED}❌ Error: URL must start with http:// or https://${NC}"
    exit 1
fi

echo -e "${BLUE}🔧 Updating Netlify site URL to: ${SITE_URL}${NC}"
echo ""

# Function to update file if it exists
update_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        # Create backup
        cp "$file" "${file}.bak"
        
        # Update the file
        sed -i "s|https://your-site\.netlify\.app|${SITE_URL}|g" "$file"
        
        echo -e "${GREEN}✅ Updated ${description}${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  File not found: ${file}${NC}"
        return 1
    fi
}

# Update all configuration files
echo -e "${BLUE}📝 Updating configuration files...${NC}"

update_file "scripts/verify-deployment.js" "deployment verification script"
update_file "scripts/monitor-deployment.sh" "deployment monitoring script"
update_file ".github/workflows/deploy.yml" "GitHub Actions workflow"
update_file "DEPLOYMENT_WORKFLOW.md" "deployment workflow guide"

# Update package.json scripts if they reference the URL
if [ -f "vtt-react/package.json" ]; then
    if grep -q "your-site.netlify.app" "vtt-react/package.json"; then
        cp "vtt-react/package.json" "vtt-react/package.json.bak"
        sed -i "s|https://your-site\.netlify\.app|${SITE_URL}|g" "vtt-react/package.json"
        echo -e "${GREEN}✅ Updated package.json scripts${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Site URL configuration complete!${NC}"
echo ""
echo -e "${BLUE}📋 Updated files:${NC}"
echo "  • scripts/verify-deployment.js"
echo "  • scripts/monitor-deployment.sh"
echo "  • .github/workflows/deploy.yml"
echo "  • DEPLOYMENT_WORKFLOW.md"
echo ""
echo -e "${BLUE}📍 Your site URL: ${SITE_URL}${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "  1. Test the verification script:"
echo "     cd vtt-react && npm run verify:deployment"
echo ""
echo "  2. Monitor your next deployment:"
echo "     bash scripts/monitor-deployment.sh --once"
echo ""
echo "  3. Commit these changes:"
echo "     git add ."
echo "     git commit -m \"Configure Netlify site URL: ${SITE_URL}\""
echo "     git push origin master"
