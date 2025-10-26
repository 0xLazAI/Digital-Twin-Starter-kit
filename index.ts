import fetch from "node-fetch";
import "dotenv/config";
import readline from "readline";

// ✅ Load Groq API Key from .env
const GROQ_API_KEY = process.env.GROQ_API_KEY || "your_groq_api_key_here";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatHistory {
  user: string;
  janani: string;
}

interface GroqResponseChoice {
  message?: {
    content?: string;
  };
}

interface GroqResponse {
  choices?: GroqResponseChoice[];
}

// ✅ Personality / Context of Digital Twin
function createPreamble(character: string): string {
  return `
You are ${character}, a full stack developer and LAZAI Ambassador 👩‍💻.
You are an intermediate Web3 learner with strong enthusiasm for coding, 
innovation, and building modern projects. You love mentoring peers, exploring 
AI, blockchain, and creating beautiful digital experiences.

💫 Personality:
- Friendly, humble, confident, and tech-savvy.
- Uses emojis like ✨🚀💻🌐🔥🌸.
- Encourages others to learn, collaborate, and keep building.
- Explains code and ideas clearly with positive energy.

🎯 Communication Style:
- Conversational and natural.
- Uses a mix of casual tone and professional clarity.
- Reflects excitement when discussing tech, development, or LAZAI initiatives.

When chatting, always reply as Janani — not as an AI.
Keep responses short, creative, and realistic, as if you’re talking with a developer friend.
`;
}

// ✅ Function to ask Groq and get response
async function askGroq(userInput: string, character = "Janani"): Promise<string> {
  const messages: Message[] = [
    { role: "system", content: createPreamble(character) },
    { role: "user", content: userInput },
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // ✅ latest working model
        messages,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Groq API Error: ${response.status} - ${text}`);
    }

    const data = (await response.json()) as GroqResponse;
    const reply = data?.choices?.[0]?.message?.content || "No response from Groq model.";
    return reply.trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error talking to Groq:", error.message);
    } else {
      console.error("❌ Unknown error:", error);
    }
    return "Sorry, I encountered an issue while processing your request.";
  }
}

// ✅ Digital Twin Chat Class
class JananiDigitalTwin {
  private character: string;
  private history: ChatHistory[];
  private rl: readline.Interface;

  constructor(character: string) {
    this.character = character;
    this.history = [];
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // Start the chat loop
  async startConversation() {
    console.log("\n💫 Janani Digital Twin is Online 🚀\n");
    console.log("👩‍💻 Ask me anything about Full Stack, Web3, or LAZAI!");
    console.log("📝 Type 'exit' anytime to end our chat.\n");
    this.promptUser();
  }

  // Ask user for input
  private promptUser() {
    this.rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        console.log("\n👋 Janani: Bye ser! Keep learning and coding beautifully ✨💻\n");
        this.rl.close();
        return;
      }

      const reply = await askGroq(input, this.character);
      console.log(`\nJanani: ${reply}\n`);
      this.history.push({ user: input, janani: reply });

      // Continue chatting
      this.promptUser();
    });
  }
}

// ✅ Start Digital Twin
(async () => {
  const twin = new JananiDigitalTwin("Janani");
  await twin.startConversation();
})();
