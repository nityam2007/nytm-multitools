#!/bin/bash
# =============================================================================
# NYTM Multitools - VPS Deployment Script
# =============================================================================
# Run this script on your VPS to deploy/update the application
# Usage: ./deploy.sh
# =============================================================================

set -e

APP_DIR="$HOME/nytm-multitools"
IMAGE="ghcr.io/nityam2007/nytm-multitools:latest"

echo "🚀 NYTM Multitools Deployment"
echo "=============================="

# Create app directory
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Create docker-compose.yml
echo "📝 Creating docker-compose.yml..."
cat > docker-compose.yml << 'EOF'
services:
  nytm-multitools:
    image: ghcr.io/nityam2007/nytm-multitools:latest
    container_name: nytm-multitools
    restart: unless-stopped
    ports:
      - "12020:3000"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
EOF

# Pull and deploy
echo "📦 Pulling latest image..."
docker pull "$IMAGE"

echo "🔄 Starting/Restarting container..."
docker compose up -d --force-recreate

# Cleanup
echo "🧹 Cleaning up old images..."
docker image prune -f

echo ""
echo "✅ Deployment complete!"
echo "🌐 Access your app at: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "Useful commands:"
echo "  - View logs:    docker logs -f nytm-multitools"
echo "  - Stop app:     docker compose down"
echo "  - Restart app:  docker compose restart"
