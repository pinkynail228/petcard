# VPS Deployment Guide

## Prerequisites
- A VPS (Ubuntu 22.04 LTS recommended) with Public IP.
- SSH Key configured for access.
- Domain name pointed to VPS IP (A Record).

## 1. Initial Server Setup (SSH into VPS)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install common tools
sudo apt install -y curl git ufw build-essential
```

## 2. Database Setup (PostgreSQL)
```bash
# Install Postgres
sudo apt install -y postgresql postgresql-contrib

# Start CLI
sudo -u postgres psql

# SQL Commands:
CREATE DATABASE petcard;
CREATE USER petcard_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE petcard TO petcard_user;
\q
```

## 3. Backend Deployment (FastAPI)
```bash
# Install Python & Venv
sudo apt install -y python3-pip python3-venv

# Clone Repo (or copy files)
git clone <your-repo-url> /var/www/petcard
cd /var/www/petcard

# Setup Venv
python3 -m venv venv
source venv/bin/activate
pip install -r src/backend/requirements.txt

# Environment Variables
# Create .env file based on specific config
nano .env 
# Add: DATABASE_URL=postgresql://petcard_user:pass@localhost/petcard
# Add: TELEGRAM_BOT_TOKEN=...
# Add: SECRET_KEY=...

# Run Migrations
alembic upgrade head

# Test Run
uvicorn src.backend.main:app --host 0.0.0.0 --port 8000
# (Ctrl+C to stop)
```

## 4. Frontend Deployment (React)
```bash
# Install Node.js (via NVM or APT)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Build
cd /var/www/petcard
npm install
npm run build 
# Output will be in /dist directory
```

## 5. Reverse Proxy Setup (Nginx)
```bash
sudo apt install -y nginx

# Create Config
sudo nano /etc/nginx/sites-available/petcard

# Config Content:
server {
    server_name yourdomain.com;

    # Frontend (Static Files)
    location / {
        root /var/www/petcard/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable Site
sudo ln -s /etc/nginx/sites-available/petcard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Systemd Service (Keep Backend Alive)
```bash
sudo nano /etc/systemd/system/petcard.service

# Content:
[Unit]
Description=PetCard Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/petcard
EnvironmentFile=/var/www/petcard/.env
ExecStart=/var/www/petcard/venv/bin/uvicorn src.backend.main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target

# Start Service
sudo systemctl enable petcard
sudo systemctl start petcard
```

## 7. SSL (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```
