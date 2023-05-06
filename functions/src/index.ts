import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import CoffeeBreak from './coffee_break';
import fetch from 'node-fetch';

admin.initializeApp();

const SLACK_TOKEN = '<token>';
const BOT_TOKEN = '<token>';

exports.handleSlackSlashCommand = functions.https.onRequest(async (req, res) => {
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
    const channelId = req.body.channel_id;
    const availableMembers = await getAvailableTeamMembers(channelId);

    console.log(availableMembers);

    const coffeeBreak = new CoffeeBreak(availableMembers);
    const groups: Record<string, string[]> = coffeeBreak.generate();

    let fields = [];

    for (const group in groups) {
      // const output: string = "*" + group + "* => *" + groups[group].join(', ') + "* |\n";
      fields.push({
        type: "mrkdwn",
        text: "*" + group + "*",
      });
      fields.push({
        type: "mrkdwn",
        text: "*" + groups[group].join(", ") + "*"
      });
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
            fields: fields,
          }
      ]
    }

    res.send(message);
    return;
  }

  // Handle unknown commands
  res.status(404).send('Unknown command');
});

async function getAvailableTeamMembers(channelId: string): Promise<Array<string>>  {
  console.log("trying to get channel infos about ", channelId);
  try {
    const availableMembers: string[] = [];

    const membersResponse = await fetch(`https://slack.com/api/conversations.members?channel=${channelId}`, {
      headers: {
        Authorization: `Bearer ${BOT_TOKEN}`,
      },
    });
    const membersData: SlackConversationsMembersResponse = await membersResponse.json() as SlackConversationsMembersResponse;
    
    console.log("membersData");
    console.log(membersData.members);

    for (const memberId of membersData.members) {
      const [available, name] = await isMemberAvailableThisWeek(memberId);
      if (available) {
        availableMembers.push(name);
      }
    }

    return availableMembers;
  } catch (err) {
    console.log("error retrieving channel members", err);
    return [];
  }
}

async function isMemberAvailableThisWeek(memberId: string): Promise<[boolean, string]> {
  // const today = new Date();
  // const startOfTheWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  // const endOfTheWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

  const memberResponse = await fetch(`https://slack.com/api/users.info?user=${memberId}`, {
    headers: {
      Authorization: `Bearer ${BOT_TOKEN}`,
    },
  });
  const memberData: SlackUsersInfoResponse = await memberResponse.json() as SlackUsersInfoResponse;

  if (memberData.user.is_bot) {
    return [false, ""];
  } else {
    return [true, memberData.user.real_name];
  }

  // if (memberData.user.profile.status_text === '') {
  //   return [true, memberData.user.real_name];
  // } else {
  //   const statusText = memberData.user.profile.status_text.toLowerCase();
  //   if (statusText.includes('out of office') || statusText.includes('ooo')) {
  //     // If the user is out of office, check if they will return this week
  //     const statusExpiration = new Date(memberData.user.profile.status_expiration);
  //     if (statusExpiration >= startOfTheWeek && statusExpiration <= endOfTheWeek) {
  //       return [true, memberData.user.real_name];
  //     }
  //   } else if (statusText.includes('available') || statusText.includes('here')) {
  //     return [true, memberData.user.real_name];
  //   }
  // }

  // return [false, ""];
}