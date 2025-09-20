const ApolloLinkedInAgent = require('../src/apollo-client');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Apollo API key not configured' 
      });
    }

    const {
      keywords = 'graduate OR student OR international OR visa OR OPT OR F1 OR H1B OR recent graduate OR new graduate',
      location = 'United States',
      seniority = ['entry', 'junior'],
      titles = ['software engineer', 'developer', 'analyst', 'associate', 'intern', 'graduate', 'new grad'],
      limit = 25
    } = req.body;

    const agent = new ApolloLinkedInAgent(apiKey);
    
    const searchOptions = {
      keywords,
      location,
      seniority: Array.isArray(seniority) ? seniority : seniority.split(','),
      titles: Array.isArray(titles) ? titles : titles.split(',').map(t => t.trim()),
      limit: parseInt(limit)
    };

    const result = await agent.searchInternationalGraduates(searchOptions);

    if (result.success) {
      res.status(200).json({
        success: true,
        candidates: result.profiles,
        total: result.profiles.length,
        searchParams: result.searchParams
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
