# How I ensure consistency when creating pipelines in VSTS using Task Groups and Variable Groups

_Published on June 8, 2018_

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
