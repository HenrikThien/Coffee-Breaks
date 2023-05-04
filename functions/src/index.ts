import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import CoffeeBreak from './coffee_break';

admin.initializeApp();

const SLACK_TOKEN = 'UePJZA7nekGTlsW1dnODEdoq';

exports.handleSlackSlashCommand = functions.https.onRequest((req, res) => {
  if (req.body.token !== SLACK_TOKEN) {
    console.error('Invalid Slack token');
    res.status(401).send('Unauthorized');
    return;
  }

  if (req.body.command === '/ping') {
    const message = {
      response_type: 'in_channel',
      text: 'Pong!',
    };
    res.send(message);
    return;
  } else if (req.body.command === '/coffee-break') {
    const coffeeBreak = new CoffeeBreak();
    const groups: Record<string, string[]> = coffeeBreak.generate();

    let response = "";

    for (const group in groups) {
      const output: string = "*" + group + "* => *" + groups[group].join(', ') + "* |\n";
      response += output;
    }
    
    const message = {
      response_type: 'in_channel',
      blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: ":sunvigo: THIS WEEKS COFFEE GROUPS :sunvigo:",
              emoji: true
            }
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: response
            }
          }
      ]
    }

    res.send(message);
    return;
  }

  // Handle unknown commands
  res.status(404).send('Unknown command');
});