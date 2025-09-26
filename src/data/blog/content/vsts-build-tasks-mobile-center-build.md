# VSTS Build Tasks - Mobile Center Build

_Published on May 5, 2017_

## Introduction

Integrating Mobile Center builds into your VSTS pipeline can streamline your mobile DevOps workflow. Here's how to set up and use VSTS build tasks for Mobile Center.

## Setting Up the Build Task

### Prerequisites

- VSTS account with build agent
- Mobile Center account and app configured
- API token with appropriate permissions

### Installation

1. Install the Mobile Center extension from VSTS Marketplace
2. Add the Mobile Center Build task to your pipeline

## Configuration

### Basic Configuration

```yaml
- task: MobileCenterBuild@1
  inputs:
    appSlug: 'owner/app-name'
    branch: 'master'
    apiToken: '$(MobileCenterApiToken)'
```

### Advanced Options

```yaml
- task: MobileCenterBuild@1
  inputs:
    appSlug: 'owner/app-name'
    branch: 'master'
    apiToken: '$(MobileCenterApiToken)'
    buildConfiguration: 'Release'
    runTests: true
    distributeBuilds: true
    distributionGroup: 'Beta Testers'
```

## Integration Patterns

### Pattern 1: Trigger on Pull Request

```yaml
trigger:
  branches:
    include:
      - master
  pr:
    branches:
      include:
        - master
```

### Pattern 2: Nightly Builds

```yaml
schedules:
  - cron: '0 0 * * *'
    displayName: Nightly build
    branches:
      include:
        - master
```

## Build Variables

Useful variables to pass between VSTS and Mobile Center:

- `$(Build.BuildNumber)` - Use for versioning
- `$(Build.SourceBranch)` - Branch information
- `$(Build.RequestedFor)` - Who triggered the build

## Error Handling

Common issues and solutions:

### API Token Issues

- Ensure token has correct permissions
- Store token in secure variable

### Build Failures

- Check Mobile Center logs
- Verify build configuration
- Ensure dependencies are specified

## Best Practices

1. **Use Variable Groups** for API tokens
2. **Implement Build Validation** policies
3. **Set Up Notifications** for build failures
4. **Archive Build Artifacts** for compliance

## Conclusion

VSTS build tasks for Mobile Center provide powerful automation capabilities for your mobile CI/CD pipeline. Proper configuration ensures smooth, reliable builds.
