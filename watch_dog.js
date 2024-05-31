const dns = require('dns');
const { WebClient } = require('@slack/web-api');

// Slack 설정
const slackToken = process.env.SLACK_BOT_TOKEN;
const slackChannel = process.env.SLACK_CHANNEL_ID;
const slackUserId = process.env.SLACK_USER_ID;
const web = new WebClient(slackToken);

const dnsServers = {
  KT: ['168.126.63.1', '168.126.63.2'],
  LGUplus: ['164.124.101.2', '203.248.252.2'],
  SKT: ['218.146.128.1', '218.146.129.1'],
};

// 여러 도메인 입력
const domains = process.env.CHECK_DOMAINS.split(',');

async function sendSlackMessage(blocks) {
  try {
    await web.chat.postMessage({
      channel: slackChannel,
      text: `<@${slackUserId}>`,
      blocks: blocks,
    });
  } catch (error) {
    console.error('Error sending message to Slack:', error);
  }
}

async function checkDNS() {
  let allSuccessful = true;
  const errorMessages = [];
  const successMessages = [];

  for (const domain of domains) {
    for (const isp of Object.keys(dnsServers)) {
      for (const server of dnsServers[isp]) {
        const resolver = new dns.Resolver();
        resolver.setServers([server]);

        try {
          const addresses = await new Promise((resolve, reject) => {
            resolver.resolve(domain, (err, addresses) => {
              if (err) {
                reject(err);
              } else {
                resolve(addresses);
              }
            });
          });

          const successMessage = `:white_check_mark: DNS lookup for *${domain}* using *${isp}* DNS server *${server}* succeeded: ${addresses}`;
          console.log(successMessage);
          successMessages.push(successMessage);
        } catch (err) {
          allSuccessful = false;
          const errorMessage = `:x: DNS lookup failed for *${domain}* using *${isp}* DNS server *${server}*: ${err.message}`;
          console.error(errorMessage);
          errorMessages.push(errorMessage);
        }
      }
    }
  }

  const blocks = [];

  if (allSuccessful) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':tada: *모두 성공!* :tada:\nAll DNS lookups succeeded without any issues.',
      },
    });
    successMessages.forEach(message => {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      });
    });
  } else {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:warning: *DNS Lookup Failures Detected!* :warning:\n<@${slackUserId}> Some DNS lookups failed. See the details below:`,
      },
    });
    errorMessages.forEach(message => {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      });
    });
  }

  await sendSlackMessage(blocks);
}

checkDNS();
