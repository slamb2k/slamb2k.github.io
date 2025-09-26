# Deployment Approval Configuration

This guide explains how to set up manual approval for deployments in GitHub Actions.

## Overview

The CI/CD pipeline includes environment-based protection rules that require manual approval before deploying to Vercel. This provides an additional safety check before changes go live.

## Environments

The workflow uses two environments:

1. **`production`** - For main branch deployments
2. **`preview`** - For pull request preview deployments

## Setting Up Environment Protection Rules

### 1. Create Environments

1. Go to your GitHub repository
2. Navigate to **Settings** → **Environments**
3. Click **New environment**
4. Create two environments:
   - `production`
   - `preview`

### 2. Configure Production Environment

For the `production` environment:

1. Click on the `production` environment
2. Under **Environment protection rules**, configure:

   **Required reviewers:**

   - ✅ Check "Required reviewers"
   - Add yourself or specific team members as reviewers
   - Set the number of required approvals (usually 1)

   **Deployment branches:**

   - Select "Selected branches"
   - Add rule: `main` (only main branch can deploy to production)

   **Wait timer (optional):**

   - Set a delay before deployment (e.g., 5 minutes)
   - Useful for last-minute cancellations

3. Click **Save protection rules**

### 3. Configure Preview Environment (Optional)

For the `preview` environment, you might want lighter restrictions:

1. Click on the `preview` environment
2. Under **Environment protection rules**:

   - Consider adding required reviewers for sensitive PRs
   - Or leave unrestricted for automatic PR previews

3. Click **Save protection rules**

## How It Works

### Production Deployments

When code is pushed to `main`:

1. Tests, linting, and build jobs run automatically
2. When ready to deploy, the workflow pauses at the `deploy-vercel` job
3. GitHub sends a notification to required reviewers
4. Reviewer goes to Actions tab → selects the workflow run
5. Click **Review deployments**
6. Select the environment and click **Approve and deploy**
7. Deployment proceeds to Vercel

### Preview Deployments

For pull requests:

1. Tests and checks run automatically
2. If preview environment has protection rules, approval is required
3. Otherwise, preview deploys automatically
4. Preview URL is posted as a PR comment

## Approving Deployments

### Via GitHub UI

1. Go to the **Actions** tab
2. Find the pending workflow run
3. Click on the workflow
4. You'll see "Waiting for review" on the deployment job
5. Click **Review deployments**
6. Add an optional comment
7. Click **Approve and deploy**

### Via GitHub Mobile App

1. Open the GitHub mobile app
2. Navigate to your repository
3. Go to Pull Requests or Actions
4. Find the pending deployment
5. Approve directly from your phone

### Via GitHub CLI

```bash
# List pending deployments
gh run list --workflow=ci.yml

# View specific run
gh run view <run-id>

# Approve deployment (requires additional setup)
gh api /repos/OWNER/REPO/actions/runs/<run-id>/pending_deployments \
  --method POST \
  -f "environment_ids[]=<env-id>" \
  -f "state=approved" \
  -f "comment=Approved via CLI"
```

## Notifications

### Email Notifications

GitHub sends email notifications for:

- Deployment approval requests
- Deployment status (success/failure)

### Slack/Teams Integration

You can set up webhooks to receive notifications in Slack or Teams:

1. In environment settings, add a webhook URL
2. Configure notification preferences

## Bypassing Approval (Emergency Deployments)

For emergency deployments, repository admins can:

1. Temporarily disable environment protection rules
2. Deploy directly using Vercel CLI
3. Re-enable protection rules after deployment

**Note:** All bypasses should be documented and reviewed.

## Best Practices

1. **Use Different Approvers**: Don't approve your own deployments
2. **Add Comments**: Document why deployments are approved/rejected
3. **Review Changes**: Always review the changes before approving
4. **Set Reasonable Timeouts**: Don't make wait times too long
5. **Monitor Deployments**: Watch deployment progress after approval

## Troubleshooting

### Deployment Stuck Waiting

- Check if you have permission to approve
- Verify environment protection rules
- Check GitHub Actions status page

### Can't See Approve Button

- Ensure you're listed as a required reviewer
- Check repository permissions
- Try refreshing the page or using a different browser

### Deployment Failed After Approval

- Check Vercel logs
- Verify secrets are configured correctly
- Review the deployment error in Actions logs

## Removing Approval Requirements

To temporarily or permanently remove approval requirements:

1. Go to **Settings** → **Environments**
2. Select the environment
3. Uncheck "Required reviewers"
4. Save protection rules

**Note:** Consider the security implications before removing approval requirements.
