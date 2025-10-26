
# Janani Digital Twin 🚀

**Janani Digital Twin** is an interactive AI chat system powered by **Groq’s Llama 3.3 model**, designed to simulate conversations with **Janani**, a full-stack developer and LAZAI Ambassador. It supports **Web3 discussions**, **full-stack development queries**, and general mentorship in coding, all from your terminal.  

✨ **Features**
- Conversational AI chat with personality-based responses.
- Powered by **Groq API** (`llama-3.3-70b-versatile`).
- Maintains a chat history within a session.
- Friendly, professional, and emoji-rich responses.
- Fully terminal-based interactive experience.

---

## **Demo**
```bash
💫 Janani Digital Twin is Online 🚀

👩‍💻 Ask me anything about Full Stack, Web3, or LAZAI!
📝 Type 'exit' anytime to end our chat.

You: Hi Janani, how are you?
Janani: Hey ser ✨ I'm doing great! Been diving into some Web3 smart contract basics and helping with LAZAI projects 🚀
````

---

## **Tech Stack**

* **Node.js & TypeScript**
* **Groq AI API** (Llama 3.3)
* **Node-Fetch** for HTTP requests
* **Readline** for terminal interaction
* **dotenv** for environment variables

---

## **Installation**

1. Clone your fork:

```bash
git clone https://github.com/YourUsername/Digital-Twin-Starter-kit.git
cd Digital-Twin-Starter-kit
```

2. Install dependencies:

```bash
npm install node-fetch dotenv
npm install --save-dev @types/node-fetch
```

3. Create a `.env` file in the project root:

```bash
GROQ_API_KEY=your_actual_groq_api_key_here
# LazAI Configuration
   PRIVATE_KEY=0x_your_wallet_private_key_here
   IPFS_JWT=your_pinata_ipfs_jwt_here
 # LazAI Inference Node (optional)
   INFERENCE_NODE_ADDRESS=0xc3e98E8A9aACFc9ff7578C2F3BA48CA4477Ecf49
```

---

## **Usage**

Run the Digital Twin:

```bash
npx ts-node index.ts
```

* Type any question or message to Janani.
* Type `exit` to quit the chat.
* Enjoy interactive conversations with Janani AI.

---

## **Contributing**

We welcome contributions!

1. **Fork the repository**
2. **Create a feature branch**

```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
4. **Test thoroughly**
5. **Commit and push**

```bash
git add .
git commit -m "Describe your changes"
git push origin feature/your-feature-name
```

6. **Submit a Pull Request** to the original repo

---

## **License**

MIT License © 2025 Janani K

---
