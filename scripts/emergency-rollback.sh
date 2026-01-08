#!/bin/bash

# Emergency Rollback Script
# Quickly rollback to a previous working version

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKUP_BRANCH_PREFIX="backup-"
MAX_ROLLBACK_COMMITS=10

show_usage() {
    echo -e "${BLUE}🚨 Emergency Rollback Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -c, --commit HASH    Rollback to specific commit"
    echo "  -l, --list          List recent commits"
    echo "  -b, --backup        Create backup before rollback"
    echo "  -f, --force         Force rollback without confirmation"
    echo "  -h, --help          Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 --list                    # Show recent commits"
    echo "  $0 --commit abc123           # Rollback to commit abc123"
    echo "  $0 --backup --commit abc123  # Create backup then rollback"
}

list_recent_commits() {
    echo -e "${BLUE}📋 Recent commits (last $MAX_ROLLBACK_COMMITS):${NC}"
    echo ""
    git log --oneline -$MAX_ROLLBACK_COMMITS --format="%C(yellow)%h%C(reset) %C(blue)%ad%C(reset) %s %C(green)(%an)%C(reset)" --date=short
    echo ""
}

create_backup() {
    local backup_name="${BACKUP_BRANCH_PREFIX}$(date +%Y%m%d-%H%M%S)"
    echo -e "${BLUE}💾 Creating backup branch: $backup_name${NC}"
    
    git checkout -b "$backup_name"
    git checkout master
    
    echo -e "${GREEN}✅ Backup created: $backup_name${NC}"
    return 0
}

confirm_rollback() {
    local target_commit="$1"
    local commit_info=$(git log --oneline -1 "$target_commit" 2>/dev/null || echo "Invalid commit")
    
    echo -e "${YELLOW}⚠️  ROLLBACK CONFIRMATION${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "Target commit: ${BLUE}$commit_info${NC}"
    echo -e "Current branch: ${BLUE}$(git branch --show-current)${NC}"
    echo -e "This will:"
    echo -e "  • Reset HEAD to $target_commit"
    echo -e "  • Force push to origin/master"
    echo -e "  • Trigger new Netlify deployment"
    echo -e "  • ${RED}LOSE ALL COMMITS AFTER $target_commit${NC}"
    echo ""
    echo -e "${YELLOW}Are you sure you want to continue? (yes/no):${NC}"
    
    read -r response
    if [[ "$response" != "yes" ]]; then
        echo -e "${YELLOW}❌ Rollback cancelled${NC}"
        exit 1
    fi
}

perform_rollback() {
    local target_commit="$1"
    local force="$2"
    
    # Validate commit exists
    if ! git cat-file -e "$target_commit" 2>/dev/null; then
        echo -e "${RED}❌ Error: Commit $target_commit does not exist${NC}"
        exit 1
    fi
    
    # Confirm unless forced
    if [[ "$force" != "true" ]]; then
        confirm_rollback "$target_commit"
    fi
    
    echo -e "${BLUE}🔄 Performing rollback...${NC}"
    
    # Ensure we're on master
    git checkout master
    
    # Reset to target commit
    echo -e "${BLUE}📍 Resetting to commit $target_commit${NC}"
    git reset --hard "$target_commit"
    
    # Force push to trigger deployment
    echo -e "${BLUE}🚀 Force pushing to origin/master${NC}"
    git push --force origin master
    
    echo -e "${GREEN}✅ Rollback complete!${NC}"
    echo -e "${BLUE}📊 Current status:${NC}"
    git log --oneline -3
    echo ""
    echo -e "${YELLOW}⏳ Netlify deployment will start automatically${NC}"
    echo -e "${YELLOW}   Monitor at: https://app.netlify.com${NC}"
}

check_git_status() {
    if [[ -n $(git status --porcelain) ]]; then
        echo -e "${RED}❌ Error: Working directory is not clean${NC}"
        echo -e "${YELLOW}   Please commit or stash changes before rollback${NC}"
        git status --short
        exit 1
    fi
}

main() {
    local target_commit=""
    local create_backup_flag=false
    local force_flag=false
    local list_flag=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -c|--commit)
                target_commit="$2"
                shift 2
                ;;
            -l|--list)
                list_flag=true
                shift
                ;;
            -b|--backup)
                create_backup_flag=true
                shift
                ;;
            -f|--force)
                force_flag=true
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
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Error: Not in a git repository${NC}"
        exit 1
    fi
    
    # List commits if requested
    if [[ "$list_flag" == true ]]; then
        list_recent_commits
        exit 0
    fi
    
    # Require commit hash for rollback
    if [[ -z "$target_commit" ]]; then
        echo -e "${RED}❌ Error: No commit specified${NC}"
        echo -e "${YELLOW}💡 Use --list to see recent commits${NC}"
        show_usage
        exit 1
    fi
    
    # Check git status
    check_git_status
    
    # Create backup if requested
    if [[ "$create_backup_flag" == true ]]; then
        create_backup
    fi
    
    # Perform rollback
    perform_rollback "$target_commit" "$force_flag"
}

# Make script executable and run main function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
