#!/bin/bash

echo "🎯 Final Frontend Verification Test"
echo "==================================="

# Create a more distinctive test image (red square)
echo "🟥 Creating distinctive red test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mP8/5+BAQYGRkYGBkYGFAAAHwwBBV8CLNcAAAAASUVORK5CYII=" | base64 -d > red_test.png

# Upload to screen 36 (which currently has null image_urls)
echo "⬆️  Uploading to screen ID 36 (shivaji park chennai)..."
RESPONSE=$(curl -s -X POST -F "images=@red_test.png" http://localhost:4000/api/upload-images/36)
echo "Upload response: $RESPONSE"

# Verify the result
echo -e "\n📊 Screen 36 after upload:"
curl -s http://localhost:4000/api/screens | jq '.data[] | select(.id == 36) | {id, name, image_urls}'

# Check that the other screens still work
echo -e "\n📊 Screen 35 (multiple images):"
curl -s http://localhost:4000/api/screens | jq '.data[] | select(.id == 35) | {id, name, image_urls}'

echo -e "\n📊 Screen 34 (first test):"
curl -s http://localhost:4000/api/screens | jq '.data[] | select(.id == 34) | {id, name, image_urls}'

# Clean up
rm -f red_test.png

echo -e "\n🎯 Frontend Verification Instructions:"
echo "======================================"
echo "1. Open: http://localhost:5175"
echo "2. Navigate to Screen Manager"
echo "3. Go to 'My Screens' tab"
echo "4. Look for these screens - they should show UPLOADED images, NOT random placeholders:"
echo "   - Screen ID 34: 'wejnwe2je' - should show first uploaded image"
echo "   - Screen ID 35: 'banglore a2 ma;;' - should show first of multiple uploaded images"  
echo "   - Screen ID 36: 'shivaji park chennai' - should show the red test image"
echo "5. If you see random Picsum images, the bug persists"
echo "6. If you see the actual uploaded images, the fix is working! ✅"
echo
echo "The getPrimaryImageUrl() function should now prioritize uploaded images over placeholders."
