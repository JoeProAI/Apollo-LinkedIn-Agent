const ApolloLinkedInAgent = require('../src/apollo-client');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const apiKey = process.env.APOLLO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Apollo API key not configured',
        configured: false
      });
    }

    const agent = new ApolloLinkedInAgent(apiKey);
    
    // Test with minimal search
    const testOptions = {
      keywords: 'software engineer',
      location: 'United States',
      seniority: ['entry'],
      titles: ['software engineer'],
      limit: 3
    };

    const result = await agent.searchInternationalGraduates(testOptions);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Apollo API connection successful!',
        testResults: result.profiles.length,
        configured: true,
        sampleCandidate: result.profiles[0] || null
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        configured: true
      });
    }

  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      configured: false
    });
  }
}
