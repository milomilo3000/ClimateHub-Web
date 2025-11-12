// Test script to verify OpenAI API key works
const https = require('https');

// Get API key from environment or prompt user to set it
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';

if (OPENAI_API_KEY === 'your-api-key-here') {
  console.log('❌ Please set your OPENAI_API_KEY environment variable');
  console.log('   Example: OPENAI_API_KEY=sk-proj-... node test-openai-key.js');
  process.exit(1);
}

console.log('🧪 Testing OpenAI API Key...');
console.log('🔑 Key starts with:', OPENAI_API_KEY.substring(0, 10) + '...');

const data = JSON.stringify({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system", 
      content: "You are a helpful assistant. Respond briefly."
    },
    {
      role: "user", 
      content: "What is the Singapore Green Plan 2030?"
    }
  ],
  max_tokens: 100,
  temperature: 0.7
});

const options = {
  hostname: 'api.openai.com',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const json = JSON.parse(responseData);
      
      if (res.statusCode === 200) {
        console.log('✅ OpenAI API Key is VALID!');
        console.log('📝 Response:', json.choices[0].message.content.substring(0, 200) + '...');
        console.log('💰 Usage:', json.usage);
      } else {
        console.log('❌ OpenAI API Error:');
        console.log('   Status:', res.statusCode);
        console.log('   Error:', json.error?.message || 'Unknown error');
        
        if (res.statusCode === 401) {
          console.log('🔧 Fix: Check your API key is correct');
        } else if (res.statusCode === 429) {
          console.log('🔧 Fix: Add credits to your OpenAI account');
        }
      }
    } catch (e) {
      console.log('❌ Invalid JSON response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Network Error:', error.message);
});

req.write(data);
req.end();

