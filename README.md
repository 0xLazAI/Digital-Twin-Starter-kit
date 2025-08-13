# Twitter Auto-Posting Backend

This backend service automatically posts tweets every 10 minutes using a cron job system.

## Features

- **Automatic Tweet Posting**: Posts tweets every minute via cron job
- **Manual Tweet Control**: Still maintains the original POST `/api/tweet` endpoint for manual posting
- **Cron Management**: API endpoints to start/stop and check cron service status
- **Twitter Integration**: Uses `agent-twitter-client` for Twitter API operations

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   TWITTER_USERNAME=your_twitter_username
   TWITTER_PASSWORD=your_twitter_password
   TWITTER_EMAIL=your_twitter_email
   PORT=3005
   ```

3. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Cron Job Endpoints

- `GET /api/cron/status` - Check if cron service is running
- `POST /api/cron/start` - Manually start cron service
- `POST /api/cron/stop` - Manually stop cron service

### Tweet Endpoints

- `POST /api/tweet` - Manually post a tweet (original functionality)

## How It Works

1. **Server Startup**: When the server starts, the cron service automatically begins
2. **Automatic Posting**: Every minute, the cron job triggers and posts a tweet
3. **Tweet Content**: The `alithfunction()` in `twitterController.js` generates the tweet content
4. **Error Handling**: If a tweet fails, it logs the error and continues with the next scheduled run

## Customization

### Tweet Content
Modify the `alithfunction()` in `controller/twitterController.js` to customize what gets posted:

```javascript
const alithfunction = () => {
  // Your custom logic here
  return "Your custom tweet content";
};
```

### Cron Schedule
Change the schedule in `services/cronService.js`. Currently set to every minute (`* * * * *`):

- `*/5 * * * *` - Every 5 minutes
- `0 */1 * * *` - Every hour
- `0 9 * * *` - Every day at 9 AM

## Monitoring

The cron service logs all activities:
- When it starts/stops
- When tweets are posted
- Any errors that occur

Check the console output or use the status endpoint to monitor the service.

## Troubleshooting

- **Cron not running**: Check the `/api/cron/status` endpoint
- **Twitter errors**: Verify your Twitter credentials in `.env`
- **Service stops**: The cron service will automatically restart on the next server restart 