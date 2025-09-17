# Apollo LinkedIn Agent

A standalone, lightweight LinkedIn candidate discovery agent powered exclusively by Apollo.io API. Designed specifically for finding international graduates and entry-level professionals.

## 🚀 Features

- **Pure Apollo.io Integration**: No scraping dependencies or rate limits
- **International Graduate Focus**: Specialized search for recent graduates with visa requirements
- **Multiple Search Modes**: Command-line, interactive, and programmatic interfaces
- **Clean Output**: JSON and Markdown export formats
- **Zero Scraping**: Relies entirely on Apollo.io's legal, compliant API

## 📦 Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd apollo-linkedin-agent
npm install

# Configure API key
cp .env.example .env
# Edit .env and add your APOLLO_API_KEY

# Test connection
npm test

# Run default search
npm start

# Interactive search mode
npm run search
```

## 🔧 Configuration

### Environment Variables (.env)
```env
APOLLO_API_KEY=your_apollo_api_key_here
OUTPUT_DIR=./results
DEFAULT_LOCATION=United States
DEFAULT_LIMIT=25
DEFAULT_SENIORITY=entry,junior
```

### Apollo.io Setup
1. Sign up at [Apollo.io](https://apollo.io)
2. Upgrade to a paid plan (required for search API)
3. Get your API key from Settings → Integrations
4. Add to `.env` file

## 🎯 Usage Modes

### 1. Default Search
```bash
npm start
```
Runs with predefined parameters optimized for international graduates.

### 2. Interactive Search
```bash
npm run search
```
Guided prompts to configure search parameters.

### 3. Programmatic Usage
```javascript
const ApolloLinkedInAgent = require('./src/apollo-client');

const agent = new ApolloLinkedInAgent(process.env.APOLLO_API_KEY);

const result = await agent.searchInternationalGraduates({
  keywords: 'recent graduate international student',
  location: 'California, United States',
  seniority: ['entry', 'junior'],
  titles: ['software engineer', 'developer'],
  limit: 50
});

console.log(`Found ${result.profiles.length} candidates`);
```

## 📊 Search Parameters

### Keywords
- `graduate OR student OR international OR visa OR OPT OR F1 OR H1B`
- `recent graduate OR new graduate`
- Custom keywords for specific requirements

### Locations
- United States (all states)
- California, United States
- New York, United States
- Texas, United States
- Washington, United States
- Massachusetts, United States

### Seniority Levels
- Entry level
- Junior
- Associate

### Job Titles
- Software Engineer
- Developer
- Analyst
- Associate
- Intern
- Graduate roles

## 📁 Output Format

### JSON Export
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "total_profiles": 25,
  "search_method": "Apollo.io API",
  "profiles": [
    {
      "full_name": "John Doe",
      "title": "Software Engineer, New Grad",
      "company": "Tech Company",
      "location": "San Francisco, California",
      "linkedin_url": "https://linkedin.com/in/johndoe",
      "email": "john@example.com",
      "seniority": "entry",
      "skills": ["JavaScript", "Python"]
    }
  ]
}
```

### Markdown Summary
- Search parameters
- Top 10 candidates
- Contact information
- LinkedIn profiles

## 🔍 International Graduate Detection

The agent automatically identifies candidates likely to be international graduates based on:

- **Keywords**: visa, OPT, F1, H1B, international, sponsorship
- **Titles**: "new grad", "recent graduate", "entry level"
- **Seniority**: Entry and junior level positions
- **Work Authorization**: References to visa requirements

## 🚀 Integration with Web App

Update your Next.js web app to use this standalone agent:

```javascript
// In your API route
const ApolloLinkedInAgent = require('apollo-linkedin-agent');

const agent = new ApolloLinkedInAgent(process.env.APOLLO_API_KEY);
const result = await agent.searchInternationalGraduates(searchParams);

return NextResponse.json({
  success: result.success,
  candidates: result.profiles,
  total: result.profiles.length
});
```

## 📈 Performance

- **Speed**: 2-5 seconds per search
- **Scale**: 25-50 candidates per search
- **Rate Limits**: Managed by Apollo.io (no scraping limits)
- **Reliability**: 99%+ uptime with Apollo.io infrastructure

## 🔒 Compliance

- **Legal**: Uses Apollo.io's compliant data collection
- **No Scraping**: Zero LinkedIn scraping or ToS violations
- **GDPR Ready**: Apollo.io handles data compliance
- **Professional**: Business-grade API access

## 🛠️ Development

```bash
# Install dependencies
npm install

# Development mode with auto-reload
npm run dev

# Test API connection
npm test

# Run with custom parameters
node src/index.js
```

## 📋 Requirements

- Node.js 16+
- Apollo.io paid account
- Valid API key

## 🤝 Support

- Check Apollo.io documentation for API issues
- Review search parameters for better results
- Ensure API key has proper permissions

---

**Clean, focused, Apollo-only LinkedIn candidate discovery** 🎯
