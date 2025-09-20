const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

class ApolloLinkedInAgent {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.apollo.io/v1';
    this.headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': this.apiKey,
      'Cache-Control': 'no-cache'
    };
  }

  async searchInternationalGraduates(options = {}) {
    const {
      keywords = 'graduate OR student OR international OR visa OR OPT OR F1 OR H1B OR recent graduate OR new graduate',
      location = 'United States',
      seniority = ['entry', 'junior'],
      titles = ['software engineer', 'developer', 'analyst', 'associate', 'intern', 'graduate', 'new grad'],
      limit = 25
    } = options;

    const payload = {
      q_keywords: keywords,
      person_locations: [location],
      person_seniorities: Array.isArray(seniority) ? seniority : [seniority],
      person_titles: Array.isArray(titles) ? titles : titles.split(',').map(t => t.trim()),
      page: options.page || 1,
      per_page: Math.min(limit, 50)
    };

    try {
      console.log(`🔍 Searching Apollo for candidates in ${location}...`);
      
      const response = await axios.post(`${this.baseUrl}/people/search`, payload, {
        headers: this.headers,
        timeout: 30000
      });

      if (response.status === 200) {
        const data = response.data;
        const profiles = this.parseProfiles(data.people || []);
        
        console.log(`✅ Found ${profiles.length} matching candidates`);
        return {
          success: true,
          profiles,
          total: profiles.length,
          searchParams: payload
        };
      }
    } catch (error) {
      console.error('❌ Apollo search failed:', error.message);
      return {
        success: false,
        error: error.message,
        profiles: []
      };
    }
  }

  parseProfiles(people) {
    const profiles = [];
    
    for (const person of people) {
      if (!person.linkedin_url) continue;
      
      const profile = {
        full_name: this.safeConcatenate(person.first_name, person.last_name),
        title: person.title || '',
        company: person.organization?.name || '',
        location: this.formatLocation(person.city, person.state),
        linkedin_url: person.linkedin_url,
        email: person.email || '',
        seniority: person.seniority || 'entry',
        skills: person.skills || []
      };
      
      if (this.matchesInternationalCriteria(profile)) {
        profiles.push(profile);
      }
    }
    
    return profiles;
  }

  safeConcatenate(first, last) {
    const firstName = first || '';
    const lastName = last || '';
    return `${firstName} ${lastName}`.trim();
  }

  formatLocation(city, state) {
    const cityStr = city || '';
    const stateStr = state || '';
    if (cityStr && stateStr) {
      return `${cityStr}, ${stateStr}`;
    }
    return cityStr || stateStr || '';
  }

  matchesInternationalCriteria(profile) {
    const internationalKeywords = [
      'international', 'opt', 'f-1', 'visa', 'sponsorship',
      'work authorization', 'stem opt', 'recent graduate', 'new grad'
    ];
    
    const textToCheck = `${profile.title} ${profile.full_name}`.toLowerCase();
    
    const hasInternationalIndicator = internationalKeywords.some(keyword => 
      textToCheck.includes(keyword)
    );
    
    const isEntryLevel = profile.seniority.toLowerCase() === 'entry' ||
      ['graduate', 'entry', 'junior', 'associate', 'intern', 'new grad'].some(keyword =>
        profile.title.toLowerCase().includes(keyword)
      );
    
    return hasInternationalIndicator || isEntryLevel;
  }

  async saveResults(profiles, searchParams = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const outputDir = process.env.OUTPUT_DIR || './results';
    
    await fs.ensureDir(outputDir);
    
    // Save JSON data
    const jsonFile = path.join(outputDir, `apollo-candidates-${timestamp}.json`);
    const jsonData = {
      timestamp,
      total_profiles: profiles.length,
      search_method: 'Apollo.io API',
      search_params: searchParams,
      profiles
    };
    
    await fs.writeJson(jsonFile, jsonData, { spaces: 2 });
    
    // Save markdown summary
    const mdFile = path.join(outputDir, `apollo-summary-${timestamp}.md`);
    const mdContent = this.generateMarkdownSummary(profiles, searchParams, timestamp);
    
    await fs.writeFile(mdFile, mdContent);
    
    return {
      jsonFile,
      mdFile,
      count: profiles.length
    };
  }

  generateMarkdownSummary(profiles, searchParams, timestamp) {
    const md = [];
    
    md.push('# Apollo LinkedIn Candidate Search Results\n');
    md.push(`**Search Date:** ${new Date().toLocaleString()}`);
    md.push(`**Total Candidates:** ${profiles.length}`);
    md.push(`**Search Method:** Apollo.io API\n`);
    
    if (searchParams.q_keywords) {
      md.push('## Search Parameters');
      md.push(`- **Keywords:** ${searchParams.q_keywords}`);
      md.push(`- **Location:** ${searchParams.person_locations?.join(', ') || 'N/A'}`);
      md.push(`- **Seniority:** ${searchParams.person_seniorities?.join(', ') || 'N/A'}`);
      md.push(`- **Titles:** ${searchParams.person_titles?.join(', ') || 'N/A'}\n`);
    }
    
    md.push('## Top Candidates\n');
    
    profiles.slice(0, 10).forEach((profile, index) => {
      md.push(`### ${index + 1}. ${profile.full_name}`);
      md.push(`- **Title:** ${profile.title}`);
      md.push(`- **Company:** ${profile.company}`);
      md.push(`- **Location:** ${profile.location}`);
      md.push(`- **LinkedIn:** ${profile.linkedin_url}`);
      md.push(`- **Seniority:** ${profile.seniority}\n`);
    });
    
    return md.join('\n');
  }

  displayResults(profiles) {
    console.log('\n' + '='.repeat(60));
    console.log('APOLLO LINKEDIN SEARCH RESULTS');
    console.log('='.repeat(60));
    
    if (profiles.length === 0) {
      console.log('No candidates found matching the criteria.');
      return;
    }
    
    profiles.forEach((profile, index) => {
      console.log(`\n${index + 1}. ${profile.full_name}`);
      console.log(`   Title: ${profile.title}`);
      console.log(`   Company: ${profile.company}`);
      console.log(`   Location: ${profile.location}`);
      console.log(`   LinkedIn: ${profile.linkedin_url}`);
      console.log(`   Seniority: ${profile.seniority}`);
    });
    
    console.log('\n' + '='.repeat(60));
  }
}

module.exports = ApolloLinkedInAgent;
