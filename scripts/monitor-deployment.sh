#!/bin/bash

# Deployment Monitoring Script
# Continuously monitor deployment status and health

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SITE_URL="${SITE_URL:-https://abcdfasdsad.netlify.app}"
CHECK_INTERVAL=30  # seconds
MAX_WAIT_TIME=600  # 10 minutes
HEALTH_CHECK_TIMEOUT=10

show_usage() {
    echo -e "${BLUE}📊 Deployment Monitoring Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -u, --url URL        Site URL to monitor (default: $SITE_URL)"
    echo "  -i, --interval SEC   Check interval in seconds (default: $CHECK_INTERVAL)"
    echo "  -t, --timeout SEC    Max wait time in seconds (default: $MAX_WAIT_TIME)"
    echo "  -o, --once          Run check once and exit"
    echo "  -h, --help          Show this help"
    echo ""
    echo "Environment Variables:"
    echo "  SITE_URL            Override default site URL"
}

check_site_health() {
    local url="$1"
    local timeout="$2"
    
    if curl -s --max-time "$timeout" --fail "$url" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

get_deployment_info() {
    local url="$1"
    
    # Get the HTML content
    local html=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "")
    
    if [[ -z "$html" ]]; then
        echo "ERROR: Could not fetch site content"
        return 1
    fi
    
    # Extract version information
    local commit=$(echo "$html" | grep -o 'REACT_APP_COMMIT_SHA['"'"'"][^'"'"'"]*['"'"'"][[:space:]]*:[[:space:]]*['"'"'"][^'"'"'"]*['"'"'"]' | sed 's/.*['"'"'"]\([^'"'"'"]*\)['"'"'"]$/\1/' | head -1)
    local branch=$(echo "$html" | grep -o 'REACT_APP_BRANCH['"'"'"][^'"'"'"]*['"'"'"][[:space:]]*:[[:space:]]*['"'"'"][^'"'"'"]*['"'"'"]' | sed 's/.*['"'"'"]\([^'"'"'"]*\)['"'"'"]$/\1/' | head -1)
    local version=$(echo "$html" | grep -o 'REACT_APP_VERSION['"'"'"][^'"'"'"]*['"'"'"][[:space:]]*:[[:space:]]*['"'"'"][^'"'"'"]*['"'"'"]' | sed 's/.*['"'"'"]\([^'"'"'"]*\)['"'"'"]$/\1/' | head -1)
    local build_time=$(echo "$html" | grep -o 'REACT_APP_BUILD_TIME['"'"'"][^'"'"'"]*['"'"'"][[:space:]]*:[[:space:]]*['"'"'"][^'"'"'"]*['"'"'"]' | sed 's/.*['"'"'"]\([^'"'"'"]*\)['"'"'"]$/\1/' | head -1)
    
    echo "COMMIT:$commit"
    echo "BRANCH:$branch"
    echo "VERSION:$version"
    echo "BUILD_TIME:$build_time"
}

get_local_info() {
    local commit=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    
    echo "LOCAL_COMMIT:$commit"
    echo "LOCAL_BRANCH:$branch"
}

format_timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

monitor_deployment() {
    local url="$1"
    local interval="$2"
    local max_wait="$3"
    local once="$4"
    
    local start_time=$(date +%s)
    local check_count=0
    
    echo -e "${BLUE}🔍 Starting deployment monitoring...${NC}"
    echo -e "${BLUE}📍 Site URL: $url${NC}"
    echo -e "${BLUE}⏱️  Check interval: ${interval}s${NC}"
    echo -e "${BLUE}⏰ Max wait time: ${max_wait}s${NC}"
    echo ""
    
    # Get local git info
    local local_info=$(get_local_info)
    local local_commit=$(echo "$local_info" | grep "LOCAL_COMMIT:" | cut -d: -f2)
    local local_branch=$(echo "$local_info" | grep "LOCAL_BRANCH:" | cut -d: -f2)
    
    echo -e "${BLUE}📋 Local Information:${NC}"
    echo -e "   Branch: ${YELLOW}$local_branch${NC}"
    echo -e "   Commit: ${YELLOW}${local_commit:0:7}${NC}"
    echo ""
    
    while true; do
        check_count=$((check_count + 1))
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        echo -e "${BLUE}[$(format_timestamp)] Check #$check_count (${elapsed}s elapsed)${NC}"
        
        # Health check
        if check_site_health "$url" "$HEALTH_CHECK_TIMEOUT"; then
            echo -e "   ${GREEN}✅ Site is responding${NC}"
            
            # Get deployment info
            local deploy_info=$(get_deployment_info "$url")
            
            if [[ "$deploy_info" == "ERROR:"* ]]; then
                echo -e "   ${YELLOW}⚠️  Could not get deployment info${NC}"
            else
                local deploy_commit=$(echo "$deploy_info" | grep "COMMIT:" | cut -d: -f2)
                local deploy_branch=$(echo "$deploy_info" | grep "BRANCH:" | cut -d: -f2)
                local deploy_version=$(echo "$deploy_info" | grep "VERSION:" | cut -d: -f2)
                local deploy_build_time=$(echo "$deploy_info" | grep "BUILD_TIME:" | cut -d: -f2)
                
                echo -e "   ${BLUE}📊 Deployed Version:${NC}"
                echo -e "      Version: ${YELLOW}$deploy_version${NC}"
                echo -e "      Branch: ${YELLOW}$deploy_branch${NC}"
                echo -e "      Commit: ${YELLOW}${deploy_commit:0:7}${NC}"
                echo -e "      Build: ${YELLOW}$deploy_build_time${NC}"
                
                # Compare with local
                if [[ "$deploy_commit" == "$local_commit" ]]; then
                    echo -e "   ${GREEN}🎉 Deployment matches local commit!${NC}"
                    echo -e "   ${GREEN}✅ Monitoring complete - deployment is up to date${NC}"
                    exit 0
                else
                    echo -e "   ${YELLOW}⏳ Deployment in progress (commit mismatch)${NC}"
                    echo -e "      Local:    ${local_commit:0:7}"
                    echo -e "      Deployed: ${deploy_commit:0:7}"
                fi
            fi
        else
            echo -e "   ${RED}❌ Site is not responding${NC}"
        fi
        
        # Check if we should exit
        if [[ "$once" == "true" ]]; then
            echo -e "${BLUE}📋 Single check complete${NC}"
            exit 0
        fi
        
        # Check timeout
        if [[ $elapsed -ge $max_wait ]]; then
            echo -e "${RED}⏰ Timeout reached (${max_wait}s)${NC}"
            echo -e "${YELLOW}💡 Deployment may still be in progress${NC}"
            exit 1
        fi
        
        echo -e "   ${BLUE}⏳ Waiting ${interval}s for next check...${NC}"
        echo ""
        sleep "$interval"
    done
}

main() {
    local url="$SITE_URL"
    local interval="$CHECK_INTERVAL"
    local max_wait="$MAX_WAIT_TIME"
    local once=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -u|--url)
                url="$2"
                shift 2
                ;;
            -i|--interval)
                interval="$2"
                shift 2
                ;;
            -t|--timeout)
                max_wait="$2"
                shift 2
                ;;
            -o|--once)
                once=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Unknown option: $1${NC}"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Validate URL
    if [[ -z "$url" ]]; then
        echo -e "${RED}❌ Error: No site URL specified${NC}"
        show_usage
        exit 1
    fi
    
    # Start monitoring
    monitor_deployment "$url" "$interval" "$max_wait" "$once"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
