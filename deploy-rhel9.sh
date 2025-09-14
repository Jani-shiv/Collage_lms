#!/bin/bash

# College LMS Deployment Script for RHEL 9
# Run this script as root to deploy College LMS with Docker and Nginx

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_status "Starting College LMS deployment on RHEL 9..."

# Update system
print_status "Updating system packages..."
dnf update -y
print_success "System updated successfully"

# Install dependencies
print_status "Installing required dependencies..."
dnf install -y git curl wget zip unzip vim nano htop
print_success "Dependencies installed successfully"

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
    dnf install -y docker-ce docker-ce-cli containerd.io
    systemctl enable docker
    systemctl start docker
    print_success "Docker installed and started"
else
    print_warning "Docker is already installed"
fi

# Install Docker Compose v2
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_warning "Docker Compose is already installed"
fi

# Create application directory
print_status "Setting up application directory..."
cd /opt
if [ -d "Collage_lms" ]; then
    print_warning "Existing installation found. Backing up..."
    mv Collage_lms Collage_lms_backup_$(date +%Y%m%d_%H%M%S)
fi

# Clone repository
print_status "Cloning College LMS repository..."
git clone https://github.com/Jani-shiv/Collage_lms.git
cd Collage_lms
print_success "Repository cloned successfully"

# Set proper permissions
print_status "Setting proper permissions..."
chown -R root:root /opt/Collage_lms
chmod -R 755 /opt/Collage_lms
print_success "Permissions set successfully"

# Create environment files
print_status "Creating environment configuration..."
cat > backend/.env << EOF
NODE_ENV=production
JWT_SECRET=$(openssl rand -hex 32)
DB_PATH=./database/lms.db
PORT=5000
EOF

cat > frontend/.env << EOF
VITE_API_URL=http://$(hostname -I | awk '{print $1}')/api
EOF
print_success "Environment files created"

# Install Node.js (if not present)
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    dnf install -y nodejs
    print_success "Node.js installed successfully"
fi

# Build frontend
print_status "Building frontend application..."
cd frontend
npm install --production
npm run build
cd ..
print_success "Frontend built successfully"

# Configure firewall
print_status "Configuring firewall..."
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --reload
    print_success "Firewall configured"
else
    print_warning "Firewall not found, skipping configuration"
fi

# Start services with Docker Compose
print_status "Starting College LMS services..."
docker-compose down 2>/dev/null || true
docker-compose up -d --build

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Check service status
print_status "Checking service status..."
if docker-compose ps | grep -q "Up"; then
    print_success "Services are running successfully"
else
    print_error "Some services failed to start"
    docker-compose logs
    exit 1
fi

# Create systemd service for auto-start
print_status "Creating systemd service..."
cat > /etc/systemd/system/college-lms.service << EOF
[Unit]
Description=College LMS Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/Collage_lms
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable college-lms.service
print_success "Systemd service created and enabled"

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

# Final status
print_success "🎉 College LMS deployed successfully!"
echo ""
echo "=========================================="
echo "         DEPLOYMENT INFORMATION"
echo "=========================================="
echo "🌐 Application URL: http://${SERVER_IP}/"
echo "🔧 API Endpoint:    http://${SERVER_IP}/api/"
echo "📁 Installation:    /opt/Collage_lms"
echo "📋 Logs:           docker-compose logs"
echo ""
echo "👤 Demo Accounts:"
echo "   Admin:   admin@example.com / admin123"
echo "   Teacher: teacher@example.com / teacher123"
echo "   Student: student@example.com / student123"
echo ""
echo "🔧 Management Commands:"
echo "   Start:    systemctl start college-lms"
echo "   Stop:     systemctl stop college-lms"
echo "   Restart:  systemctl restart college-lms"
echo "   Status:   systemctl status college-lms"
echo "   Logs:     cd /opt/Collage_lms && docker-compose logs"
echo ""
echo "📚 Documentation:"
echo "   README:      /opt/Collage_lms/README.md"
echo "   Deployment:  /opt/Collage_lms/DEPLOYMENT.md"
echo "   Contributing: /opt/Collage_lms/CONTRIBUTING.md"
echo "=========================================="

print_success "Deployment completed! 🚀"