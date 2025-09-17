#!/usr/bin/env node

require('dotenv').config();
const ApolloLinkedInAgent = require('./apollo-client');
const inquirer = require('inquirer');
const chalk = require('chalk');

async function interactiveSearch() {
  console.log(chalk.blue.bold('🔍 Apollo LinkedIn Interactive Search'));
  console.log(chalk.gray('Configure your candidate search parameters\n'));

  // Check API key
  const apiKey = process.env.APOLLO_API_KEY;
  if (!apiKey) {
    console.error(chalk.red('❌ APOLLO_API_KEY not found. Please check your .env file.'));
    process.exit(1);
  }

  // Interactive prompts
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'keywords',
      message: 'Search keywords:',
      default: 'graduate OR student OR international OR visa OR OPT OR F1 OR H1B'
    },
    {
      type: 'list',
      name: 'location',
      message: 'Target location:',
      choices: [
        'United States',
        'California, United States',
        'New York, United States',
        'Texas, United States',
        'Washington, United States',
        'Massachusetts, United States'
      ],
      default: 'United States'
    },
    {
      type: 'checkbox',
      name: 'seniority',
      message: 'Seniority levels:',
      choices: [
        { name: 'Entry Level', value: 'entry', checked: true },
        { name: 'Junior', value: 'junior', checked: true },
        { name: 'Associate', value: 'associate' }
      ]
    },
    {
      type: 'input',
      name: 'titles',
      message: 'Job titles (comma-separated):',
      default: 'software engineer, developer, analyst, associate, intern, graduate'
    },
    {
      type: 'list',
      name: 'limit',
      message: 'Number of candidates:',
      choices: [
        { name: '10 candidates', value: 10 },
        { name: '25 candidates', value: 25 },
        { name: '50 candidates', value: 50 }
      ],
      default: 25
    }
  ]);

  // Process answers
  const searchOptions = {
    keywords: answers.keywords,
    location: answers.location,
    seniority: answers.seniority,
    titles: answers.titles.split(',').map(t => t.trim()),
    limit: answers.limit
  };

  console.log(chalk.cyan('\n🚀 Starting search with parameters:'));
  console.log(JSON.stringify(searchOptions, null, 2));

  // Initialize agent and search
  const agent = new ApolloLinkedInAgent(apiKey);
  
  try {
    const result = await agent.searchInternationalGraduates(searchOptions);

    if (result.success) {
      agent.displayResults(result.profiles);

      if (result.profiles.length > 0) {
        const saveResults = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'save',
            message: 'Save results to files?',
            default: true
          }
        ]);

        if (saveResults.save) {
          const saved = await agent.saveResults(result.profiles, result.searchParams);
          console.log(chalk.green(`\n✅ Results saved:`));
          console.log(`   JSON: ${saved.jsonFile}`);
          console.log(`   Summary: ${saved.mdFile}`);
        }
      }
    } else {
      console.error(chalk.red(`❌ Search failed: ${result.error}`));
    }

  } catch (error) {
    console.error(chalk.red(`❌ Error: ${error.message}`));
  }
}

if (require.main === module) {
  interactiveSearch().catch(console.error);
}

module.exports = { interactiveSearch };
