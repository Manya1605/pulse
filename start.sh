#!/bin/bash

echo "🚀 Starting DevPulse..."

# Open a new Terminal tab for the backend
osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '/Users/devmonal/Desktop/NEW PLUSE/backend' && npm run dev"
    delay 1
    tell application "System Events" to keystroke "t" using command down
    delay 0.5
    do script "cd '/Users/devmonal/Desktop/NEW PLUSE/FRONTEND' && npm run dev" in front window
end tell
EOF

echo "✅ Opening browser in 3 seconds..."
sleep 3
open http://localhost:5173
