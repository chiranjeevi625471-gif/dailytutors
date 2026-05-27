#!/bin/bash
# Test the auto-generation cron endpoints locally

CRON_SECRET="e28224740808590b7506a930488bec551ca5b56b2b66224af0a89669474bd8da"
LOCAL_URL="http://localhost:3000"

echo "🔍 Testing Daily Current Affairs Cron..."
curl -X POST \
  -H "x-cron-secret: $CRON_SECRET" \
  -H "Content-Type: application/json" \
  "$LOCAL_URL/api/cron/daily-affairs"

echo -e "\n\n"
echo "🔍 Testing Daily Quiz Auto-Generation Cron (20 questions from current affairs)..."
curl -X POST \
  -H "x-cron-secret: $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"count": 20}' \
  "$LOCAL_URL/api/cron/daily-quiz"

echo -e "\n✅ Tests completed!"
