# 🚀 Deployment Workflow Guide

## Overview
This guide ensures your Netlify deployment stays perfectly synchronized with your local development environment.

## 🔄 Standard Development Workflow

### 1. **Before Making Changes**
```bash
# Always start with a clean, up-to-date repository
git status                    # Check for uncommitted changes
git pull origin master        # Get latest changes
npm run start                 # Test locally first
```

### 2. **Making Changes**
```bash
# Make your code changes
# Test thoroughly in localhost

# Check what changed
git status
git diff

# Stage and commit changes
git add .
git commit -m "Descriptive commit message"
```

### 3. **Deploy to Production**
```bash
# Push to trigger automatic deployment
git push origin master

# Monitor deployment (optional)
# Visit your Netlify dashboard to watch the build
```

### 4. **Verify Deployment**
```bash
# Wait 2-5 minutes for build to complete
# Check the version display in bottom-right corner
# Verify the commit hash matches your latest commit
```

## 🎯 Version Tracking System

### **Version Display Component**
- **Location**: Bottom-right corner of every page
- **Shows**: Environment, version, commit hash, build time
- **Click to expand**: Full deployment details

### **Environment Indicators**
- 🔧 **Development**: localhost
- 🌐 **Netlify Production**: netlify.app domain
- 🚂 **Railway Production**: railway.app domain

### **Quick Version Check**
```javascript
// In browser console
console.log(window.versionInfo);
```

## 🚨 Troubleshooting Version Drift

### **Problem**: Netlify shows old version
**Solutions**:
1. Check if you have uncommitted changes: `git status`
2. Commit and push changes: `git add . && git commit -m "Update" && git push`
3. Force rebuild in Netlify dashboard
4. Clear browser cache (Ctrl+F5)

### **Problem**: Build fails on Netlify
**Solutions**:
1. Check build logs in Netlify dashboard
2. Test build locally: `npm run build:netlify`
3. Check for missing environment variables
4. Verify all dependencies are in package.json

### **Problem**: Features work locally but not on Netlify
**Solutions**:
1. Check browser console for errors
2. Verify environment variables are set in Netlify
3. Check for localhost-specific code
4. Test production build locally: `npm run netlify:local`

## 📋 Pre-Deployment Checklist

### **Before Every Commit**:
- [ ] Code works in localhost
- [ ] No console errors
- [ ] All new dependencies added to package.json
- [ ] Environment variables updated if needed
- [ ] Commit message is descriptive

### **Before Major Changes**:
- [ ] Create backup branch: `git checkout -b backup-$(date +%Y%m%d)`
- [ ] Test build locally: `npm run build:netlify`
- [ ] Review all changed files: `git diff --name-only`
- [ ] Update version in package.json if needed

## 🔧 Emergency Procedures

### **Quick Rollback**
```bash
# Find last working commit
git log --oneline -10

# Rollback to specific commit
git reset --hard <commit-hash>
git push --force origin master
```

### **Force Fresh Deployment**
```bash
# Update build timestamp to force rebuild
# Edit netlify.toml BUILD_TIMESTAMP
git add netlify.toml
git commit -m "Force rebuild"
git push origin master
```

### **Clear All Caches**
1. Netlify: Site Settings → Build & Deploy → Clear Cache
2. Browser: Hard refresh (Ctrl+Shift+R)
3. Local: `rm -rf node_modules package-lock.json && npm install`

## 🎛️ Netlify Configuration

### **Required Environment Variables**:
```
NODE_VERSION=18
NODE_ENV=production
GENERATE_SOURCEMAP=false
CI=true
NODE_OPTIONS=--max-old-space-size=8192
REACT_APP_BUILD_MODE=production
REACT_APP_ENV=production
REACT_APP_VERSION=0.1.3
REACT_APP_COMMIT_SHA=$COMMIT_REF
REACT_APP_BRANCH=$BRANCH
REACT_APP_BUILD_TIME=$BUILD_ID
```

### **Build Command**:
```bash
rm -rf node_modules && rm -rf build && rm -rf .cache && npm ci --force && npm run build
```

### **Publish Directory**: `build`

## 📊 Monitoring & Alerts

### **Daily Checks**:
- Version display shows correct commit hash
- No console errors on production
- All features working as expected

### **Weekly Checks**:
- Review Netlify build logs
- Check for failed deployments
- Update dependencies if needed

### **Monthly Checks**:
- Review and clean up old branches
- Update Node.js version if needed
- Audit and update dependencies

## 🔗 Useful Commands

```bash
# Quick status check
git status && git log --oneline -5

# Test production build locally
npm run netlify:local

# Check for uncommitted changes
git diff --name-only

# View recent commits
git log --oneline -10

# Check current branch
git branch

# Force push (use carefully!)
git push --force origin master
```

## 📞 Support

If you encounter persistent deployment issues:
1. Check this guide first
2. Review Netlify build logs
3. Test locally with `npm run build:netlify`
4. Check GitHub Actions (if enabled)
5. Contact support with specific error messages
