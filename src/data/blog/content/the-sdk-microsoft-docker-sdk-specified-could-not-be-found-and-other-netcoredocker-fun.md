# The SDK 'Microsoft.Docker.Sdk' specified could not be found and other .NET Core/Docker fun

_Published on November 7, 2017_

If you've been working with .NET Core and Docker, you might have encountered this frustrating error message. Let me save you some time with the solution.

## The Error

```
The SDK 'Microsoft.Docker.Sdk' specified could not be found
```

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

   ```json
   {
     "sdk": {
       "version": "2.1.403"
     }
   }
   ```

3. **Clear NuGet cache**

   ```bash
   dotnet nuget locals all --clear
   ```

4. **Restore packages**
   ```bash
   dotnet restore
   ```

## Other Common Docker/.NET Core Issues

### Issue 1: Container fails to start

- Check your Dockerfile for correct base image
- Ensure exposed ports match your configuration

### Issue 2: Volume mounting problems

- Use proper path formats for your OS
- Check Docker Desktop file sharing settings

## Conclusion

Docker and .NET Core work beautifully together once you get past these initial configuration hurdles. Hope this saves you some debugging time!
