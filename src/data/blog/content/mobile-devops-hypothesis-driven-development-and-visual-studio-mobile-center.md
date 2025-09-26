# Mobile DevOps – Hypothesis Driven Development and Visual Studio Mobile Center

_Published on August 7, 2017_

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
