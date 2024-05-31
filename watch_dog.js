const dns = require('dns');
const { WebClient } = require('@slack/web-api');

const slackToken = process.env.SLACK_BOT_TOKEN;
const slackChannel = process.env.SLACK_CHANNEL_ID;
const slackUserId = process.env.SLACK_USER_ID;
const web = new WebClient(slackToken);

// DNS 서버 설정
// DNS를 추가할 때, 해당 DNS가 정상 작동하는지 확인해주세요.
// 예를 들어, nslookup naver.com 추가할_DNS 를 사용하여 DNS가 정상적으로 응답하는지 테스트합니다.
const dnsServers = {
  KT: ['168.126.63.1', '168.126.63.2'],
  LGUplus: ['164.124.101.2', '203.248.252.2'],
  LGHelloVision: ['180.182.54.2'],
  SKT: ['210.220.163.82', '219.250.36.130'],
};

// vercel serverless를 사용하는 경우 serverless ip도 꼭 같이 확인해주세요.
const domains = process.env.CHECK_DOMAINS.split(',');

async function sendSlackMessage(message) {
  try {
    await web.chat.postMessage({
      channel: slackChannel,
      text: `<@${slackUserId}>`,
      blocks: message,
    });
  } catch (error) {
    console.error('Error sending message to Slack:', error);
  }
}

async function resolveDomain(resolver, domain) {
  return new Promise((resolve, reject) => {
    resolver.resolve4(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses);
      }
    });
  });
}

async function checkDNS() {
  let allSuccessful = true;
  const errorMessages = [];

  for (const domain of domains) {
    for (const isp of Object.keys(dnsServers)) {
      for (const server of dnsServers[isp]) {
        const resolver = new dns.Resolver();
        resolver.setServers([server]);

        try {
          const addresses = await resolveDomain(resolver, domain);
          console.log(
            `:white_check_mark: DNS lookup for *${domain}* using *${isp}* DNS server *${server}* succeeded: ${addresses}`
          );
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
        text: ':white_check_mark: All DNS lookups succeeded without any issues.',
      },
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
