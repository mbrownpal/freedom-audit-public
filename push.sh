#!/bin/bash
# Read the files
PAGE_TSX=$(cat app/page.tsx)
ASSESSMENT_TSX=$(cat app/assessment/page.tsx)
LAYOUT_TSX=$(cat app/layout.tsx)
STYLES_CSS=$(cat app/styles.css)

# Export for workbench
cat > /tmp/files.json << EOF
{
  "page": $(jq -Rs . <<< "$PAGE_TSX"),
  "assessment": $(jq -Rs . <<< "$ASSESSMENT_TSX"),
  "layout": $(jq -Rs . <<< "$LAYOUT_TSX"),
  "css": $(jq -Rs . <<< "$STYLES_CSS")
}
EOF

echo "Files exported to /tmp/files.json"
