#!/bin/bash

# InsightIQ Deployment Script
# This script handles deployment to various environments

set -e

# Configuration
ENVIRONMENT=${1:-production}
VERSION=${2:-latest}
REGISTRY=${DOCKER_REGISTRY:-"your-registry.com"}

echo "🚀 Deploying InsightIQ to $ENVIRONMENT environment..."

# Build and push Docker images
build_and_push() {
    echo "🏗️ Building and pushing Docker images..."

    # Build and push backend
    echo "Building backend image..."
    cd apps/backend
    docker build -t $REGISTRY/insightiq-backend:$VERSION .
    docker push $REGISTRY/insightiq-backend:$VERSION
    cd ../..

    # Build and push frontend
    echo "Building frontend image..."
    cd apps/frontend
    docker build -f Dockerfile.prod -t $REGISTRY/insightiq-frontend:$VERSION .
    docker push $REGISTRY/insightiq-frontend:$VERSION
    cd ../..
}

# Deploy to staging
deploy_staging() {
    echo "🧪 Deploying to staging..."

    # Update staging docker-compose
    sed -i.bak "s|insightiq-backend:latest|insightiq-backend:$VERSION|g" docker-compose.staging.yml
    sed -i.bak "s|insightiq-frontend:latest|insightiq-frontend:$VERSION|g" docker-compose.staging.yml

    # Deploy to staging server
    # Add your staging deployment commands here
    echo "Staging deployment completed!"

    # Restore original file
    mv docker-compose.staging.yml.bak docker-compose.staging.yml
}

# Deploy to production
deploy_production() {
    echo "🌟 Deploying to production..."

    # Run pre-deployment checks
    echo "Running pre-deployment checks..."
    npm run test
    npm run lint

    # Update production docker-compose
    sed -i.bak "s|insightiq-backend:latest|insightiq-backend:$VERSION|g" docker-compose.prod.yml
    sed -i.bak "s|insightiq-frontend:latest|insightiq-frontend:$VERSION|g" docker-compose.prod.yml

    # Deploy to production server
    # Add your production deployment commands here
    echo "Production deployment completed!"

    # Restore original file
    mv docker-compose.prod.yml.bak docker-compose.prod.yml
}

# Health check
health_check() {
    echo "🏥 Running health checks..."

    # Check backend health
    BACKEND_URL=${BACKEND_URL:-"https://api.insightiq.com"}
    if curl -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        echo "✅ Backend health check passed"
    else
        echo "❌ Backend health check failed"
        exit 1
    fi

    # Check frontend health
    FRONTEND_URL=${FRONTEND_URL:-"https://insightiq.com"}
    if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
        echo "✅ Frontend health check passed"
    else
        echo "❌ Frontend health check failed"
        exit 1
    fi

    echo "✅ All health checks passed!"
}

# Rollback deployment
rollback() {
    echo "🔄 Rolling back deployment..."

    PREVIOUS_VERSION=${1:-"previous"}

    # Rollback to previous version
    echo "Rolling back to version $PREVIOUS_VERSION..."

    # Add rollback commands here
    echo "Rollback completed!"
}

# Main deployment logic
case $ENVIRONMENT in
    "staging")
        build_and_push
        deploy_staging
        health_check
        ;;
    "production")
        build_and_push
        deploy_production
        health_check
        ;;
    "rollback")
        rollback $VERSION
        ;;
    *)
        echo "Usage: $0 [staging|production|rollback] [version]"
        exit 1
        ;;
esac

echo "🎉 Deployment completed successfully!"