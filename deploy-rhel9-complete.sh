#!/bin/bash

# =================================================================
# College LMS Deployment Script for Red Hat Enterprise Linux 9
# =================================================================
# 
# Description: Automated deployment script for College LMS
# Author: College LMS Team
# Version: 3.0.0
# Compatible: RHEL 9, CentOS Stream 9, Rocky Linux 9, AlmaLinux 9
# 
# Usage: 
#   curl -sSL https://raw.githubusercontent.com/Jani-shiv/Collage_lms/main/deploy-rhel9-complete.sh | sudo bash
#   or
#   sudo bash deploy-rhel9-complete.sh
# 
# =================================================================

set -euo pipefail  # Exit on any error, undefined variables, and pipe failures

# Script configuration
SCRIPT_VERSION="3.0.0"
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
    echo -e "${PURPLE}║$(printf '%62s' "$1" | sed 's/ /═/g')║${NC}"
    echo -e "${PURPLE}║$(printf '%62s' " $1 ")║${NC}"
    echo -e "${PURPLE}║$(printf '%62s' "$1" | sed 's/ /═/g')║${NC}"
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
║                          Version 3.0.0                              ║
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

# System update and basic dependencies
update_system() {
    print_header "SYSTEM UPDATE & DEPENDENCIES"
    
    print_status "Updating system packages..."
    dnf update -y >> "$LOG_FILE" 2>&1 || error_exit "Failed to update system packages"
    print_success "System packages updated"
    
    print_status "Installing essential dependencies..."
    dnf install -y epel-release >> "$LOG_FILE" 2>&1 || error_exit "Failed to install EPEL repository"
    dnf install -y git curl wget zip unzip vim nano htop net-tools firewalld openssl >> "$LOG_FILE" 2>&1 || error_exit "Failed to install dependencies"
    print_success "Essential dependencies installed"
    
    # Install development tools if needed
    print_status "Installing development tools..."
    dnf groupinstall -y "Development Tools" >> "$LOG_FILE" 2>&1 || print_warning "Development tools installation had issues"
    print_success "Development environment ready"
}

# Docker installation
install_docker() {
    print_header "DOCKER INSTALLATION"
    
    if command -v docker &> /dev/null; then
        print_warning "Docker is already installed"
        docker --version
    else
        print_status "Installing Docker CE..."
        
        # Remove any old Docker versions
        dnf remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine >> "$LOG_FILE" 2>&1 || true
        
        # Add Docker repository
        dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo >> "$LOG_FILE" 2>&1 || error_exit "Failed to add Docker repository"
        
        # Install Docker
        dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin >> "$LOG_FILE" 2>&1 || error_exit "Failed to install Docker"
        
        print_success "Docker installed successfully"
    fi
    
    # Start and enable Docker
    print_status "Starting Docker service..."
    systemctl enable docker >> "$LOG_FILE" 2>&1 || error_exit "Failed to enable Docker service"
    systemctl start docker >> "$LOG_FILE" 2>&1 || error_exit "Failed to start Docker service"
    print_success "Docker service is running"
    
    # Add current user to docker group (if not root)
    if [ "$SUDO_USER" ]; then
        usermod -aG docker "$SUDO_USER" >> "$LOG_FILE" 2>&1 || print_warning "Failed to add user to docker group"
        print_info "User $SUDO_USER added to docker group (logout/login required)"
    fi
    
    # Verify Docker installation
    docker --version || error_exit "Docker verification failed"
    print_success "Docker installation verified"
}

# Docker Compose installation
install_docker_compose() {
    print_header "DOCKER COMPOSE INSTALLATION"
    
    if command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose is already installed"
        docker-compose --version
    else
        print_status "Installing Docker Compose $DOCKER_COMPOSE_VERSION..."
        
        # Download Docker Compose
        curl -SL "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose >> "$LOG_FILE" 2>&1 || error_exit "Failed to download Docker Compose"
        
        # Make it executable
        chmod +x /usr/local/bin/docker-compose || error_exit "Failed to make Docker Compose executable"
        
        # Create symlink for global access
        ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose 2>/dev/null || true
        
        print_success "Docker Compose installed successfully"
    fi
    
    # Verify Docker Compose installation
    docker-compose --version || error_exit "Docker Compose verification failed"
    print_success "Docker Compose installation verified"
}

# Node.js installation (for building frontend)
install_nodejs() {
    print_header "NODE.JS INSTALLATION"
    
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_warning "Node.js is already installed: $node_version"
    else
        print_status "Installing Node.js 18 LTS..."
        
        # Install Node.js from NodeSource repository
        curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - >> "$LOG_FILE" 2>&1 || error_exit "Failed to setup Node.js repository"
        dnf install -y nodejs >> "$LOG_FILE" 2>&1 || error_exit "Failed to install Node.js"
        
        print_success "Node.js installed successfully"
    fi
    
    # Verify installation
    node --version || error_exit "Node.js verification failed"
    npm --version || error_exit "npm verification failed"
    print_success "Node.js and npm installation verified"
}

# Configure firewall
configure_firewall() {
    print_header "FIREWALL CONFIGURATION"
    
    if command -v firewall-cmd &> /dev/null; then
        print_status "Configuring firewall rules..."
        
        # Start firewall service
        systemctl enable firewalld >> "$LOG_FILE" 2>&1 || true
        systemctl start firewalld >> "$LOG_FILE" 2>&1 || true
        
        # Add HTTP and HTTPS services
        firewall-cmd --permanent --add-service=http >> "$LOG_FILE" 2>&1 || print_warning "Failed to add HTTP service"
        firewall-cmd --permanent --add-service=https >> "$LOG_FILE" 2>&1 || print_warning "Failed to add HTTPS service"
        
        # Add specific ports
        firewall-cmd --permanent --add-port=80/tcp >> "$LOG_FILE" 2>&1 || print_warning "Failed to add port 80"
        firewall-cmd --permanent --add-port=443/tcp >> "$LOG_FILE" 2>&1 || print_warning "Failed to add port 443"
        firewall-cmd --permanent --add-port=5000/tcp >> "$LOG_FILE" 2>&1 || print_warning "Failed to add port 5000"
        
        # Reload firewall
        firewall-cmd --reload >> "$LOG_FILE" 2>&1 || print_warning "Failed to reload firewall"
        
        print_success "Firewall configured successfully"
    else
        print_warning "Firewall not found, skipping configuration"
    fi
}

# Application deployment
deploy_application() {
    print_header "APPLICATION DEPLOYMENT"
    
    print_status "Setting up application directory..."
    cd /opt || error_exit "Failed to change to /opt directory"
    
    # Backup existing installation if present
    if [ -d "$INSTALL_DIR" ]; then
        local backup_dir="${INSTALL_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
        print_warning "Existing installation found. Creating backup..."
        mv "$INSTALL_DIR" "$backup_dir" || error_exit "Failed to backup existing installation"
        print_success "Backup created: $backup_dir"
    fi
    
    # Clone repository
    print_status "Cloning College LMS repository..."
    git clone "$REPO_URL" "$INSTALL_DIR" >> "$LOG_FILE" 2>&1 || error_exit "Failed to clone repository"
    cd "$INSTALL_DIR" || error_exit "Failed to change to project directory"
    print_success "Repository cloned successfully"
    
    # Set proper permissions
    print_status "Setting proper permissions..."
    chown -R root:root "$INSTALL_DIR" || error_exit "Failed to set ownership"
    chmod -R 755 "$INSTALL_DIR" || error_exit "Failed to set permissions"
    
    # Make scripts executable
    find "$INSTALL_DIR" -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null || true
    print_success "Permissions configured"
    
    # Create environment files
    create_environment_files
    
    # Build frontend
    build_frontend
    
    # Start services
    start_services
}

# Create environment configuration
create_environment_files() {
    print_status "Creating environment configuration..."
    
    # Backend environment
    if [ ! -f backend/.env ]; then
        cat > backend/.env << EOF
NODE_ENV=production
JWT_SECRET=$(openssl rand -hex 32)
DB_PATH=./database/lms.db
PORT=5000
BCRYPT_ROUNDS=12
CORS_ORIGIN=*
LOG_LEVEL=info
EOF
        print_success "Backend environment file created"
    else
        print_warning "Backend .env file already exists"
    fi
    
    # Frontend environment
    local server_ip=$(hostname -I | awk '{print $1}')
    if [ ! -f frontend/.env ]; then
        cat > frontend/.env << EOF
VITE_API_URL=http://${server_ip}/api
VITE_APP_NAME=College LMS
VITE_APP_VERSION=2.0.0
VITE_NODE_ENV=production
EOF
        print_success "Frontend environment file created"
    else
        print_warning "Frontend .env file already exists"
    fi
    
    print_success "Environment configuration completed"
}

# Build frontend application
build_frontend() {
    print_status "Building frontend application..."
    
    cd "$INSTALL_DIR/frontend" || error_exit "Failed to change to frontend directory"
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install --production >> "$LOG_FILE" 2>&1 || error_exit "Failed to install frontend dependencies"
    
    # Build production bundle
    print_status "Building production bundle..."
    npm run build >> "$LOG_FILE" 2>&1 || error_exit "Failed to build frontend"
    
    cd "$INSTALL_DIR" || error_exit "Failed to return to project root"
    print_success "Frontend built successfully"
}

# Start services
start_services() {
    print_status "Starting College LMS services..."
    
    cd "$INSTALL_DIR" || error_exit "Failed to change to project directory"
    
    # Stop any existing services
    print_status "Stopping existing services..."
    docker-compose down >> "$LOG_FILE" 2>&1 || true
    
    # Start services with Docker Compose
    print_status "Starting services with Docker Compose..."
    docker-compose up -d --build >> "$LOG_FILE" 2>&1 || error_exit "Failed to start services"
    
    # Wait for services to start
    print_status "Waiting for services to initialize..."
    sleep 30
    
    # Check service status
    if docker-compose ps | grep -q "Up"; then
        print_success "Services started successfully"
    else
        print_error "Some services failed to start"
        docker-compose logs >> "$LOG_FILE" 2>&1
        error_exit "Service startup verification failed"
    fi
}

# Create systemd service
create_systemd_service() {
    print_header "SYSTEMD SERVICE CONFIGURATION"
    
    print_status "Creating systemd service for auto-start..."
    
    cat > /etc/systemd/system/college-lms.service << EOF
[Unit]
Description=College LMS Application
Documentation=https://github.com/Jani-shiv/Collage_lms
Requires=docker.service
After=docker.service network.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
ExecReload=/usr/local/bin/docker-compose restart
TimeoutStartSec=300
TimeoutStopSec=60
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd and enable service
    systemctl daemon-reload || error_exit "Failed to reload systemd"
    systemctl enable college-lms.service >> "$LOG_FILE" 2>&1 || error_exit "Failed to enable College LMS service"
    
    print_success "Systemd service created and enabled"
}

# Health check
perform_health_check() {
    print_header "HEALTH CHECK"
    
    local server_ip=$(hostname -I | awk '{print $1}')
    local max_attempts=10
    local attempt=1
    
    print_status "Performing health check..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "http://localhost/" > /dev/null 2>&1; then
            print_success "Application is responding correctly"
            return 0
        fi
        
        print_info "Attempt $attempt/$max_attempts failed, retrying in 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    print_warning "Health check failed, but services appear to be running"
    print_info "Please check the application manually"
}

# Cleanup and optimization
cleanup_and_optimize() {
    print_header "CLEANUP & OPTIMIZATION"
    
    print_status "Cleaning up temporary files..."
    dnf clean all >> "$LOG_FILE" 2>&1 || true
    
    print_status "Removing unnecessary packages..."
    dnf autoremove -y >> "$LOG_FILE" 2>&1 || true
    
    print_status "Optimizing Docker images..."
    docker system prune -f >> "$LOG_FILE" 2>&1 || true
    
    print_success "Cleanup completed"
}

# Final deployment summary
show_deployment_summary() {
    local server_ip=$(hostname -I | awk '{print $1}')
    
    print_header "DEPLOYMENT COMPLETED"
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                       🎉 SUCCESS! 🎉                                ║${NC}"
    echo -e "${GREEN}║              College LMS Deployed Successfully!                     ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN}         📋 DEPLOYMENT INFORMATION${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo -e "🌐 ${YELLOW}Application URL:${NC}    http://${server_ip}/"
    echo -e "🔧 ${YELLOW}API Endpoint:${NC}       http://${server_ip}/api/"
    echo -e "📁 ${YELLOW}Installation Path:${NC}  $INSTALL_DIR"
    echo -e "📋 ${YELLOW}Log File:${NC}          $LOG_FILE"
    echo ""
    
    echo -e "${CYAN}👤 ${YELLOW}Demo Accounts:${NC}"
    echo -e "   🔑 ${GREEN}Admin:${NC}   admin@example.com / admin123"
    echo -e "   🍎 ${GREEN}Teacher:${NC} teacher@example.com / teacher123"
    echo -e "   🎓 ${GREEN}Student:${NC} student@example.com / student123"
    echo ""
    
    echo -e "${CYAN}🔧 ${YELLOW}Management Commands:${NC}"
    echo -e "   ▶️  ${GREEN}Start:${NC}     systemctl start college-lms"
    echo -e "   ⏹️  ${GREEN}Stop:${NC}      systemctl stop college-lms"
    echo -e "   🔄 ${GREEN}Restart:${NC}   systemctl restart college-lms"
    echo -e "   📊 ${GREEN}Status:${NC}    systemctl status college-lms"
    echo -e "   📋 ${GREEN}Logs:${NC}      cd $INSTALL_DIR && docker-compose logs"
    echo ""
    
    echo -e "${CYAN}📚 ${YELLOW}Documentation:${NC}"
    echo -e "   📖 ${GREEN}README:${NC}      $INSTALL_DIR/README.md"
    echo -e "   🚀 ${GREEN}Deployment:${NC}  $INSTALL_DIR/DEPLOYMENT.md"
    echo -e "   🤝 ${GREEN}Contributing:${NC} $INSTALL_DIR/CONTRIBUTING.md"
    echo ""
    
    echo -e "${GREEN}✨ ${YELLOW}Next Steps:${NC}"
    echo -e "   1. 🌐 Access the application at http://${server_ip}/"
    echo -e "   2. 🔑 Login with demo accounts provided above"
    echo -e "   3. 📚 Read the documentation for customization"
    echo -e "   4. 🛡️  Configure SSL certificates for production"
    echo ""
    
    echo -e "${PURPLE}🎓 Happy Learning with College LMS! 🎓${NC}"
    echo ""
    
    # Log final status
    log "DEPLOYMENT COMPLETED SUCCESSFULLY"
    log "Application URL: http://${server_ip}/"
    log "Installation Path: $INSTALL_DIR"
    log "Deployment completed at: $(date)"
}

# Main execution flow
main() {
    # Show banner and run checks
    show_banner
    preflight_checks
    
    # Execute deployment steps
    update_system
    install_docker
    install_docker_compose
    install_nodejs
    configure_firewall
    deploy_application
    create_systemd_service
    perform_health_check
    cleanup_and_optimize
    show_deployment_summary
    
    print_success "🚀 College LMS deployment completed successfully! 🚀"
}

# Run main function
main "$@"