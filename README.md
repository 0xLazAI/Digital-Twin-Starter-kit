# LazAI Digital Twin 🤖

A TypeScript-based digital twin application that creates AI-powered conversational experiences based on custom character data. This interactive chatbot uses the Alith library and LazAI network to create personalized digital twins with enhanced privacy and decentralization.

## 🚀 Features

- **Interactive Chat Interface**: Terminal-based conversation with your digital twin
- **Personality-Driven Responses**: AI responses based on custom character data, achievements, and communication style
- **Customizable Characters**: Easy to create digital twins for any personality or role
- **TypeScript Support**: Full TypeScript implementation with proper type definitions
- **Character Customization**: Easy to modify personality traits and responses via `character.json`
- **Data Anchoring Token (DAT)**: Character data minted as DAT on LazAI network for decentralized storage
- **LazAI Inference**: Uses LazAI's private data inference for enhanced privacy and decentralization
- **Fallback Support**: Automatic fallback to OpenAI if LazAI is unavailable

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Wallet Private Key** (for LazAI DAT minting and inference)
- **IPFS JWT Token** (Pinata or compatible IPFS service)
- **OpenAI API Key** (fallback option)

## 🛠️ Installation

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/0xLazAI/Digital-Twin-Starter-kit
   cd Digital-Twin-Starter-kit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment variables**
   
   Copy the example environment file:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```bash
   # LazAI Configuration
   PRIVATE_KEY=0x_your_wallet_private_key_here
   IPFS_JWT=your_pinata_ipfs_jwt_here
   
   # OpenAI Configuration (fallback)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # LazAI Inference Node (optional)
   INFERENCE_NODE_ADDRESS=0xc3e98E8A9aACFc9ff7578C2F3BA48CA4477Ecf49
   ```
   
   Or export them in your shell:
   ```bash
   export PRIVATE_KEY="0x_your_wallet_private_key_here"
   export IPFS_JWT="your_pinata_ipfs_jwt_here"
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

## 🏃‍♂️ Running the Application

### Step 1: Mint Character Data as DAT (First Time Only)
```bash
npm run mint-dat
```
This will:
1. Encrypt your `character.json` data
2. Upload it to IPFS
3. Register it with LazAI network
4. Request proof and mint as DAT
5. Save configuration for inference

### Step 2: Run the Digital Twin
```bash
npm run dev
```
This command will:
1. Compile TypeScript to JavaScript
2. Initialize LazAI inference (or fallback to OpenAI)
3. Start the digital twin conversation

### Production Mode
```bash
npm run build
npm start
```

### Manual Compilation
```bash
npm run build
node index.js
```

## 🎯 Usage

1. **Create your character** by editing `character.json` (see Character Customization above)
2. **Mint your character data** as DAT: `npm run mint-dat`
3. **Start the digital twin**: `npm run dev`
4. **Chat with your digital twin** and type "exit" to end

### Example Conversation
```
🤖 Digital Twin Activated! 🤖

==================================================
👋 Hey! I'm your digital twin!
💬 Let's chat about anything!
📝 Type "exit" to end the conversation
==================================================

You: Tell me about yourself
Digital Twin: [Response based on your character data]

You: exit
👋 Thanks for chatting! See you next time! 🚀
```

## 📁 Project Structure

```
Digital-Twin-Starter-kit/
├── index.ts              # Main application file with LazAI inference
├── mint-dat.ts           # DAT minting script for character data
├── character.json        # Your character data and personality traits
├── character.example.json # Example character template
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── env.example           # Environment variables template
├── dat-config.json       # DAT configuration (generated after minting)
├── proof_request.json    # Proof request data (generated after minting)
├── dist/                 # Compiled JavaScript files
├── llm_logs/             # API call logs
└── README.md             # This file
```

## ⚙️ Configuration

### Character Customization

#### Creating Your Own Character

1. **Copy the example template:**
   ```bash
   cp character.example.json character.json
   ```

2. **Edit `character.json` with your character data:**
   - **bio**: Background information about your character
   - **lore**: Key achievements and important facts
   - **adjectives**: Personality traits that describe them
   - **topics**: Areas of expertise and interests
   - **style**: Communication preferences and tone
   - **messageExamples**: Sample conversations showing their personality
   - **postExamples**: Sample social media posts or content

#### Character Data Structure

```json
{
  "bio": [
    "Character's background and personal information",
    "Where they're from and what they do",
    "Current role or profession"
  ],
  "lore": [
    "Key achievements and accomplishments",
    "Important milestones and experiences",
    "Notable skills and expertise"
  ],
  "adjectives": [
    "personality", "traits", "that", "describe", "them"
  ],
  "topics": [
    "areas", "of", "interest", "and", "expertise"
  ],
  "style": {
    "all": ["General communication preferences"],
    "chat": ["How they talk in conversations"],
    "post": ["How they write posts or content"]
  },
  "messageExamples": [
    [
      {
        "user": "Example question",
        "content": {
          "text": "Example response showing their personality"
        }
      }
    ]
  ],
  "postExamples": [
    "Example social media post 1",
    "Example social media post 2"
  ]
}
```

### TypeScript Configuration
The project uses a modern TypeScript configuration in `tsconfig.json` with:
- ES modules support
- Strict type checking
- Source maps for debugging
- Declaration files generation

## 🔧 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm run dev` - Build and run in one command
- `npm run mint-dat` - Mint character.json as DAT on LazAI network
- `npm test` - Run tests (placeholder)

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module 'alith'"**
   ```bash
   npm install
   ```

2. **"Error: Failed to get response"**
   - For LazAI: Check your PRIVATE_KEY and network connection
   - For OpenAI: Set OPENAI_API_KEY="your-api-key"

3. **"PRIVATE_KEY environment variable is required"**
   ```bash
   export PRIVATE_KEY="0x_your_wallet_private_key_here"
   ```

4. **"IPFS_JWT environment variable not set"**
   ```bash
   export IPFS_JWT="your_pinata_ipfs_jwt_here"
   ```

5. **TypeScript compilation errors**
   ```bash
   npm run build
   # Check the error messages and fix any type issues
   ```

6. **Permission denied errors**
   ```bash
   chmod +x index.js
   ```

7. **DAT minting fails**
   - Ensure your wallet has testnet funds
   - Check your IPFS_JWT is valid
   - Verify network connectivity

## 📚 Dependencies

### Production Dependencies
- **alith**: AI conversation library for creating digital twins
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable loader
- **node-rsa**: RSA encryption for DAT security

### Development Dependencies
- **typescript**: TypeScript compiler
- **@types/node**: Node.js type definitions
- **@types/json-schema**: JSON Schema type definitions
- **@types/node-rsa**: RSA encryption type definitions
- **ts-node**: TypeScript execution for Node.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - see package.json for details
