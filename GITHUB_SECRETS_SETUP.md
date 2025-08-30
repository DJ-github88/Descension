# GitHub Secrets Setup

This document explains how to configure the required GitHub secrets for automated deployment.

## Required Secrets

The GitHub Actions workflow requires the following secrets to be configured in your repository:

### 1. NETLIFY_SITE_ID
- **Description**: Your Netlify site ID
- **How to find**: 
  1. Go to your Netlify dashboard
  2. Select your site
  3. Go to Site settings > General
  4. Copy the "Site ID" value

### 2. NETLIFY_AUTH_TOKEN
- **Description**: Your Netlify personal access token
- **How to create**:
  1. Go to Netlify dashboard
  2. Click on your profile (top right)
  3. Go to User settings > Applications
  4. Click "New access token"
  5. Give it a name (e.g., "GitHub Actions Deploy")
  6. Copy the generated token

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** > **Actions**
4. Click **New repository secret**
5. Add each secret:
   - Name: `NETLIFY_SITE_ID`
   - Value: Your Netlify site ID
   - Click **Add secret**
   
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: Your Netlify access token
   - Click **Add secret**

## Verification

Once the secrets are configured:

1. The GitHub Actions workflow will automatically deploy to Netlify when you push to the `master` branch
2. You can monitor the deployment in the **Actions** tab of your repository
3. The deployment monitoring script will be able to track version information properly

## Security Notes

- Never commit these values directly to your code
- Netlify tokens should be treated as passwords
- You can regenerate tokens if they are compromised
- Only repository administrators can view/edit secrets

## Troubleshooting

If deployment fails:

1. Check that both secrets are properly set
2. Verify the Netlify site ID is correct
3. Ensure the access token has the necessary permissions
4. Check the Actions logs for specific error messages

For more information, see the [GitHub Actions documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets).
