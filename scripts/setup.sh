#!/bin/bash

# InsightIQ Setup Script
# This script sets up the entire development environment

set -e

echo "🚀 Setting up InsightIQ Development Environment"

# Check if required tools are installed
check_requirements() {
    echo "📋 Checking requirements..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    # Check Python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi

    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    echo "✅ All requirements met!"
}

# Setup backend
setup_backend() {
    echo "🐍 Setting up Python backend..."
    cd apps/backend

    # Create virtual environment
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi

    # Activate virtual environment and install dependencies
    source venv/bin/activate
    echo "Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt

    cd ../..
    echo "✅ Backend setup complete!"
}

# Setup frontend
setup_frontend() {
    echo "⚛️ Setting up React frontend..."
    cd apps/frontend

    # Install Node.js dependencies
    echo "Installing Node.js dependencies..."
    npm install

    cd ../..
    echo "✅ Frontend setup complete!"
}

# Setup shared packages
setup_shared() {
    echo "📦 Setting up shared packages..."
    cd packages/shared-types

    # Install and build shared types
    npm install
    npm run build

    cd ../..
    echo "✅ Shared packages setup complete!"
}

# Create environment files
create_env_files() {
    echo "🔧 Creating environment configuration..."

    # Backend environment file
    if [ ! -f "apps/backend/.env" ]; then
        cat > apps/backend/.env << EOF
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/insightiq
REDIS_URL=redis://localhost:6379

# OpenAI - Add your API key here
OPENAI_API_KEY=your_openai_api_key_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE_HOURS=24

# Development
DEBUG=true
LOG_LEVEL=INFO

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
CORS_ORIGINS=http://localhost:3000

# Vector Store
VECTOR_STORE_PATH=./vector_store
EMBEDDING_DIMENSION=1536
SIMILARITY_THRESHOLD=0.7
EOF
        echo "Created apps/backend/.env - Please add your OpenAI API key"
    fi

    # Frontend environment file
    if [ ! -f "apps/frontend/.env.local" ]; then
        cat > apps/frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
EOF
        echo "Created apps/frontend/.env.local"
    fi

    echo "✅ Environment files created!"
}

# Setup database
setup_database() {
    echo "🗄️ Setting up database..."

    # Start database services
    echo "Starting PostgreSQL and Redis..."
    docker-compose up -d db redis

    echo "Waiting for database to be ready..."
    sleep 10

    # Run database migrations (when implemented)
    # cd apps/backend
    # source venv/bin/activate
    # alembic upgrade head
    # cd ../..

    echo "✅ Database setup complete!"
}

# Main setup process
main() {
    echo "🎯 Starting InsightIQ setup process..."

    check_requirements
    setup_shared
    setup_backend
    setup_frontend
    create_env_files
    setup_database

    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Add your OpenAI API key to apps/backend/.env"
    echo "2. Start the development servers:"
    echo "   npm run dev"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo "   API Documentation: http://localhost:8000/docs"
    echo ""
    echo "🐳 Or use Docker:"
    echo "   npm run docker:dev"
    echo ""
}

# Run the setup
main "$@"