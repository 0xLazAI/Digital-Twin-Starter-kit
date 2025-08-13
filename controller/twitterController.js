const { initializeTwitterClient } = require('../config/twitter');

const fs = require('fs');
const path = require('path');

// Load character data
const characterData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../character.json'), 'utf8')
);

// alith function with our character 
const alithfunction = async (username = "") => {
  try {
    const { Agent, LLM } = await import('alith');

    const preamble = [
      `You are ${characterData.name}.`,
      characterData.bio?.join(' ') || '',
      characterData.lore ? `Lore: ${characterData.lore.join(' ')}` : '',
      characterData.adjectives ? `Traits: ${characterData.adjectives.join(', ')}` : '',
      characterData.style?.post ? `Style for posts: ${characterData.style.post.join(' ')}` : '',
    ].filter(Boolean).join('\n');

    const model = LLM.from_model_name(process.env.LLM_MODEL || 'gpt-4o-mini');
    const agent = Agent.new('twitter_agent', model).preamble(preamble);

    const prompt = [
      `Write one tweet in ${characterData.name}'s voice.`,
      username ? `Optionally greet @${username}.` : '',
      `<=240 chars, no code blocks, hashtags only if essential.`
    ].join(' ');

    const chat = agent.chat();
    const result = await chat.user(prompt).complete();
    const text = (result?.content || '').toString().trim();

    if (!text) throw new Error('Empty tweet from agent');
    return text.slice(0, 240);
  } catch (err) {
    // Fallback to examples if Alith/model is unavailable
    const examples = characterData.postExamples || [];
    const base = examples[Math.floor(Math.random() * examples.length)] || 'Hello from my agent!';
    return username ? `${base} @${username}`.slice(0, 240) : base.slice(0, 240);
  }
};

const generateQuirkyMessage = async (username) => {
  return await alithfunction(username);
};

let twitterClient = null;

// New function for cron job - posts tweet without requiring request/response
const postTweetCron = async () => {
  try {
    console.log('Cron job: Starting tweet posting...');

    // Initialize Twitter client if not already initialized
    if (!twitterClient) {
      console.log('Cron job: Initializing Twitter client...');
      twitterClient = await initializeTwitterClient();
    }

    // Generate message for cron job (you can customize this)
    const message = await generateQuirkyMessage('cron');
    
    console.log('Cron job: Posting tweet with message:', message);

    // Send the tweet
    const tweetResult = await twitterClient.sendTweet(message);
    console.log('Cron job: Tweet result:', tweetResult);

    // Log success
    const tweetId = tweetResult.id || tweetResult.id_str;
    if (tweetId) {
      const tweetUrl = `https://twitter.com/${process.env.TWITTER_USERNAME}/status/${tweetId}`;
      console.log('Cron job: Tweet posted successfully:', tweetUrl);
    } else {
      console.log('Cron job: Tweet posted but no ID received');
    }

    return { success: true, message: 'Tweet posted via cron job' };

  } catch (error) {
    console.error('Cron job: Error in postTweetCron:', error);
    
    if (error.message.includes('authentication')) {
      twitterClient = null;
    }
    
    throw error;
  }
};

const postTweet = async (req, res) => {
  console.log('Received request body:', req.body);

  try {
    const { username, address } = req.body;

    console.log('Processing username:', username);

    // Initialize Twitter client if not already initialized
    if (!twitterClient) {
      console.log('Initializing Twitter client...');
      twitterClient = await initializeTwitterClient();
    }

    // Remove @ symbol if included
    const cleanUsername = username.replace('@', '');
    const message = await generateQuirkyMessage(cleanUsername);

    console.log('Posting tweet with message:', message);

    try {
      // Send the tweet
      const tweetResult = await twitterClient.sendTweet(message);
      console.log('Tweet result:', tweetResult);

      // Instead of fetching tweet details again, construct URL from the initial response
      // Most Twitter API responses include either an id or id_str field
      const tweetId = tweetResult.id || tweetResult.id_str;
      console.log(tweetId)
      
      if (!tweetId) {
        console.log('Tweet posted but no ID received:', tweetResult);
        return res.status(200).json({
          success: true,
          message: 'Tweet posted successfully',
          tweetUrl: `https://twitter.com/${process.env.TWITTER_USERNAME}/`, // Fallback URL
          tweetText: message,
          updatedScore: 0
        });
      }

      const tweetUrl = `https://twitter.com/${process.env.TWITTER_USERNAME}/status/${tweetId}`;
      console.log('Constructed tweet URL:', tweetUrl);

      return res.status(200).json({
        success: true,
        message: 'Tweet posted successfully',
        tweetUrl,
        tweetText: message,
        updatedScore: 0
      });

    } catch (tweetError) {
      console.error('Error with tweet operation:', tweetError);
      throw tweetError;
    }

  } catch (error) {
    console.error('Error in postTweet:', error);
    
    if (error.message.includes('authentication')) {
      twitterClient = null;
    }

    return res.status(500).json({
      error: 'Failed to post tweet',
      details: error.message
    });
  }
};



module.exports = {
  postTweet,
  postTweetCron

};
