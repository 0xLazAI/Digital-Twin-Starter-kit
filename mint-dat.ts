import { config } from 'dotenv'
import { Client, ChainConfig } from 'alith/lazai'
import { PinataIPFS } from 'alith/data/storage'
import { encrypt } from 'alith/data'
import NodeRSA from 'node-rsa'
import axios from 'axios'
import { promises as fs } from 'fs'

// Load environment variables
config()

async function main() {
  try {
    console.log('🚀 Starting DAT minting process...')
    
    // Check for required environment variables
    const privateKey = process.env.PRIVATE_KEY
    const ipfsJwt = process.env.IPFS_JWT
    
    if (!privateKey) {
      throw new Error('PRIVATE_KEY environment variable is required')
    }
    
    if (!ipfsJwt) {
      console.warn('Warning: IPFS_JWT environment variable not set. IPFS operations may fail.')
    }
    
    console.log('🔄 Initializing LazAI client...')
    // Initialize client with private key as third parameter
    const client = new Client(ChainConfig.testnet(), undefined, privateKey)
    console.log('✅ Client initialized successfully')
    
    console.log('🔄 Initializing IPFS client...')
    const ipfs = new PinataIPFS()
    console.log('✅ IPFS client initialized successfully')
    
    // 1. Read and prepare character.json data
    console.log('🔄 Reading character data...')
    const characterData = await fs.readFile('./character.json', 'utf8')
    const dataFileName = 'character-data.json'
    const encryptionSeed = 'Sign to retrieve your encryption key for character data'
    
    console.log('🔄 Encrypting character data...')
    const password = client.getWallet().sign(encryptionSeed).signature
    const encryptedData = await encrypt(Uint8Array.from(characterData), password)
    
    console.log('✅ Character data encrypted successfully')
    
    // 2. Upload the character data to IPFS and get the shared url
    console.log('🔄 Uploading to IPFS...')
    const fileMeta = await ipfs.upload({
      name: dataFileName,
      data: Buffer.from(encryptedData),
      token: ipfsJwt || '',
    })
    console.log('✅ File uploaded to IPFS, getting share link...')
    const url = await ipfs.getShareLink({ token: ipfsJwt || '', id: fileMeta.id })
    
    console.log('✅ Character file uploaded to IPFS:', url)
    
    // 3. Upload the character url to LazAI
    console.log('🔄 Registering with LazAI network...')
    let fileId = await client.getFileIdByUrl(url)
    if (fileId == BigInt(0)) {
      console.log('🔄 Adding new file to LazAI...')
      fileId = await client.addFile(url)
    } else {
      console.log('✅ File already registered with LazAI')
    }
    
    console.log('✅ Character file registered with LazAI, file ID:', fileId.toString())
    
    // 4. Request proof in the verified computing node
    console.log('🔄 Requesting proof from verified computing node...')
    await client.requestProof(fileId, BigInt(100))
    console.log('✅ Proof requested, getting job details...')
    
    const jobIds = await client.fileJobIds(fileId)
    const jobId = jobIds[jobIds.length - 1]
    const job = await client.getJob(jobId)
    const nodeInfo = await client.getNode(job.nodeAddress)
    const nodeUrl = nodeInfo.url
    const pubKey = nodeInfo.publicKey
    
    console.log('🔄 Preparing proof request...')
    const rsa = new NodeRSA(pubKey, 'pkcs1-public-pem')
    const encryptedKey = rsa.encrypt(password, 'hex')
    const proofRequest = {
      job_id: Number(jobId),
      file_id: Number(fileId),
      file_url: url,
      encryption_key: encryptedKey,
      encryption_seed: encryptionSeed,
      nonce: null,
      proof_url: null,
    }

    console.log('✅ Proof request prepared')

    // Write proof request to file
    await fs.writeFile('proof_request.json', JSON.stringify(proofRequest, null, 2))
    console.log('✅ Proof request saved to proof_request.json')
    
    console.log('🔄 Sending proof request to node...')
    const response = await axios.post(`${nodeUrl}/proof`, proofRequest, {
      headers: { 'Content-Type': 'application/json' },
    })
   
    if (response.status === 200) {
      console.log('✅ Proof request sent successfully')
    } else {
      console.log('❌ Failed to send proof request:', response.data)
    }
    
    // 5. Request DAT reward
    console.log('🔄 Requesting DAT reward...')
    await client.requestReward(fileId)
    console.log('✅ Reward requested for file id', fileId.toString())
    
    // 6. Save the file ID for use in the digital twin
    console.log('🔄 Saving DAT configuration...')
    const configData = {
      characterFileId: fileId.toString(),
      characterFileUrl: url,
      encryptionSeed: encryptionSeed,
      nodeAddress: job.nodeAddress
    }
    
    await fs.writeFile('dat-config.json', JSON.stringify(configData, null, 2))
    console.log('✅ DAT configuration saved to dat-config.json')
    
    console.log('\n🎉 Character data successfully minted as DAT!')
    console.log(`📄 File ID: ${fileId.toString()}`)
    console.log(`🔗 IPFS URL: ${url}`)
    console.log(`🌐 Node Address: ${job.nodeAddress}`)
    console.log('\nYou can now run the digital twin with: npm run dev')
    
  } catch (error) {
    console.error('❌ Error in main function:')
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Stack trace:', error.stack)
    } else {
      console.error('Unknown error:', error)
    }
    process.exit(1)
  }
}

// Execute the main function
main().catch((error) => {
  console.error('❌ Unhandled error:')
  if (error instanceof Error) {
    console.error('Error message:', error.message)
    console.error('Stack trace:', error.stack)
  } else {
    console.error('Unknown error:', error)
  }
  process.exit(1)
})
