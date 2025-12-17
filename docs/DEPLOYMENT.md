# Cloud Foundry Deployment Guide

## Prerequisites

- Cloud Foundry CLI installed (`cf` command)
- Access to SAP BTP Cloud Foundry environment
- SAP CRM API credentials

## Deployment Steps

### 1. Login to Cloud Foundry

```bash
cf login -a https://api.cf.your-region.hana.ondemand.com
```

Enter your credentials when prompted.

### 2. Target Your Org and Space

```bash
cf target -o your-org -s your-space
```

### 3. Build the Application

```bash
npm install
npm run build
```

This will:
- Install frontend dependencies
- Install server dependencies (via postinstall)
- Build the Vue app to `dist/` directory

### 4. Set Environment Variables

Set your CRM API credentials as environment variables (these will not be in the code):

```bash
cf set-env vue-crm-app CRM_BASE_URL "https://your-tenant.crm.cloud.sap"
cf set-env vue-crm-app CRM_USERNAME "your-username"
cf set-env vue-crm-app CRM_PASSWORD "your-password"
```

### 5. Deploy the Application

```bash
cf push
```

This will:
- Upload the application to Cloud Foundry
- Use the nodejs buildpack (detected from package.json)
- Run `npm install` in the cloud
- Start the server with `npm start`

### 6. Verify Deployment

```bash
cf apps
```

You should see your app with status "running".

Get the application URL:

```bash
cf app vue-crm-app
```

### 7. View Logs

```bash
cf logs vue-crm-app --recent
```

Or stream logs in real-time:

```bash
cf logs vue-crm-app
```

## Application Architecture on Cloud Foundry

```
┌─────────────────────────────────────────┐
│     Cloud Foundry Container             │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Express Server (Port 8080)       │ │
│  │                                   │ │
│  │  - Serves /dist/ static files     │ │
│  │  - Proxies /api/* to CRM API      │ │
│  │  - Handles Basic Auth to CRM      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Environment Variables (Secure):        │
│  - CRM_BASE_URL                         │
│  - CRM_USERNAME                         │
│  - CRM_PASSWORD                         │
└─────────────────────────────────────────┘
         │
         │ HTTPS (Basic Auth)
         ▼
┌─────────────────────────────────────────┐
│  SAP Sales & Service Cloud V2 API      │
│  https://your-tenant.crm.cloud.sap     │
└─────────────────────────────────────────┘
```

## Updating Environment Variables

After deployment, you can update environment variables without redeploying:

```bash
cf set-env vue-crm-app CRM_PASSWORD "NewPassword"
cf restage vue-crm-app
```

## Scaling the Application

Increase memory if needed:

```bash
cf scale vue-crm-app -m 512M
```

Add more instances for high availability:

```bash
cf scale vue-crm-app -i 2
```

## Troubleshooting

### App Crashes on Startup

Check logs:
```bash
cf logs vue-crm-app --recent
```

Common issues:
- Missing environment variables
- Incorrect CRM API credentials
- Port binding issues (Cloud Foundry uses PORT environment variable)

### Update Server to Use Cloud Foundry PORT

The Express server already uses `process.env.PORT` which Cloud Foundry sets automatically.

### API Connection Issues

Verify environment variables are set:
```bash
cf env vue-crm-app
```

Test the health endpoint:
```bash
curl https://your-app-url.cfapps.your-region.hana.ondemand.com/health
```

## Undeploying

To remove the application:

```bash
cf delete vue-crm-app
```

## Security Best Practices

1. **Never commit credentials** - Always use Cloud Foundry environment variables
2. **Use HTTPS** - Cloud Foundry routes are HTTPS by default
3. **Rotate credentials regularly** - Update via `cf set-env`
4. **Restrict access** - Use SAP BTP role collections to control who can access the app
5. **Monitor logs** - Regularly check for unauthorized access attempts

## Cost Optimization

- Use minimal memory allocation (256M is sufficient for this app)
- Stop the app when not in use: `cf stop vue-crm-app`
- Start when needed: `cf start vue-crm-app`

## CI/CD Integration

For automated deployments, create a `deploy.sh` script:

```bash
#!/bin/bash
set -e

echo "Building application..."
npm install
npm run build

echo "Deploying to Cloud Foundry..."
cf login -a $CF_API -u $CF_USER -p $CF_PASSWORD -o $CF_ORG -s $CF_SPACE

cf push

echo "Deployment complete!"
```

Set CI/CD environment variables:
- `CF_API`: Cloud Foundry API endpoint
- `CF_USER`: Username
- `CF_PASSWORD`: Password
- `CF_ORG`: Organization
- `CF_SPACE`: Space
