const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are ClimateHub, a friendly sustainability assistant for youth in Singapore.

Core rules:
- Be helpful, practical, and honest.
- Never shame the user. No guilt language.
- Focus on realistic, small behaviour changes (AC temperature habits, MRT vs private car, food swaps, etc.).
- When talking about policy, prioritise Singapore examples like the Singapore Green Plan 2030, carbon tax, public transport efficiency, and energy-saving habits in HDBs.
- If a user asks something not directly climate-related (math, life advice, etc.), you MAY answer it. At the end, gently connect back to climate/sustainability if it naturally fits.
- If you're not fully sure about a specific Singapore law, number, or target, say you're not 100% sure and suggest checking NEA or the Ministry of Sustainability and the Environment.

Style:
- Talk like you're explaining to a smart 17–20 year old in Singapore.
- Keep it conversational, specific, and non-judgmental.
- Do not invent super-specific statistics if you aren't sure; describe trends instead.

Formatting:
- Use **bold text** for important terms, titles, and key points.
- When listing multiple points, use numbered lists (1. 2. 3.) or bullet points with clear structure.
- Add line breaks between different sections or topics for better readability.
- Format key initiatives like **City in Nature** or **Green Plan 2030** in bold.
- Use proper paragraph spacing - separate different concepts with blank lines.
`;

const mockResponses = {
  'climate change': 'Climate change refers to long-term shifts in global weather patterns and average temperatures. In Singapore, we\'re experiencing rising temperatures, increased rainfall intensity, and sea level rise. The government has set ambitious targets to reduce emissions and adapt to climate impacts.',
  'carbon footprint': 'Your carbon footprint is the total amount of greenhouse gases (primarily CO2) emitted by your activities. In Singapore, the average person emits about 8.56 tonnes of CO2 per year. You can reduce your footprint by using public transport, eating less meat, and conserving energy.',
  'recycling': 'Singapore has a comprehensive recycling program. You can recycle paper, plastic, glass, and metal at blue recycling bins located throughout the island. The National Environment Agency (NEA) provides detailed guidelines on what can and cannot be recycled.',
  'sustainable living': 'Sustainable living in Singapore includes using public transport, reducing plastic waste, supporting local farmers, and conserving energy. The government offers various incentives for green initiatives, including solar panel installations and electric vehicle purchases.',
  'green energy': 'Singapore is investing heavily in renewable energy, particularly solar power. The SolarNova program aims to deploy 2 gigawatts-peak of solar energy by 2030. You can also consider installing solar panels on your home if conditions permit.',
  'plastic waste': 'Singapore generates about 900,000 tonnes of plastic waste annually. You can reduce plastic waste by using reusable bags, bottles, and containers. Many supermarkets now offer bulk sections where you can bring your own containers.',
  'public transport': 'Singapore\'s public transport system is one of the most efficient in the world. Using MRT and buses instead of private vehicles can significantly reduce your carbon footprint. The government is also expanding the cycling network for greener commuting options.',
  'local food': 'Supporting local farmers reduces food miles and supports Singapore\'s food security. Look for products with the "SG Fresh Produce" label. The government aims to produce 30% of Singapore\'s nutritional needs locally by 2030.',
  'energy conservation': 'Simple ways to conserve energy in Singapore include using energy-efficient appliances, turning off lights when not in use, and setting air conditioning to 25°C. The government offers rebates for energy-efficient appliances.',
  'water conservation': 'Singapore has limited freshwater resources and relies on imported water, desalination, and NEWater. You can conserve water by taking shorter showers, fixing leaks, and using water-efficient appliances.',
  'biodiversity': 'Singapore is home to diverse ecosystems despite its urban nature. The government has set aside nature reserves and parks to protect native species. You can support biodiversity by visiting these areas responsibly and supporting conservation efforts.',
  'air pollution': 'Singapore generally has good air quality, but it can be affected by regional haze. The government monitors air quality and provides real-time updates. You can protect yourself by checking the PSI (Pollutant Standards Index) before outdoor activities.',
  'waste reduction': 'Singapore\'s Zero Waste Masterplan aims to reduce waste sent to landfill by 30% by 2030. You can help by practicing the 3Rs: Reduce, Reuse, Recycle. Consider composting food waste and buying products with minimal packaging.',
  'green buildings': 'Singapore has one of the highest concentrations of green buildings in the world. The Building and Construction Authority (BCA) Green Mark scheme certifies buildings for environmental performance. Many new developments incorporate green features.',
  'electric vehicles': 'Singapore is promoting electric vehicles to reduce emissions. The government offers rebates for electric cars and is expanding charging infrastructure. Consider an electric vehicle for your next car purchase.',
  'climate action': 'Singapore has committed to net-zero emissions by 2050. The Green Plan 2030 outlines strategies for sustainable development. You can participate by supporting green initiatives, reducing your carbon footprint, and staying informed about climate policies.',
  'singapore green plan 2030': 'The **Singapore Green Plan 2030** is a comprehensive roadmap that charts ambitious and concrete targets over the next 10 years, strengthening Singapore\'s commitments under the UN\'s 2030 Sustainable Development Agenda and Paris Agreement.\n\nKey pillars include:\n\n1. **City in Nature**: 1 million more trees by 2030\n2. **Sustainable Living**: Reducing waste by 30%\n3. **Energy Reset**: Deploying 2GWp solar energy\n4. **Green Economy**: Greening 80% of buildings\n5. **Resilient Future**: Coastal protection and food security\n\nThe plan aims to position Singapore as a global city of sustainability.',
  'green plan 2030': 'The **Singapore Green Plan 2030** is a comprehensive roadmap that charts ambitious and concrete targets over the next 10 years, strengthening Singapore\'s commitments under the UN\'s 2030 Sustainable Development Agenda and Paris Agreement.\n\nKey pillars include:\n\n1. **City in Nature**: 1 million more trees by 2030\n2. **Sustainable Living**: Reducing waste by 30%\n3. **Energy Reset**: Deploying 2GWp solar energy\n4. **Green Economy**: Greening 80% of buildings\n5. **Resilient Future**: Coastal protection and food security\n\nThe plan aims to position Singapore as a global city of sustainability.',
  'green plan': 'The **Singapore Green Plan 2030** is a comprehensive roadmap that charts ambitious and concrete targets over the next 10 years, strengthening Singapore\'s commitments under the UN\'s 2030 Sustainable Development Agenda and Paris Agreement.\n\nKey pillars include:\n\n1. **City in Nature**: 1 million more trees by 2030\n2. **Sustainable Living**: Reducing waste by 30%\n3. **Energy Reset**: Deploying 2GWp solar energy\n4. **Green Economy**: Greening 80% of buildings\n5. **Resilient Future**: Coastal protection and food security\n\nThe plan aims to position Singapore as a global city of sustainability.'
};

// Get chatbot response
router.post('/chat', async (req, res) => {
  console.log("💬 /api/chatbot/chat hit");
  console.log("📩 Request headers:", req.headers);
  console.log("📩 Request method:", req.method);
  console.log("🔍 Request body:", JSON.stringify(req.body));
  console.log("🔍 Request URL:", req.url);
  console.log("🔍 Request path:", req.path);

  try {
    console.log("📩 Raw req.body:", req.body);
    console.log("🔑 Key available in handler?", !!process.env.OPENAI_API_KEY);
    console.log("🔑 OpenAI API Key starts with:", process.env.OPENAI_API_KEY?.substring(0, 10) + "...");

    const { message } = req.body || {};
    console.log("🧠 User message:", message);

    if (!message || !message.trim()) {
      console.log("⚠️ No message provided by client.");
      return res.status(400).json({ 
        success: false,
        response: "Please ask a question so I can help 😊",
      });
    }

    // Call OpenAI's chat completion endpoint
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const botReply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "I'm here to help with climate, sustainability, and environmental questions in Singapore.";

    console.log("🤖 OpenAI reply generated OK");

    return res.json({
      success: true,
      response: botReply,
      message: message
    });

  } catch (error) {
    console.log("💥 CATCH BLOCK RUNNING - falling back");
    console.error("❌ Chatbot error:", error?.message);
    console.error("❌ Full error:", error);
    console.error('Request body (in catch):', req.body);
    console.error("❌ OpenAI API Key present?", !!process.env.OPENAI_API_KEY);
    console.error("❌ OpenAI API Key length:", process.env.OPENAI_API_KEY?.length || 0);

    // Check if it's an API key issue
    if (error?.message?.includes('API key') || error?.message?.includes('authentication')) {
      return res.status(500).json({
        success: false,
        response: "I'm having trouble connecting to my AI service. Please check that the OpenAI API key is properly configured.",
        error: "API_KEY_ERROR"
      });
    }

    // Fallback to keyword-based mock responses
    const fallbackQuestion = req.body?.message || "";
    const lowerMessage = fallbackQuestion.toLowerCase();

    let fallbackResponse = "I'm sorry, I'm having trouble responding right now. I can still help with climate, carbon footprint, recycling, public transport, energy saving in Singapore, and daily habit changes.";

    for (const [keyword, mockResponse] of Object.entries(mockResponses)) {
      if (lowerMessage.includes(keyword)) {
        fallbackResponse = mockResponse;
        break;
      }
    }

    return res.status(200).json({
      success: true,
      response: fallbackResponse,
      message: fallbackQuestion,
      note: "fallback-mock",
      error: error?.message
    });
  }
});

// Get available topics
router.get('/topics', (req, res) => {
  const topics = [
    'Climate Change',
    'Carbon Footprint',
    'Recycling',
    'Sustainable Living',
    'Green Energy',
    'Plastic Waste',
    'Public Transport',
    'Local Food',
    'Energy Conservation',
    'Water Conservation',
    'Biodiversity',
    'Air Pollution',
    'Waste Reduction',
    'Green Buildings',
    'Electric Vehicles',
    'Climate Action'
  ];

  res.json({
    success: true,
    topics
  });
});

// Get chatbot status
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'online',
    model: 'gpt-4o-mini', // or 'gpt-3.5-turbo' when using OpenAI
    features: [
      'Climate and environmental Q&A',
      'Singapore-specific information',
      'Real-time responses',
      'Topic suggestions',
      'OpenAI-backed assistant with Singapore context'
    ]
  });
});

module.exports = router;