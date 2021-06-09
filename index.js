require('dotenv').config({
  path: './.env',
});
const Discord = require('discord.js');
const client = new Discord.Client();
const {default: axios} = require('axios');
// UTILS
const {parseThreads, isNumeric} = require('./utils');
const ENDPOINT = process.env.ENDPOINT;
const PREFIX = '~';
client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
  console.log('Bot is online and running!')
})

client.on('message', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const commandBody = message.content.slice(PREFIX.length);
  console.log('Incoming command: ', commandBody);
  
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  let query = '';
  if(command === 'search') {
    var searchNum = args.pop();
    if(!isNumeric(searchNum)) searchNum = 3;
    searchNum = Number(searchNum);
    for(let i = 0; i < args.length; i++) {
      query += args[i] + ' ';
    }
  }

  // COMMANDS

  switch (command) {
    case 'recent':
      axios.get(ENDPOINT + '/recent', {
        params: {
          num: args[0] ? args[0] : 3,
        },
      }).then(async res => {
        if(!res.data.error && res.data.threads.length > 0) {

          const text = await parseThreads(res.data.threads);
          message.reply(text);
        } else if(res.data.message === 'Empty'){
          message.reply('We couldn\'t find any threads at the moment. Please try again later :)');
        }
      }).catch(e => {
        console.error(e);
        message.reply('Oops! Looks like something went wrong. Please try again.')
      });
      break;
    case 'category':
      axios.get(ENDPOINT + '/category', {
        params: {
          category: args[0],
          num: args[1] ? args[1] : 3,
        }
      }).then(async res => {
        if(!res.data.error && res.data.threads.length > 0) {

          const text = await parseThreads(res.data.threads);
          message.reply(text);
        } else if(res.data.message === 'Empty'){
          message.reply('We couldn\'t find any threads at the moment. Please try again later :)');
        }
      }).catch(e => {
        console.error(e);
        message.reply('Oops! Looks like something went wrong. Please try again.')
      });
      break;
    case 'search':
      axios.get(ENDPOINT + '/search', {
        params: {
          q: query,
          num: searchNum,
        }
      }).then(async res => {
        if(!res.data.error && res.data.threads.length > 0) {
          const text = await parseThreads(res.data.threads);
          message.reply(text);
        } else if(res.data.message === 'No result'){
          message.reply('We couldn\'t find any threads at the moment. Please try again later :)');
        }
      }).catch(e => {
        console.error(e);
        message.reply('Oops! Looks like something went wrong. Please try again.')
      });
      break;
    case 'categories':
      message.reply('You can read threads from the following categories:\n1. books-and-articles\n2. business\n3. current-affairs\n4. health\n5. life\n6. personal-growth\n7. programming\n8. startups\n9. technology');
      break;
    default:
        return;
  }
});
