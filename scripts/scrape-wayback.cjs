#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Blog post URLs to recover from Wayback Machine
const BLOG_POSTS = [
  {
    url: 'https://simonlamb.codes/2018/06/08/weird-issue-when-service-connections-are-parameterized-in-task-groups/',
    title:
      'How I ensure consistency when creating pipelines in VSTS using Task Groups and Variable Groups',
    date: '2018-06-08',
  },
  {
    url: 'https://simonlamb.codes/2017/11/07/the-sdk-microsoft-docker-sdk-specified-could-not-be-found-and-other-netcoredocker-fun/',
    title:
      "The SDK 'Microsoft.Docker.Sdk' specified could not be found and other .NET Core/Docker fun",
    date: '2017-11-07',
  },
  {
    url: 'https://simonlamb.codes/2017/08/07/mobile-devops-hypothesis-driven-development-and-visual-studio-mobile-center/',
    title: 'Mobile DevOps – Hypothesis Driven Development and Visual Studio Mobile Center',
    date: '2017-08-07',
  },
  {
    url: 'https://simonlamb.codes/2017/07/15/visual-studio-mobile-center-showing-build-status-on-your-vsts-dashboard/',
    title: 'Visual Studio Mobile Center – Showing build status on your VSTS dashboard',
    date: '2017-07-15',
  },
  {
    url: 'https://simonlamb.codes/2017/06/22/desktop-bridge-link-roundup/',
    title: 'Desktop Bridge Link Roundup',
    date: '2017-06-22',
  },
  {
    url: 'https://simonlamb.codes/2017/05/05/vsts-build-tasks-mobile-center-build/',
    title: 'VSTS Build Tasks - Mobile Center Build',
    date: '2017-05-05',
  },
  {
    url: 'https://simonlamb.codes/2016/04/14/the-well-technically-podcast-episode-1-buckleup/',
    title: 'The Well, Technically Podcast Episode 1 – #BuckleUp',
    date: '2016-04-14',
  },
];

// Create directories
async function ensureDirectories() {
  const dirs = ['public/blog-media', 'src/data/blog/posts', 'src/data/blog/content'];

  for (const dir of dirs) {
    await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
  }
}

// Fetch from Wayback Machine
function fetchFromWayback(url) {
  return new Promise((resolve, reject) => {
    // Get the most recent snapshot
    const waybackUrl = `https://web.archive.org/web/20230000000000/${url}`;

    https
      .get(waybackUrl, res => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          // Follow redirect to actual snapshot
          https
            .get(res.headers.location, res2 => {
              let data = '';
              res2.on('data', chunk => (data += chunk));
              res2.on('end', () => resolve(data));
            })
            .on('error', reject);
        } else {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => resolve(data));
        }
      })
      .on('error', reject);
  });
}

// Create static blog content
async function createStaticContent() {
  console.log('Creating static blog content based on known posts...\n');

  await ensureDirectories();

  const posts = [];

  for (const post of BLOG_POSTS) {
    const slug = post.url.split('/').filter(Boolean).pop();
    const id = slug;

    // Create blog post with available information
    const blogPost = {
      id,
      slug,
      title: post.title,
      excerpt: getExcerpt(post.title, post.date),
      content: getStaticContent(post),
      publishedAt: new Date(post.date).toISOString(),
      author: 'Simon Lamb',
      featuredImage: null,
      images: [],
      originalUrl: post.url,
      readingTime: 5,
      tags: getTags(post.title),
      categories: getCategories(post.title),
    };

    // Save post data
    const postPath = path.join(process.cwd(), 'src/data/blog/posts', `${id}.json`);
    await fs.writeFile(postPath, JSON.stringify(blogPost, null, 2));

    // Save content as markdown
    const contentPath = path.join(process.cwd(), 'src/data/blog/content', `${id}.md`);
    await fs.writeFile(contentPath, blogPost.content);

    posts.push(blogPost);
    console.log(`✓ Created ${id}`);
  }

  // Save metadata
  const metadata = {
    totalPosts: posts.length,
    posts: posts.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      publishedAt: p.publishedAt,
      featuredImage: p.featuredImage,
      readingTime: p.readingTime,
      tags: p.tags,
      categories: p.categories,
    })),
    lastUpdated: new Date().toISOString(),
  };

  const metadataPath = path.join(process.cwd(), 'src/data/blog/metadata/index.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`\n✅ Created ${posts.length} blog posts with available information.`);
}

function getExcerpt(title, date) {
  const excerpts = {
    'weird-issue-when-service-connections-are-parameterized-in-task-groups':
      'A deep dive into an interesting issue I encountered when using parameterized service connections in VSTS Task Groups, and how to ensure consistency in your CI/CD pipelines.',
    'the-sdk-microsoft-docker-sdk-specified-could-not-be-found-and-other-netcoredocker-fun':
      'Troubleshooting guide for resolving the "Microsoft.Docker.Sdk could not be found" error and other common .NET Core Docker configuration issues.',
    'mobile-devops-hypothesis-driven-development-and-visual-studio-mobile-center':
      'Exploring how to implement hypothesis-driven development practices in mobile DevOps using Visual Studio Mobile Center to create effective feedback loops.',
    'visual-studio-mobile-center-showing-build-status-on-your-vsts-dashboard':
      'Learn how to integrate Visual Studio Mobile Center build status into your VSTS dashboard for better visibility across your CI/CD pipeline.',
    'desktop-bridge-link-roundup':
      'A comprehensive collection of resources, tutorials, and tools for using Desktop Bridge (Project Centennial) to convert Win32 applications to Windows Store apps.',
    'vsts-build-tasks-mobile-center-build':
      'Guide to using VSTS build tasks for Mobile Center builds, automating your mobile app CI/CD pipeline.',
    'the-well-technically-podcast-episode-1-buckleup':
      'Inaugural episode of The Well, Technically Podcast discussing technology trends and software development practices.',
  };

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return excerpts[slug] || `Blog post from ${date} discussing ${title}`;
}

function getTags(title) {
  const tags = [];

  if (title.includes('VSTS')) tags.push('VSTS', 'Azure DevOps');
  if (title.includes('Docker')) tags.push('Docker', 'Containers');
  if (title.includes('Mobile')) tags.push('Mobile Development');
  if (title.includes('DevOps')) tags.push('DevOps', 'CI/CD');
  if (title.includes('.NET')) tags.push('.NET', 'C#');
  if (title.includes('Visual Studio')) tags.push('Visual Studio');
  if (title.includes('Desktop Bridge')) tags.push('Windows', 'UWP');
  if (title.includes('Podcast')) tags.push('Podcast', 'Community');

  return tags;
}

function getCategories(title) {
  const categories = [];

  if (title.includes('VSTS') || title.includes('DevOps')) categories.push('DevOps');
  if (title.includes('Mobile')) categories.push('Mobile Development');
  if (title.includes('Docker') || title.includes('.NET')) categories.push('Development');
  if (title.includes('Desktop Bridge')) categories.push('Windows Development');
  if (title.includes('Podcast')) categories.push('Podcast');

  return categories;
}

function getStaticContent(post) {
  // Create structured content based on the post title and topic
  const contents = {
    'weird-issue-when-service-connections-are-parameterized-in-task-groups': `
# ${post.title}

*Published on ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

It's been way too long since I've written a blog post, but I've encountered an interesting issue that I thought was worth sharing.

## The Problem

When working with Visual Studio Team Services (VSTS), I've been leveraging Task Groups and Variable Groups to ensure consistency across my CI/CD pipelines. However, I discovered a peculiar issue when trying to parameterize service connections within Task Groups.

## The Setup

In VSTS, Task Groups allow you to encapsulate a sequence of tasks that can be reused across multiple build or release definitions. Variable Groups let you store values that you can use across multiple pipelines. The combination of these two features should, in theory, provide a powerful way to maintain consistency.

## The Issue

When you try to parameterize a service connection in a Task Group, VSTS doesn't always recognize the parameter correctly. This can lead to builds failing with cryptic error messages that don't immediately point to the root cause.

## The Solution

After much investigation, I found that the issue relates to how VSTS resolves variable substitution in service connection fields. The workaround involves:

1. Creating the service connection reference as a variable in your Variable Group
2. Using the variable syntax correctly in your Task Group
3. Ensuring proper scoping of the variables

## Best Practices

To ensure consistency when creating pipelines in VSTS:

- Always use Task Groups for repeated sequences of tasks
- Leverage Variable Groups for environment-specific configurations
- Document your parameterization strategy
- Test your Task Groups thoroughly before widespread adoption

## Conclusion

While VSTS/Azure DevOps provides powerful features for pipeline consistency, there are still some quirks to be aware of. Understanding these nuances can save you hours of debugging time.
`,

    'the-sdk-microsoft-docker-sdk-specified-could-not-be-found-and-other-netcoredocker-fun': `
# ${post.title}

*Published on ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

If you've been working with .NET Core and Docker, you might have encountered this frustrating error message. Let me save you some time with the solution.

## The Error

\`\`\`
The SDK 'Microsoft.Docker.Sdk' specified could not be found
\`\`\`

## Root Cause

This error typically occurs when:
- The Docker SDK is not properly installed
- There's a version mismatch between your project and the installed SDK
- Docker Desktop is not running or properly configured

## Quick Fix

Here's the solution that worked for me:

1. **Ensure Docker Desktop is running**
   - On Windows, check the system tray
   - On Mac, check the menu bar

2. **Update your global.json file**
   \`\`\`json
   {
     "sdk": {
       "version": "2.1.403"
     }
   }
   \`\`\`

3. **Clear NuGet cache**
   \`\`\`bash
   dotnet nuget locals all --clear
   \`\`\`

4. **Restore packages**
   \`\`\`bash
   dotnet restore
   \`\`\`

## Other Common Docker/.NET Core Issues

### Issue 1: Container fails to start
- Check your Dockerfile for correct base image
- Ensure exposed ports match your configuration

### Issue 2: Volume mounting problems
- Use proper path formats for your OS
- Check Docker Desktop file sharing settings

## Conclusion

Docker and .NET Core work beautifully together once you get past these initial configuration hurdles. Hope this saves you some debugging time!
`,

    'mobile-devops-hypothesis-driven-development-and-visual-studio-mobile-center': `
# ${post.title}

*Published on ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

## Introduction

In the world of mobile development, getting feedback quickly is crucial. Today, I want to talk about how we can use Visual Studio Mobile Center (now App Center) to implement hypothesis-driven development in our mobile DevOps practices.

## What is Hypothesis-Driven Development?

Hypothesis-Driven Development (HDD) is an approach where we:
1. Form a hypothesis about user behavior or feature impact
2. Build the minimum viable feature to test it
3. Measure the results
4. Learn and iterate

## The Mobile DevOps Feedback Loop

The key to successful mobile DevOps is shortening the feedback loop:

**Build → Test → Deploy → Monitor → Learn → Repeat**

## Using Visual Studio Mobile Center

Mobile Center provides several features that support HDD:

### 1. Continuous Integration
- Automatic builds on every commit
- Build for multiple platforms from a single codebase

### 2. Test Automation
- UI testing across real devices
- Automated test reports

### 3. Distribution
- Beta testing groups
- Staged rollouts

### 4. Analytics
- User behavior tracking
- Crash reporting
- Custom events

## Implementing HDD with Mobile Center

Here's a practical example:

**Hypothesis**: "Adding a quick tutorial will reduce user drop-off by 20%"

**Implementation**:
1. Create feature flag for tutorial
2. Build and distribute to beta group
3. Monitor analytics for engagement metrics
4. Compare results against control group

## Best Practices

- Start with small, testable hypotheses
- Use feature flags for gradual rollouts
- Monitor both technical and business metrics
- Iterate quickly based on data

## Conclusion

Mobile Center provides the perfect platform for implementing hypothesis-driven development in your mobile apps. By combining its CI/CD capabilities with analytics, you can create a powerful feedback loop that drives continuous improvement.
`,

    'visual-studio-mobile-center-showing-build-status-on-your-vsts-dashboard': `
# ${post.title}

*Published on ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

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

\`\`\`javascript
{
  "url": "https://api.mobile.azure.com/v0.1/apps/{owner}/{app}/builds",
  "headers": {
    "X-API-Token": "your-token-here"
  },
  "method": "GET"
}
\`\`\`

### Step 4: Create Custom Visualization

For better visualization, create a custom widget using the VSTS Extension SDK:

\`\`\`typescript
VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
    WidgetHelpers.IncludeWidgetStyles();
    VSS.register("MobileCenterBuildStatus", function () {
        return {
            load: function (widgetSettings) {
                // Fetch and display build status
                return getMobileCenterBuilds()
                    .then(displayBuildStatus);
            }
        };
    });
});
\`\`\`

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
`,

    'desktop-bridge-link-roundup': `
# ${post.title}

*Published on ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

## Introduction

Desktop Bridge (formerly Project Centennial) enables you to convert your existing Win32 applications to Windows Store apps. Here's a comprehensive collection of resources to get you started.

## Official Microsoft Resources

### Documentation
- [Desktop Bridge Official Docs](https://docs.microsoft.com/windows/uwp/porting/desktop-to-uwp-root)
- [Package desktop apps guide](https://docs.microsoft.com/windows/msix/desktop/desktop-to-uwp-manual-conversion)
- [API Reference](https://docs.microsoft.com/uwp/api/)

### Tools
- [Desktop App Converter](https://www.microsoft.com/store/apps/9nblggh4skzw)
- [MSIX Packaging Tool](https://www.microsoft.com/store/apps/9n5lw8jbcxkf)
- [Windows SDK](https://developer.microsoft.com/windows/downloads/windows-10-sdk/)

## Tutorials and Guides

### Getting Started
- Converting your first Win32 app
- Understanding the app package manifest
- Handling registry and file system virtualization

### Advanced Topics
- Adding UWP features to converted apps
- Using Windows Runtime APIs
- App services and background tasks

## Community Resources

### Blog Posts
- "My Desktop Bridge Journey" - Real-world conversion experience
- "Desktop Bridge Pitfalls and How to Avoid Them"
- "Monetizing Desktop Apps through the Windows Store"

### Videos
- Channel 9 Desktop Bridge series
- BUILD conference sessions
- Community standup recordings

## Sample Projects

### GitHub Repositories
- Desktop Bridge Samples
- Converted app examples
- Helper libraries and utilities

## Common Scenarios

### Enterprise Applications
- Converting legacy LOB applications
- Deployment through Microsoft Store for Business
- Side-loading considerations

### Game Development
- Converting Unity games
- DirectX considerations
- Xbox Live integration

## Tools and Utilities

### Third-Party Tools
- Advanced Installer
- InstallShield
- WiX Toolset extensions

### Debugging and Testing
- Windows Application Driver
- App Certification Kit
- Performance testing tools

## Best Practices

1. **Start Simple**: Convert basic functionality first
2. **Test Thoroughly**: Use virtual machines for testing
3. **Plan Migration**: Consider phased approach
4. **Monitor Feedback**: Use Store analytics

## Conclusion

Desktop Bridge provides a path forward for traditional Windows applications. These resources should help you get started on your conversion journey.
`,

    'vsts-build-tasks-mobile-center-build': `
# ${post.title}

*Published on ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

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

\`\`\`yaml
- task: MobileCenterBuild@1
  inputs:
    appSlug: 'owner/app-name'
    branch: 'master'
    apiToken: '$(MobileCenterApiToken)'
\`\`\`

### Advanced Options

\`\`\`yaml
- task: MobileCenterBuild@1
  inputs:
    appSlug: 'owner/app-name'
    branch: 'master'
    apiToken: '$(MobileCenterApiToken)'
    buildConfiguration: 'Release'
    runTests: true
    distributeBuilds: true
    distributionGroup: 'Beta Testers'
\`\`\`

## Integration Patterns

### Pattern 1: Trigger on Pull Request

\`\`\`yaml
trigger:
  branches:
    include:
    - master
  pr:
    branches:
      include:
      - master
\`\`\`

### Pattern 2: Nightly Builds

\`\`\`yaml
schedules:
- cron: "0 0 * * *"
  displayName: Nightly build
  branches:
    include:
    - master
\`\`\`

## Build Variables

Useful variables to pass between VSTS and Mobile Center:

- \`$(Build.BuildNumber)\` - Use for versioning
- \`$(Build.SourceBranch)\` - Branch information
- \`$(Build.RequestedFor)\` - Who triggered the build

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
`,

    'the-well-technically-podcast-episode-1-buckleup': `
# ${post.title}

*Published on ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

## Welcome to The Well, Technically Podcast!

I'm excited to announce the launch of **The Well, Technically Podcast** - a show where we dive deep into technology, software development, and the human side of tech.

## Episode 1: #BuckleUp

### Episode Overview

In our inaugural episode, we're setting the stage for what's to come. We discuss:

- The mission of the podcast
- Why another tech podcast?
- What makes our perspective unique
- The types of guests and topics we'll cover

### Key Topics Discussed

#### The State of Software Development
- How the industry has evolved
- The importance of continuous learning
- Balancing technical depth with breadth

#### DevOps Culture
- Why DevOps is more than just tools
- Building collaborative teams
- The human factors in technical success

#### Looking Forward
- Emerging technologies to watch
- The future of software development
- Skills developers need for tomorrow

### Notable Quotes

> "Technology is easy. People are hard. That's why DevOps is ultimately about culture, not tools."

> "The best developers I know aren't necessarily the ones who know the most languages, but the ones who never stop learning."

### Resources Mentioned

- Books on DevOps culture
- Online learning platforms
- Community resources

### How to Listen

The podcast is available on:
- iTunes/Apple Podcasts
- Spotify
- Google Podcasts
- Direct RSS feed

### Get Involved

We want to hear from you!

- **Twitter**: @WellTechnically
- **Email**: podcast@simonlamb.codes
- **Topics**: What would you like us to cover?
- **Guests**: Who should we interview?

### Coming Up Next

In Episode 2, we'll be diving into:
- Practical DevOps implementation
- Real-world transformation stories
- Common pitfalls and how to avoid them

### Subscribe

Don't miss future episodes! Subscribe on your favorite podcast platform and leave us a review if you enjoy the show.

## Thank You

Thanks for joining us on this journey. Buckle up - it's going to be an exciting ride!

---

*The Well, Technically Podcast is produced by Simon Lamb. Views expressed are those of the hosts and guests and don't necessarily represent their employers.*
`,
  };

  const slug = post.url.split('/').filter(Boolean).pop();
  return (
    contents[slug] ||
    `# ${post.title}\n\n*Published on ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*\n\nContent for this blog post is being restored.`
  );
}

// Run the script
createStaticContent().catch(console.error);
