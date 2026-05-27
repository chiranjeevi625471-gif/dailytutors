# Test the auto-generation cron endpoints locally
# Run this in PowerShell

$CRON_SECRET = "e28224740808590b7506a930488bec551ca5b56b2b66224af0a89669474bd8da"
$LOCAL_URL = "http://localhost:3000"

Write-Host "🔍 Testing Daily Current Affairs Cron..." -ForegroundColor Cyan
$response1 = Invoke-WebRequest -Uri "$LOCAL_URL/api/cron/daily-affairs" `
  -Method POST `
  -Headers @{"x-cron-secret" = $CRON_SECRET; "Content-Type" = "application/json"} `
  -Body "{}" | ConvertFrom-Json

Write-Host ($response1 | ConvertTo-Json) -ForegroundColor Green

Write-Host "`n🔍 Testing Daily Quiz Auto-Generation Cron (20 questions from current affairs)..." -ForegroundColor Cyan
$response2 = Invoke-WebRequest -Uri "$LOCAL_URL/api/cron/daily-quiz" `
  -Method POST `
  -Headers @{"x-cron-secret" = $CRON_SECRET; "Content-Type" = "application/json"} `
  -Body '{"count": 20}' | ConvertFrom-Json

Write-Host ($response2 | ConvertTo-Json) -ForegroundColor Green

Write-Host "`n✅ Tests completed!" -ForegroundColor Green
