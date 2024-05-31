# Vercel DNS ISP Block Watch Dog

Vercel DNS ISP Block Watch Dog는 여러 도메인의 DNS 조회를 정기적으로 수행하고, 결과를 Slack으로 알리는 도구입니다. 이 도구는 특정 ISP에서 Vercel DNS가 차단되었는지 모니터링합니다.

## 기능

- 여러 도메인의 DNS 조회
- 조회 결과를 Slack으로 알림
- 정기적인 스케줄링 (15분마다)

## 사용 방법

### 설정

1. `.env` 파일을 프로젝트 루트에 생성하고, 다음 환경 변수를 설정합니다:
