# Visual Studio Mobile Center – Showing build status on your VSTS dashboard

_Published on July 15, 2017_

## Overview

Want to see your Mobile Center build status right on your VSTS dashboard? Here's how to set it up for better visibility across your entire CI/CD pipeline.

## Why Integrate Build Status?

Having all your build statuses in one place:

- Improves team visibility
- Reduces context switching
- Helps identify bottlenecks quickly
- Provides a single source of truth

## Step-by-Step Setup

### Step 1: Generate Mobile Center API Token

1. Log into Mobile Center
2. Navigate to Account Settings
3. Generate a new API token with read access

### Step 2: Create VSTS Dashboard Widget

1. Open your VSTS project dashboard
2. Click "Edit Dashboard"
3. Add a new "REST API" widget

### Step 3: Configure the Widget

Use the following configuration:

```javascript
{
  "url": "https://api.mobile.azure.com/v0.1/apps/{owner}/{app}/builds",
  "headers": {
    "X-API-Token": "your-token-here"
  },
  "method": "GET"
}
```

### Step 4: Create Custom Visualization

For better visualization, create a custom widget using the VSTS Extension SDK:

```typescript
VSS.require(['TFS/Dashboards/WidgetHelpers'], function (WidgetHelpers) {
  WidgetHelpers.IncludeWidgetStyles();
  VSS.register('MobileCenterBuildStatus', function () {
    return {
      load: function (widgetSettings) {
        // Fetch and display build status
        return getMobileCenterBuilds().then(displayBuildStatus);
      },
    };
  });
});
```

## Alternative Approaches

### Using Web Hooks

Mobile Center supports webhooks that can update VSTS directly:

1. Configure webhook in Mobile Center
2. Point to VSTS incoming webhook URL
3. Map build events to dashboard updates

### Using Azure Functions

Create an Azure Function as middleware:

1. Function polls Mobile Center API
2. Transforms data for VSTS
3. Updates dashboard via VSTS API

## Conclusion

Integrating Mobile Center build status into your VSTS dashboard provides valuable visibility for your team. Choose the approach that best fits your needs and security requirements.
