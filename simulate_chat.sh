#!/bin/bash

# Configuration
URL="https://consuela-unmacerated-nontactically.ngrok-free.dev/api/whatsapp/webhook"
PHONE_NUMBER="972587070728" # Your number

echo "========================================"
echo "      WhatsApp Webhook Simulator"
echo "========================================"
echo "Sending messages as user: $PHONE_NUMBER"
echo "Target URL: $URL"
echo ""

send_message() {
  local TEXT="$1"
  echo "Sending: '$TEXT' ભા"
  
  curl -s -X POST -H "Content-Type: application/json" -d "{
    \"object\": \"whatsapp_business_account\",
    \"entry\": [
      {
        \"changes\": [
          {
            \"value\": {
              \"messages\": [
                {
                  \"from\": \"$PHONE_NUMBER\",
                  \"text\": {
                    \"body\": \"$TEXT\"
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  }" "$URL"
  
  echo ""
  echo "----------------------------------------"
}

# Usage Instructions
if [ -z "$1" ]; then
  echo "Usage: ./simulate_chat.sh \"Your Message Here\""
  echo "Or run without arguments to run the default flow."
  echo ""
  
  # Default Flow
  echo "Running default flow..."
  
  # 1. Start Conversation
  send_message "Hello"
  sleep 2
  
  # 2. Select Topic 1
  send_message "1"
  sleep 2
  
  # 3. User Complaint
  send_message "Someone posted fake photos of me online."
else
  # Custom Message
  send_message "$1"
fi