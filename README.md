# Vercel DNS ISP Block Watch Dog

![Screenshot 2024-06-01 15:40:27](https://github.com/developerjhp/vercel-dns-isp-block-watch-dog/assets/85682854/99c1065a-219c-4d0a-897a-adb78e6fc383)

There has been a recurring issue of Korean ISPs blocking Vercel DNS. This open-source project aims to notify you when a domain deployed through Vercel is blocked by ISPs.

Vercel DNS ISP Block Watch Dog monitors the accessibility of domains deployed via Vercel through KT, SKT, and LGU+ DNS servers, and sends a notification to Slack when an issue occurs.

## Features

- DNS lookup for multiple domains
- Slack notifications of lookup results
- Scheduled checks (every 15 minutes to 1 hour)

## Installation and Setup

### 1. Clone the Repository

```sh

git  clone  https://github.com/YOUR_GITHUB_USERNAME/vercel-dns-isp-block-watch-dog.git

cd  vercel-dns-isp-block-watch-dog

```

### 2. Install Required Packages

```sh

npm  install

```
If you are running this locally, create a .env.local file in the project root and set the following environment variables:
```sh
SLACK_BOT_TOKEN=your-slack-bot-token
SLACK_CHANNEL_ID_SUCCESS=your-slack-channel-id
SLACK_CHANNEL_ID_FAILURE=your-slack-channel-id
SLACK_USER_IDS=your-slack-user-id-1,your-slack-user-id-2,...
SLACK_USER_GROUP_IDS=your-slack-user-group-id-1,your-slack-user-group-id-3,...
CHECK_DOMAINS=your-domain-address.com,your-second-domain-address.com,your-third-domain-address.com,...
```
If you are running this via GitHub Actions, set the environment variables in GitHub Secrets.


## Usage

### 1. Running the Tool

For local environments (compatible with node v20+, use dotenv for other versions):
```sh
node --env-file=.env watch_dog.js
```

For GitHub Actions:
1.	Go to the “Actions” tab in your GitHub repository.
2.	Select the workflow you want to run.
3.	Click the “Run workflow” button on the top right to trigger it manually.
4.	It will automatically run every 15 minutes to 1 hour.






# Vercel DNS ISP Block Watch Dog


한국의 ISP에서 Vercel DNS를 차단하는 이슈가 지속적으로 발생하고 있습니다.
Vercel을 통해 배포된 도메인이 ISP에 의해 차단될 경우, 알림을 받기 위한 오픈소스 프로젝트입니다.

Vercel DNS ISP Block Watch Dog는 KT, SKT, LGU+ DNS 서버를 통해 Vercel로 배포된 도메인의 접근 가능 여부를 모니터링하고, 문제가 발생하면 Slack으로 알림을 보내는 도구입니다.

## 기능

  

- 여러 도메인의 DNS 조회

- 조회 결과를 Slack으로 알림

- 정기적인 스케줄링 (15분 ~ 1시간)

  

## 설치 및 설정

  

### 1. Clone Repository

  

```sh

git  clone  https://github.com/YOUR_GITHUB_USERNAME/vercel-dns-isp-block-watch-dog.git

cd  vercel-dns-isp-block-watch-dog

```

  

### 2. 필요한 패키지 설치

  

```sh

npm  install

```

### 3. 환경변수 설정

**로컬환경에서** 실행하시는 경우
프로젝트 루트에 .env.local 파일을 생성하고 다음 환경 변수를 설정합니다.
```sh
SLACK_BOT_TOKEN=your-slack-bot-token
SLACK_CHANNEL_ID_SUCCESS=your-slack-channel-id
SLACK_CHANNEL_ID_FAILURE=your-slack-channel-id
SLACK_USER_IDS=your-slack-user-id-1,your-slack-user-id-2,...
SLACK_USER_GROUP_IDS=your-slack-user-group-id-1,your-slack-user-group-id-3,...
CHECK_DOMAINS=사용하시는_도메인_주소.com,사용하시는_도메인_주소_두번째.com,사용하시는_도메인_주소_세번째.com,...
```
**Github Action** 으로 실행하시는 경우
GitHub Secrets 에서 env를 설정해주세요 .


## 사용 방법

### 1.  실행

**로컬환경에서** 실행하시는 경우 (node v20 부터가능, 그 외 버전은 dotenv를 사용해주세요.)
```sh
node --env-file=.env watch_dog.js
```

**Github Action**으로 실행하시는 경우

1. GitHub 리포지토리의 “Actions” 탭으로 이동합니다.
2. 실행하려는 워크플로우를 선택합니다.
3. 오른쪽 상단의 “Run workflow” 버튼을 클릭하여 수동으로 실행합니다.
4. 이후 15분 ~ 1시간 마다 자동으로 실행됩니다. 
