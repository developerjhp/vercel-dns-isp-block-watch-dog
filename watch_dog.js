const dns = require("dns");
const { WebClient } = require("@slack/web-api");

const domains = process.env.CHECK_DOMAINS.split(",");
const slackToken = process.env.SLACK_BOT_TOKEN;
const slackChannelSuccess = process.env.SLACK_CHANNEL_ID_SUCCESS; // 성공 시 보낼 채널 ID
const slackChannelFailure = process.env.SLACK_CHANNEL_ID_FAILURE; // 실패 시 보낼 채널 ID
const slackUserId = process.env.SLACK_USER_ID; // 특정 사용자 ID (필요시 사용)
const slackGroupId = process.env.SLACK_USER_GROUP_ID; // 그룹 ID

const web = new WebClient(slackToken);

// DNS 서버 설정
const dnsServers = {
  KT: ["168.126.63.1", "168.126.63.2"],
  LGUplus: ["164.124.101.2", "203.248.252.2"],
  SKT: ["210.220.163.82", "219.250.36.130"],
};

async function sendSlackMessage(channel, message) {
  try {
    await web.chat.postMessage({
      channel: channel,
      text: `<@${slackUserId}>`,
      blocks: message,
    });
  } catch (error) {
    console.error("Error sending message to Slack:", error);
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
  const mentionTag = slackGroupId
    ? `<!subteam^${slackGroupId}>`
    : `<@${slackUserId}>`;

  if (!allSuccessful) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: ":white_check_mark: All DNS lookups succeeded without any issues.",
      },
    });
    await sendSlackMessage(slackChannelSuccess, blocks);
  } else {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:warning: *DNS Lookup Failures Detected!* :warning:\n${mentionTag} Some DNS lookups failed. See the details below:`,
      },
    });
    errorMessages.forEach((errorMessage) => {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: errorMessage,
        },
      });
    });
    await sendSlackMessage(slackChannelFailure, blocks);
  }
}

checkDNS();
