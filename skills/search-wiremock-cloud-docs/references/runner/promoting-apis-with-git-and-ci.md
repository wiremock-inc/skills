> ## Documentation Index
> Fetch the complete documentation index at: https://docs.wiremock.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Promoting Mock APIs with Git and CI/CD

> How to promote WireMock mock APIs across environments using Git version control and CI/CD pipelines

This guide shows you how to promote your WireMock mock APIs across multiple environments using Git version control and CI/CD automation. You'll set up a workflow where changes are recorded in a development environment, reviewed through pull requests, and automatically deployed to staging via GitHub Actions.

## Prerequisites

Before you begin, ensure you have:

* Completed the [Running on Kubernetes](/runner/running-on-kubernetes) guide
* WireMock Runner deployed and running in your Kubernetes cluster
* WireMock CLI installed and authenticated
* A GitHub account and repository for version control
* Git installed and configured locally

<Note>
  While this guide uses GitHub and GitHub Actions, the same principles apply to other Git platforms (GitLab, Bitbucket) and CI/CD tools (Jenkins, CircleCI, GitLab CI).
</Note>

## Initial setup

### Set up development environment

<Note>
  If you have already completed the [Recording Multiple APIs on Kubernetes](/runner/recording-multiple-apis-on-kubernetes) guide,
  you can skip this step as you will already have a development environment.
</Note>

Create a development environment to keep your experimental changes separate from production:

```bash  theme={null}
wiremock environments create --profile development
```

This creates new mock APIs in WireMock Cloud with a `[development]` suffix and generates a `wiremock-development.yaml` profile file that overlays your base `wiremock.yaml` configuration.

Note the base URLs from the output - you'll use these to test your recorded endpoints in WireMock Cloud.

### Set up staging environment

Create a staging environment that will serve as your pre-production testing ground:

```bash  theme={null}
wiremock environments create --profile staging
```

This creates another set of mock APIs with a `[staging]` suffix and generates a `wiremock-staging.yaml` profile file. The staging environment will receive automated deployments from your CI/CD pipeline.

### Initialize git repository

If you haven't already, initialize Git in your project directory:

```bash  theme={null}
cd kubernetes-runner-demo
git init
git add .
git commit -m "Initial commit: WireMock configuration"
```

Create a repository on GitHub and push your initial configuration:

```bash  theme={null}
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

Your repository now contains:

* `.wiremock/wiremock.yaml` - Base configuration with production mock APIs
* `.wiremock/wiremock-development.yaml` - Development environment overrides
* `.wiremock/wiremock-staging.yaml` - Staging environment overrides
* `.wiremock/*/stub-mappings.yaml` - Stub mappings for each mock API

### Create GitHub Actions workflow

Create a GitHub Actions workflow that automatically pushes changes to staging when code is merged to the main branch.

Create the workflow file:

```bash  theme={null}
mkdir -p .github/workflows
```

Create `.github/workflows/deploy-staging.yml`:

```yaml  theme={null}
name: Deploy to Staging

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install WireMock CLI
        run: npm install -g @wiremock/cli

      - name: Configure WireMock CLI
        env:
          WIREMOCK_API_TOKEN: ${{ secrets.WIREMOCK_API_TOKEN }}
        run: |
          wiremock config set api_token $WIREMOCK_API_TOKEN

      - name: Push to staging environment
        run: |
          wiremock push mock-api --all --profile staging

      - name: Confirm deployment
        run: |
          echo "✅ Successfully deployed mock APIs to staging environment"
```

#### Configure GitHub secrets

Add your WireMock Cloud API token as a GitHub secret:

1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `WIREMOCK_API_TOKEN`
5. Value: Your WireMock Cloud API token (find it at [app.wiremock.cloud/account/security](https://app.wiremock.cloud/account/security))

Commit and push the workflow:

```bash  theme={null}
git add .github/workflows/deploy-staging.yml
git commit -m "Add CI/CD workflow for staging deployment"
git push origin main
```

## Update APIs via the workflow

Now that your environments and CI/CD pipeline are configured, you can start making changes.

### Sync development with the source project

Run the following to push all the configuration to the development environment in WireMock Cloud:

```bash  theme={null}
wiremock push mock-api --all --profile development
```

### Update APIs in development

Update the development APIs in Cloud via whatever means you wish e.g. manual editing in the UI, recording, scripting etc.

See the [recording on Kubernetes guide](/runner/recording-multiple-apis-on-kubernetes) for details on recording multiple APIs
simultaneously from within Kubernetes.

## Pull your changes from development

Pull the updated stub mappings from your development environment into your local project:

```bash  theme={null}
wiremock pull mock-api --all --profile development
```

This downloads the stub mappings from your development environment and overwrites the local stub files in your `.wiremock` directory.

<Note>
  When pulling with a profile, only the stub mappings and API definition files are updated - the `wiremock.yaml` configuration remains unchanged.
</Note>

Review the changes to ensure they look correct:

```bash  theme={null}
git diff .wiremock
```

## Create a pull request

Create a new branch for your changes:

```bash  theme={null}
git checkout -b feature/add-github-org-endpoints
```

Commit your changes:

```bash  theme={null}
git add .wiremock
git commit -m "Add GitHub organization and repository endpoints"
git push origin feature/add-github-org-endpoints
```

Create a pull request on GitHub:

1. Go to your repository on GitHub
2. Click **Pull requests** → **New pull request**
3. Select your feature branch
4. Add a description explaining the changes
5. Create the pull request

## Merge and Deploy

When the pull request is approved, merge it into the main branch:

1. Click **Merge pull request** on GitHub
2. Confirm the merge

GitHub Actions will automatically:

1. Detect the changes in the `.wiremock` directory
2. Run the deployment workflow
3. Push the updated mock APIs to the staging environment
4. Report the deployment status

### Verify the Deployment

Check the GitHub Actions workflow to ensure it completed successfully:

1. Go to the **Actions** tab in your repository
2. Click on the latest workflow run
3. Verify all steps completed successfully

Test the deployed endpoints in staging:

```bash  theme={null}
curl https://your-staging-api.wiremock.cloud/a-new-endpoint
```

The staging environment now has the same stub mappings as your development environment.

## Troubleshooting

### Workflow Fails with Authentication Error

If the GitHub Actions workflow fails with an authentication error:

1. Verify the `WIREMOCK_API_TOKEN` secret is set correctly in GitHub
2. Check that your API token hasn't expired
3. Generate a new token at [app.wiremock.cloud/account/security](https://app.wiremock.cloud/account/security)

### Stub Mappings Not Updated After Push

If stub mappings don't appear in WireMock Cloud after pushing:

1. Check the workflow logs for errors
2. Verify the profile name matches your environment file
3. Ensure the `cloud_id` values in your profile file are correct

## Additional Resources

* Learn about [selective recording](/runner/record-many#choosing-which-services-to-record) to record only specific services
* Set up [branch-specific environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) for feature branch testing

