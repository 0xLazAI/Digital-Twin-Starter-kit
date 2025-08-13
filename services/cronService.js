const cron = require('node-cron');
const { postTweetCron } = require('../controller/twitterController');

class CronService {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('Cron service is already running');
      return;
    }

    console.log('Starting cron service...');
    
    // Schedule tweet posting every 1 minute
    cron.schedule('* * * * *', async () => {
      console.log('Cron job triggered: Posting tweet...');
      try {
        await postTweetCron();
        console.log('Tweet posted successfully via cron job');
      } catch (error) {
        console.error('Error in cron job tweet posting:', error);
      }
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    this.isRunning = true;
    console.log('Cron service started successfully. Tweets will be posted every minute.');
  }

  stop() {
    if (!this.isRunning) {
      console.log('Cron service is not running');
      return;
    }

    console.log('Stopping cron service...');
    cron.getTasks().forEach(task => task.stop());
    this.isRunning = false;
    console.log('Cron service stopped');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.isRunning ? 'Every minute' : 'Not scheduled'
    };
  }
}

module.exports = CronService; 