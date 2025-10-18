# 🚀 Quick Setup Guide

## Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Wallet with testnet funds** - Get testnet ETH from [LazAI faucet](https://docs.lazai.network/)
3. **Pinata IPFS JWT** - [Get free JWT here](https://pinata.cloud/)
4. **OpenAI API Key** (fallback) - [Get API key here](https://platform.openai.com/)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Your Character
```bash
# Copy the example template
cp character.example.json character.json

# Edit character.json with your character data
nano character.json
```

### 3. Set Environment Variables
```bash
# Copy the example file
cp env.example .env

# Edit .env with your credentials
nano .env
```

Required variables:
```bash
PRIVATE_KEY=0x_your_wallet_private_key_here
IPFS_JWT=your_pinata_ipfs_jwt_here
OPENAI_API_KEY=your_openai_api_key_here  # fallback
```

### 4. Mint Character Data as DAT
```bash
npm run mint-dat
```

This will:
- ✅ Encrypt your character.json
- ✅ Upload to IPFS
- ✅ Register with LazAI network
- ✅ Request proof and mint DAT
- ✅ Save configuration

### 5. Run Digital Twin
```bash
npm run dev
```

## What's New? 🆕

- **Custom Characters**: Create digital twins for any personality or role
- **DAT Integration**: Character data is now minted as a Data Anchoring Token
- **LazAI Inference**: Uses decentralized inference instead of direct OpenAI calls
- **Enhanced Privacy**: Character data is encrypted and stored on IPFS
- **Fallback Support**: Automatically falls back to OpenAI if LazAI is unavailable

## Troubleshooting

### Common Issues

**"PRIVATE_KEY environment variable is required"**
- Make sure you've set your wallet private key in `.env`

**"IPFS_JWT environment variable not set"**
- Get a free JWT from Pinata and add it to `.env`

**"Failed to initialize LazAI inference"**
- Check your network connection and wallet balance
- The system will automatically fall back to OpenAI

**DAT minting fails**
- Ensure your wallet has testnet funds
- Verify your IPFS_JWT is valid
- Check network connectivity

## Next Steps

1. **Customize Character**: Edit `character.json` to personalize your digital twin
2. **Re-mint DAT**: Run `npm run mint-dat` after character changes
3. **Deploy**: Use `npm run build && npm start` for production

## Support

- 📚 [LazAI Documentation](https://docs.lazai.network/)
- 🐛 [Report Issues](https://github.com/0xLazAI/Digital-Twin-Starter-kit/issues)
- 💬 [Community Discord](https://discord.gg/lazai)
