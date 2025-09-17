#!/usr/bin/env node

require('dotenv').config();
const ApolloLinkedInAgent = require('./apollo-client');
const chalk = require('chalk');

async function main() {
  console.log(chalk.blue.bold('🚀 Apollo LinkedIn Agent'));
  console.log(chalk.gray('International Graduate Discovery Tool\n'));

  // Check for API key
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    console.error(chalk.red('❌ Error: APOLLO_API_KEY not found in environment variables'));
    console.log(chalk.yellow('Please copy .env.example to .env and add your Apollo API key'));
    process.exit(1);
  }

  // Initialize agent
  const agent = new ApolloLinkedInAgent(apiKey);

  // Default search parameters
  const searchOptions = {
    keywords: 'graduate OR student OR international OR visa OR OPT OR F1 OR H1B OR recent graduate OR new graduate',
    location: process.env.DEFAULT_LOCATION || 'United States',
    seniority: (process.env.DEFAULT_SENIORITY || 'entry,junior').split(','),
    titles: ['software engineer', 'developer', 'analyst', 'associate', 'intern', 'graduate', 'new grad'],
    limit: parseInt(process.env.DEFAULT_LIMIT) || 25
  };

  console.log(chalk.cyan('Search Parameters:'));
  console.log(`  Location: ${searchOptions.location}`);
  console.log(`  Seniority: ${searchOptions.seniority.join(', ')}`);
  console.log(`  Limit: ${searchOptions.limit}\n`);

  try {
    // Perform search
    const result = await agent.searchInternationalGraduates(searchOptions);

    if (result.success) {
      // Display results
      agent.displayResults(result.profiles);

      // Save results
      if (result.profiles.length > 0) {
        console.log(chalk.yellow('\n💾 Saving results...'));
        const saved = await agent.saveResults(result.profiles, result.searchParams);
        
        console.log(chalk.green(`✅ Results saved:`));
        console.log(`   JSON: ${saved.jsonFile}`);
        console.log(`   Summary: ${saved.mdFile}`);
        console.log(`   Total candidates: ${saved.count}`);
      }
    } else {
      console.error(chalk.red(`❌ Search failed: ${result.error}`));
    }

  } catch (error) {
    console.error(chalk.red(`❌ Unexpected error: ${error.message}`));
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
