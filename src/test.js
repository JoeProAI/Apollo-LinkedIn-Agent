#!/usr/bin/env node

require('dotenv').config();
const ApolloLinkedInAgent = require('./apollo-client');
const chalk = require('chalk');

async function testApolloConnection() {
  console.log(chalk.blue.bold('🧪 Apollo API Connection Test'));
  console.log(chalk.gray('Testing Apollo.io API connectivity and authentication\n'));

  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    console.error(chalk.red('❌ APOLLO_API_KEY not found in environment'));
    console.log(chalk.yellow('Please copy .env.example to .env and add your API key'));
    return false;
  }

  const agent = new ApolloLinkedInAgent(apiKey);

  // Test with minimal search
  const testOptions = {
    keywords: 'software engineer',
    location: 'United States',
    seniority: ['entry'],
    titles: ['software engineer'],
    limit: 5
  };

  console.log(chalk.cyan('Testing with minimal search parameters...'));

  try {
    const result = await agent.searchInternationalGraduates(testOptions);

    if (result.success) {
      console.log(chalk.green('✅ Apollo API connection successful!'));
      console.log(`   Found ${result.profiles.length} test candidates`);
      
      if (result.profiles.length > 0) {
        console.log(chalk.cyan('\nSample candidate:'));
        const sample = result.profiles[0];
        console.log(`   Name: ${sample.full_name}`);
        console.log(`   Title: ${sample.title}`);
        console.log(`   Company: ${sample.company}`);
        console.log(`   Location: ${sample.location}`);
      }
      
      return true;
    } else {
      console.error(chalk.red('❌ Apollo API test failed:'));
      console.error(`   Error: ${result.error}`);
      return false;
    }

  } catch (error) {
    console.error(chalk.red('❌ Connection test failed:'));
    console.error(`   ${error.message}`);
    return false;
  }
}

if (require.main === module) {
  testApolloConnection()
    .then(success => {
      if (success) {
        console.log(chalk.green('\n🎉 Apollo LinkedIn Agent is ready to use!'));
        console.log(chalk.gray('Run "npm start" for default search or "npm run search" for interactive mode'));
      } else {
        console.log(chalk.red('\n💥 Setup incomplete. Please check your API key and try again.'));
      }
    })
    .catch(console.error);
}

module.exports = { testApolloConnection };
