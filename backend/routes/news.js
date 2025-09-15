const express = require('express');
const Parser = require('rss-parser');
const router = express.Router();

const parser = new Parser();

// Keywords specifically for climate, carbon, and nature-related content only

const localNewsKeywords = [
  'singapore', 'sg', 'nea', 'hdb', 'ntu', 'nus',
  'straits times', 'channel newsasia', 'cna',
  'singapore green plan', 'zero waste sg'
];
const climateEnvironmentKeywords = [
  // Direct climate and carbon terms
  'climate change', 'global warming', 'greenhouse gas', 'carbon emission', 'carbon footprint', 
  'carbon neutral', 'carbon tax', 'co2', 'carbon dioxide', 'methane emission',
  
  // Energy and sustainability (climate-related only)
  'renewable energy', 'solar power', 'wind energy', 'clean energy', 'green energy',
  'fossil fuel', 'coal', 'oil drilling', 'natural gas', 'energy transition',
  
  // Nature and ecosystems
  'deforestation', 'reforestation', 'biodiversity loss', 'ecosystem', 'wildlife conservation',
  'ocean acidification', 'coral bleaching', 'marine conservation', 'nature reserve',
  'endangered species', 'habitat loss', 'rainforest', 'forest fire', 'wildfire',
  
  // Environmental pollution directly affecting climate/nature
  'plastic pollution', 'ocean plastic', 'microplastics', 'air pollution', 'smog',
  'water pollution', 'oil spill', 'chemical pollution', 'industrial waste',
  
  // Climate policies and agreements
  'paris agreement', 'cop summit', 'climate summit', 'unfccc', 'kyoto protocol',
  'environmental policy', 'green deal', 'net zero', 'carbon pricing',
  
  // Weather and climate phenomena
  'drought', 'flood', 'hurricane', 'typhoon', 'heatwave', 'sea level rise',
  'ice melting', 'glacier', 'polar ice', 'extreme weather',
  
  // Singapore specific climate/environment terms
  'singapore green plan', 'nea singapore', 'national environment agency',
  'zero waste singapore', 'circular economy', 'city in a garden', 'park connector',
  'nature park', 'mangrove', 'singapore sustainability'
];

// Function to check if content is directly climate/nature/carbon-related
// Accepts a third argument: category ('local', 'global', or 'all')
const isEnvironmentRelated = (title, description, category = 'all') => {
  const content = `${title} ${description}`.toLowerCase();

  // Strong exclusion keywords for non-climate content
  const excludeKeywords = [
    // Medical/health (unless directly environmental)
    'surgery', 'medical', 'doctor', 'patient', 'hospital', 'clinic', 'treatment', 'health',
    'cosmetic', 'beauty', 'botox', 'pharmaceutical', 'drug', 'medicine', 'therapy',

    // Sports and entertainment
    'tennis', 'football', 'soccer', 'basketball', 'cricket', 'golf', 'olympics', 'sport',
    'champion', 'tournament', 'match', 'game', 'player', 'team', 'score', 'win', 'defeat',
    'cinema', 'movie', 'film', 'actor', 'actress', 'celebrity', 'music', 'concert',

    // Politics and crime (unless climate-related)
    'election', 'vote', 'political party', 'minister', 'parliament', 'government', 'politician',
    'crime', 'murder', 'theft', 'robbery', 'fraud', 'scam', 'arrest', 'jail', 'prison',
    'court case', 'lawsuit', 'legal', 'judge', 'trial',

    // Technology and business (unless environmental)
    'smartphone', 'app', 'software', 'computer', 'tech company', 'startup', 'ipo',
    'stock market', 'finance', 'banking', 'cryptocurrency', 'bitcoin',

    // Food safety/contamination (unless environmental impact)
    'food poisoning', 'bacteria', 'virus', 'listeria', 'salmonella', 'recall'
  ];

  // Check for exclusion keywords first
  const hasExcludeKeywords = excludeKeywords.some(keyword =>
    content.includes(keyword.toLowerCase())
  );

  if (hasExcludeKeywords) {
    // Even if excluded, allow if it has strong climate connection
    const hasStrongClimateConnection = [
      'climate', 'carbon', 'greenhouse gas', 'global warming', 'paris agreement',
      'renewable energy', 'fossil fuel', 'deforestation', 'biodiversity'
    ].some(keyword => content.includes(keyword.toLowerCase()));

    if (!hasStrongClimateConnection) return false;
  }

  // If filtering for local news, since we're using Singapore-specific RSS feeds,
  // we just need climate-related content (the RSS source ensures it's local)
  if (category === 'local') {
    const hasClimateKeyword = climateEnvironmentKeywords.some(keyword => content.includes(keyword.toLowerCase()));
    return hasClimateKeyword;
  }

  // For global or all, require at least one climateEnvironmentKeyword
  return climateEnvironmentKeywords.some(keyword => content.includes(keyword.toLowerCase()));
};

// RSS feeds for climate and environmental news
const rssFeeds = [
  // Singapore-specific RSS feeds
  {
    name: 'Straits Times - Singapore',
    url: 'https://www.straitstimes.com/news/singapore/rss.xml',
    category: 'local'
  },
  {
    name: 'Channel NewsAsia - Singapore',
    url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml',
    category: 'local'
  },
  {
    name: 'Today Online - Singapore',
    url: 'https://www.todayonline.com/rss.xml',
    category: 'local'
  },
  {
    name: 'Yahoo News Singapore',
    url: 'https://sg.news.yahoo.com/rss',
    category: 'local'
  },
  // Global environmental RSS feeds
  {
    name: 'BBC - Climate',
    url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    category: 'global'
  },
  {
    name: 'The Guardian - Environment',
    url: 'https://www.theguardian.com/uk/environment/rss',
    category: 'global'
  },
  {
    name: 'Climate Home News',
    url: 'https://www.climatechangenews.com/feed/',
    category: 'global'
  }
];

// Get news from RSS feeds
router.get('/', async (req, res) => {
  try {
    const { category = 'all', limit = 20 } = req.query;
    
    let allNews = [];
    
    for (const feed of rssFeeds) {
      if (category === 'all' || feed.category === category) {
        try {
          const feedData = await parser.parseURL(feed.url);
          
          const feedNews = feedData.items
            .filter(item => {
              const title = item.title || '';
              const description = item.contentSnippet || item.content || item.description || '';
              // Filter to show only environment-related content, passing category for proper filtering
              return isEnvironmentRelated(title, description, category);
            })
            .map(item => ({
              title: item.title || 'No title',
              description: item.contentSnippet || item.content || item.description || 'No description available',
              link: item.link || '#',
              pubDate: item.pubDate || new Date().toISOString(),
              source: feed.name,
              category: feed.category,
              image: item.enclosure?.url || null
            }));
          
          allNews = allNews.concat(feedNews);
        } catch (error) {
          console.error(`Error fetching ${feed.name} (${feed.url}):`, error.message);
          // Continue with other feeds even if one fails
        }
      }
    }
    
    // Sort by publication date (newest first)
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    // Limit results
    const limitedNews = allNews.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      news: limitedNews,
      total: allNews.length,
      category,
      sources: rssFeeds.filter(feed => category === 'all' || feed.category === category)
    });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Get news by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;
    
    if (!['local', 'global', 'all'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    let allNews = [];
    
    for (const feed of rssFeeds) {
      if (category === 'all' || feed.category === category) {
        try {
          const feedData = await parser.parseURL(feed.url);
          
          const feedNews = feedData.items
            .filter(item => {
              const title = item.title || '';
              const description = item.contentSnippet || item.content || item.description || '';
              // Filter to show only environment-related content, passing category for proper filtering
              return isEnvironmentRelated(title, description, category);
            })
            .map(item => ({
              title: item.title || 'No title',
              description: item.contentSnippet || item.content || item.description || 'No description available',
              link: item.link || '#',
              pubDate: item.pubDate || new Date().toISOString(),
              source: feed.name,
              category: feed.category,
              image: item.enclosure?.url || null
            }));
          
          allNews = allNews.concat(feedNews);
        } catch (error) {
          console.error(`Error fetching ${feed.name}:`, error);
        }
      }
    }
    
    // Sort by publication date
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    const limitedNews = allNews.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      news: limitedNews,
      total: allNews.length,
      category
    });
  } catch (error) {
    console.error('Category news error:', error);
    res.status(500).json({ error: 'Failed to fetch category news' });
  }
});

// Search news
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    let allNews = [];
    
    for (const feed of rssFeeds) {
      try {
        const feedData = await parser.parseURL(feed.url);
        
        const feedNews = feedData.items
          .filter(item => 
            item.title.toLowerCase().includes(q.toLowerCase()) ||
            (item.contentSnippet && item.contentSnippet.toLowerCase().includes(q.toLowerCase()))
          )
          .map(item => ({
            title: item.title,
            description: item.contentSnippet || item.content,
            link: item.link,
            pubDate: item.pubDate,
            source: feed.name,
            category: feed.category,
            image: item.enclosure?.url || null
          }));
        
        allNews = allNews.concat(feedNews);
      } catch (error) {
        console.error(`Error searching ${feed.name}:`, error);
      }
    }
    
    // Sort by publication date
    allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    const limitedNews = allNews.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      news: limitedNews,
      total: allNews.length,
      query: q
    });
  } catch (error) {
    console.error('News search error:', error);
    res.status(500).json({ error: 'Failed to search news' });
  }
});

// Get available RSS feeds
router.get('/feeds', (req, res) => {
  res.json({
    success: true,
    feeds: rssFeeds
  });
});

module.exports = router; 