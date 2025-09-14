
# College LMS Deployment Guide (RHEL 9 + Docker + Nginx)

## Prerequisites

- Red Hat Enterprise Linux 9 (RHEL 9)
- Root access
- Internet connection

## Steps

### 1. Update System & Install Dependencies
```bash
dnf update -y
dnf install -y git curl wget zip unzip
```

### 2. Install Docker & Docker Compose
```bash
dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io
systemctl enable docker
systemctl start docker
curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 3. Clone the Repository
```bash
cd /opt
git clone https://github.com/Jani-shiv/Collage_lms.git
cd Collage_lms
```

### 4. Build Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### 5. Start Services with Docker Compose
```bash
docker-compose up -d --build
```

### 6. Access the Application
- **Frontend:** http://<server-ip>/
- **Backend API:** http://<server-ip>/api/

## Updating the App

1. Pull latest changes:
	```bash
	git pull origin main
	```
2. Rebuild and restart containers:
	```bash
	docker-compose up -d --build
	```

## Troubleshooting

- Check logs: `docker-compose logs`
- Restart services: `docker-compose restart`
- Stop services: `docker-compose down`

## Demo Accounts

- **Admin:** admin@example.com / admin123
- **Teacher:** teacher@example.com / teacher123
- **Student:** student@example.com / student123

## Notes

- Nginx serves the frontend and proxies API requests to the backend.
- All configuration files are included in the repository.