import { Agent } from "alith";
import { Client, ChainConfig } from 'alith/lazai';
import { readFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { config } from 'dotenv';

// Load environment variables
config();

// Load character data
const characterData = JSON.parse(readFileSync('./character.json', 'utf8'));

// Create comprehensive preamble from character data
function createPreamble(character: any): string {
  const bio = character.bio.join(' ');
  const lore = character.lore.join(' ');
  const adjectives = character.adjectives.join(', ');
  const topics = character.topics.join(', ');
  
  const styleAll = character.style.all.join(' ');
  const styleChat = character.style.chat.join(' ');
  const stylePost = character.style.post.join(' ');
  
  const messageExamples = character.messageExamples.map((example: any[]) => 
    example.map(msg => `${msg.user}: ${msg.content.text}`).join('\n')
  ).join('\n\n');
  
  const postExamples = character.postExamples.join('\n');

  return `You are a digital twin based on the character data provided. Here's everything about you:

BIOGRAPHY:
${bio}

KEY FACTS & ACHIEVEMENTS:
${lore}

PERSONALITY TRAITS:
${adjectives}

INTERESTS & EXPERTISE:
${topics}

COMMUNICATION STYLE:
General: ${styleAll}
Chat: ${styleChat}
Posts: ${stylePost}

CONVERSATION EXAMPLES:
${messageExamples}

POST EXAMPLES:
${postExamples}

IMPORTANT INSTRUCTIONS:
- Always respond in character based on the provided data
- Use the communication style specified above
- Be authentic to the personality traits described
- Reference the achievements and facts mentioned
- Maintain the tone and style from the conversation examples
- Be engaging and true to your character
- Use the language patterns and expressions from the examples

Remember: You are a digital representation of the character described in the data above. Stay true to their personality, achievements, and communication style!`;
}

// Create readline interface for terminal interaction
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize LazAI client and agent
let agent: Agent;
let client: Client | null = null;

async function initializeAgent() {
  console.log('🔄 Starting agent initialization...');
  const privateKey = process.env.PRIVATE_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  console.log('🔍 Environment check:');
  console.log('- PRIVATE_KEY set:', !!privateKey);
  console.log('- OPENAI_API_KEY set:', !!openaiApiKey);
  console.log('- dat-config.json exists:', existsSync('./dat-config.json'));
  
  if (privateKey && existsSync('./dat-config.json')) {
    try {
      // Use LazAI inference with DAT
      console.log('🔄 Initializing LazAI inference with DAT...');
      
      const datConfig = JSON.parse(readFileSync('./dat-config.json', 'utf8'));
      client = new Client(ChainConfig.testnet(), undefined, privateKey);
      
      const nodeAddress = process.env.INFERENCE_NODE_ADDRESS || datConfig.nodeAddress;
      const fileId = BigInt(datConfig.characterFileId);
      
      const nodeInfo = await client.getInferenceNode(nodeAddress);
      const url = nodeInfo.url;
      
      agent = new Agent({
        baseUrl: `${url}/v1`,
        model: "gpt-3.5-turbo",
        extraHeaders: await client.getRequestHeaders(nodeAddress, fileId),
        preamble: createPreamble(characterData),
      });
      
      console.log('✅ LazAI inference initialized successfully');
    } catch (error) {
      console.warn('⚠️ Failed to initialize LazAI inference, falling back to OpenAI:');
      console.error('Error details:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Stack trace:', error.stack);
      }
      // Fallback to OpenAI
      agent = new Agent({
        model: "gpt-4",
        preamble: createPreamble(characterData),
      });
    }
  } else if (openaiApiKey) {
    // Fallback to OpenAI
    console.log('🔄 Initializing OpenAI agent...');
    agent = new Agent({
      model: "gpt-4",
      preamble: createPreamble(characterData),
    });
    console.log('✅ OpenAI agent initialized successfully');
  } else {
    throw new Error('No valid API configuration found. Please set PRIVATE_KEY for LazAI or OPENAI_API_KEY for OpenAI.');
  }
}

// Digital Twin class using Alith
class DigitalTwin {
  private conversationHistory: Array<{user: string, twin: string}> = [];

  // Start the conversation
  async startConversation() {
    console.log('\n🤖 Digital Twin Activated! 🤖\n');
    console.log('=' .repeat(50));
    console.log('👋 Hey! I\'m your digital twin!');
    console.log('💬 Let\'s chat about anything!');
    console.log('📝 Type "exit" to end the conversation');
    console.log('=' .repeat(50) + '\n');

    try {
      // Initialize the agent before starting conversation
      console.log('🔄 About to initialize agent...');
      await initializeAgent();
      console.log('✅ Agent initialization completed');
      this.askQuestion();
    } catch (error) {
      console.error('❌ Error during agent initialization:', error);
      this.askQuestion();
    }
  }

  private async askQuestion() {
    rl.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('\n👋 Thanks for chatting! See you next time! 🚀');
        rl.close();
        return;
      }

      try {
        const response = await agent.prompt(input);
        console.log(`\nDigital Twin: ${response}\n`);
        
        // Store conversation
        this.conversationHistory.push({user: input, twin: response});
        
        this.askQuestion();
      } catch (error) {
        console.log('\n❌ Error: Failed to get response.');
        if (client) {
          console.log('LazAI inference error. Check your PRIVATE_KEY and network connection.\n');
        } else {
          console.log('OpenAI API error. Make sure you have set your API key.\n');
          console.log('Set your API key with: export OPENAI_API_KEY="your-api-key"\n');
        }
        this.askQuestion();
      }
    });
  }
}

// Initialize and start the digital twin
const digitalTwin = new DigitalTwin();
digitalTwin.startConversation().catch((error) => {
  console.error('❌ Error starting digital twin:', error);
  process.exit(1);
});