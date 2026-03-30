#!/bin/bash
# Simple script to test observability features
# Usage: ./scripts/test-observability.sh

echo "🧪 Testing Observability Features"
echo ""

SERVER_URL="${SERVER_URL:-http://localhost:3001}"

# Test 1: Health endpoint
echo "1. Testing Health Endpoint..."
HEALTH=$(curl -s "${SERVER_URL}/health")
if echo "$HEALTH" | grep -q '"status":"OK"'; then
    echo "   ✅ Health endpoint working"
else
    echo "   ❌ Health endpoint failed"
    echo "   Response: $HEALTH"
fi
echo ""

# Test 2: Metrics endpoint
echo "2. Testing Metrics Endpoint..."
METRICS=$(curl -s "${SERVER_URL}/metrics")
if echo "$METRICS" | grep -q '"rooms"'; then
    echo "   ✅ Metrics endpoint working"
    echo "$METRICS" | jq '.rooms, .players, .errors.total' 2>/dev/null || echo "   (Install jq for formatted output)"
else
    echo "   ❌ Metrics endpoint failed"
    echo "   Response: $METRICS"
fi
echo ""

# Test 3: Logs endpoint
echo "3. Testing Logs Endpoint..."
LOGS=$(curl -s "${SERVER_URL}/debug/logs?limit=5")
if echo "$LOGS" | grep -q '"logs"'; then
    echo "   ✅ Logs endpoint working"
    LOG_COUNT=$(echo "$LOGS" | jq '.count' 2>/dev/null || echo "?")
    echo "   Found $LOG_COUNT recent log entries"
else
    echo "   ❌ Logs endpoint failed"
    echo "   Response: $LOGS"
fi
echo ""

# Test 4: Check log files exist
echo "4. Checking Log Files..."
if [ -d "server/logs" ] && [ "$(ls -A server/logs 2>/dev/null)" ]; then
    echo "   ✅ Log files directory exists"
    LOG_FILE=$(ls -t server/logs/*.log 2>/dev/null | head -1)
    if [ -n "$LOG_FILE" ]; then
        LOG_SIZE=$(wc -l < "$LOG_FILE" 2>/dev/null || echo "0")
        echo "   Latest log file: $(basename "$LOG_FILE")"
        echo "   Log entries: $LOG_SIZE"
    fi
else
    echo "   ⚠️  Log files directory not found or empty"
    echo "   (This is OK if server just started)"
fi
echo ""

# Test 5: Generate some test activity
echo "5. Generating Test Activity..."
for i in {1..5}; do
    curl -s "${SERVER_URL}/health" > /dev/null
done
echo "   ✅ Generated 5 test requests"
echo "   Check logs to see if they were recorded"
echo ""

echo "✅ Observability Test Complete!"
echo ""
echo "Next steps:"
echo "  1. Check server/logs/ for log files"
echo "  2. Query /debug/logs endpoint to see recent logs"
echo "  3. Monitor /metrics endpoint for system stats"

