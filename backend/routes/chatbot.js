const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

// Initialize OpenAI (you'll need to add your API key)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// For demo purposes, we'll use a mock response system
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
  'climate action': 'Singapore has committed to net-zero emissions by 2050. The Green Plan 2030 outlines strategies for sustainable development. You can participate by supporting green initiatives, reducing your carbon footprint, and staying informed about climate policies.'
};

// Get chatbot response
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // For demo purposes, we'll use mock responses
    // In production, you would use OpenAI API
    let response = 'I\'m here to help you with climate and environmental questions related to Singapore. Please ask me about topics like climate change, carbon footprint, recycling, sustainable living, or any other environmental concerns.';

    const lowerMessage = message.toLowerCase();
    
    // Check for keywords in the message
    for (const [keyword, mockResponse] of Object.entries(mockResponses)) {
      if (lowerMessage.includes(keyword)) {
        response = mockResponse;
        break;
      }
    }

    // If no specific keyword found, provide a general response
    if (response === 'I\'m here to help you with climate and environmental questions related to Singapore. Please ask me about topics like climate change, carbon footprint, recycling, sustainable living, or any other environmental concerns.') {
      response = `I understand you're asking about "${message}". While I don't have a specific response for that, I can help you with topics like climate change, carbon footprint, recycling, sustainable living, green energy, plastic waste, public transport, local food, energy conservation, water conservation, biodiversity, air pollution, waste reduction, green buildings, electric vehicles, and climate action in Singapore. What would you like to know more about?`;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      response,
      message: req.body.message
    });

    /* 
    // Uncomment this section when you have OpenAI API key
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful climate and environmental assistant focused on Singapore. Provide accurate, helpful information about climate change, sustainability, environmental policies, and green initiatives in Singapore. Keep responses concise and practical."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    res.json({
      success: true,
      response: completion.choices[0].message.content,
      message: req.body.message
    });
    */

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to get response',
      fallback: 'I\'m sorry, I\'m having trouble responding right now. Please try asking about climate change, carbon footprint, recycling, or sustainable living in Singapore.'
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
    model: 'demo-mode', // or 'gpt-3.5-turbo' when using OpenAI
    features: [
      'Climate and environmental Q&A',
      'Singapore-specific information',
      'Real-time responses',
      'Topic suggestions'
    ]
  });
});

module.exports = router; 