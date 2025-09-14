#!/bin/bash

# =================================================================
# College LMS Deployment Script for Red Hat Enterprise Linux 9
# =================================================================
# 
# Description: Automated deployment script for College LMS
# Author: College LMS Team
# Version: 2.0.0
# Compatible: RHEL 9, CentOS Stream 9, Rocky Linux 9, AlmaLinux 9
# 
# Usage: 
#   curl -sSL https://raw.githubusercontent.com/Jani-shiv/Collage_lms/main/deploy-rhel9.sh | sudo bash
#   or
#   sudo bash deploy-rhel9.sh
# 
# =================================================================

set -euo pipefail  # Exit on any error, undefined variables, and pipe failures

# Script configuration
SCRIPT_VERSION="2.0.0"
PROJECT_NAME="College LMS"
REPO_URL="https://github.com/Jani-shiv/Collage_lms.git"
INSTALL_DIR="/opt/Collage_lms"
LOG_FILE="/var/log/college-lms-deploy.log"
DOCKER_COMPOSE_VERSION="v2.27.0"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to print colored output
print_header() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                    $1                    ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    log "HEADER: $1"
}

print_status() {
    echo -e "${BLUE}🔄 $1${NC}"
    log "STATUS: $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS: $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    log "WARNING: $1"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    log "ERROR: $1"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
    log "INFO: $1"
}

# Error handling
error_exit() {
    print_error "$1"
    print_error "Deployment failed! Check log file: $LOG_FILE"
    exit 1
}

# Trap to handle script interruption
trap 'error_exit "Script interrupted by user"' INT TERM

# Pre-flight checks
preflight_checks() {
    print_header "PRE-FLIGHT CHECKS"
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        error_exit "Please run as root (use sudo)"
    fi
    print_success "Running as root"
    
    # Check OS compatibility
    if [ ! -f /etc/redhat-release ]; then
        error_exit "This script is designed for RHEL-based systems only"
    fi
    
    local os_version=$(cat /etc/redhat-release)
    print_info "Detected OS: $os_version"
    
    # Check internet connectivity
    if ! curl -s --head http://www.google.com > /dev/null; then
        error_exit "No internet connection detected"
    fi
    print_success "Internet connectivity verified"
    
    # Check available disk space (minimum 5GB)
    local available_space=$(df /opt | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 5242880 ]; then  # 5GB in KB
        error_exit "Insufficient disk space. At least 5GB required in /opt"
    fi
    print_success "Sufficient disk space available"
    
    # Create log file
    touch "$LOG_FILE"
    print_success "Log file created: $LOG_FILE"
}

# Banner
show_banner() {
    clear
    echo -e "${PURPLE}"
    cat << "EOF"
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ██████╗ ██████╗ ██╗     ██╗     ███████╗ ██████╗ ███████╗         ║
║  ██╔════╝██╔═══██╗██║     ██║     ██╔════╝██╔════╝ ██╔════╝         ║
║  ██║     ██║   ██║██║     ██║     █████╗  ██║  ███╗█████╗           ║
║  ██║     ██║   ██║██║     ██║     ██╔══╝  ██║   ██║██╔══╝           ║
║  ╚██████╗╚██████╔╝███████╗███████╗███████╗╚██████╔╝███████╗         ║
║   ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝         ║
║                                                                      ║
║                    Learning Management System                        ║
║                         Deployment Script                            ║
║                          Version 2.0.0                              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo ""
    print_info "Welcome to $PROJECT_NAME Automated Deployment"
    print_info "Script Version: $SCRIPT_VERSION"
    print_info "Target Platform: Red Hat Enterprise Linux 9"
    echo ""
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Initialize deployment
show_banner
preflight_checks

print_header "STARTING DEPLOYMENT PROCESS"

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