#!/bin/bash

echo "🔥 Firebase Configuration Setup"
echo "================================"
echo ""

# Check if .env files already exist
if [ -f "client/.env" ]; then
    echo "⚠️  client/.env already exists. Backing up to client/.env.backup"
    cp client/.env client/.env.backup
fi

if [ -f ".env" ]; then
    echo "⚠️  .env already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

echo ""
echo "📝 Creating template .env files..."
echo ""

# Create client/.env from template
if [ -f "client/.env.template" ]; then
    cp client/.env.template client/.env
    echo "✅ Created client/.env from template"
else
    cat > client/.env << 'EOF'
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key-here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
EOF
    echo "✅ Created client/.env"
fi

# Create root .env from template
if [ -f ".env.template" ]; then
    cp .env.template .env
    echo "✅ Created .env from template"
else
    cat > .env << 'EOF'
# Server Configuration
PORT=5001
JWT_SECRET=your-generated-jwt-secret-here

# Firebase Admin Configuration
FIREBASE_PROJECT_ID=your-project-id
EOF
    echo "✅ Created .env"
fi

echo ""
echo "🎉 Template files created!"
echo ""
echo "Next steps:"
echo "1. Go to https://console.firebase.google.com/"
echo "2. Get your Firebase config values (see FIREBASE_QUICK_START.md)"
echo "3. Edit client/.env and add your Firebase values"
echo "4. Edit .env and add your FIREBASE_PROJECT_ID"
echo "5. Run: npm run dev"
echo ""

