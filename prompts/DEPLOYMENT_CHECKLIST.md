# Deployment Checklist - PetCard Phase 1

## Infrastructure (VPS)
- [ ] Provision VPS (Ubuntu 22.04/24.04 LTS recommended) <!-- id: 0 -->
- [ ] Verify Resources (4 vCPU, 4GB RAM, 30GB SSD) <!-- id: 1 -->
- [ ] Secure SSH Access (Key-based auth only) <!-- id: 2 -->
- [ ] Setup Firewall (UFW: allow 22, 80, 443) <!-- id: 3 -->

## Database (PostgreSQL)
- [ ] Install PostgreSQL 16+ <!-- id: 4 -->
- [ ] Create Database `petcard` <!-- id: 5 -->
- [ ] Create Database User `petcard_user` <!-- id: 6 -->
- [ ] Configure Remote Access (if strictly necessary, prefer local socket/localhost) <!-- id: 7 -->
- [ ] Verify Connection String in `.env` <!-- id: 8 -->

## Backend (FastAPI)
- [ ] Install Python 3.11+ <!-- id: 9 -->
- [ ] Clone Repository <!-- id: 10 -->
- [ ] Create Virtual Environment (`venv`) <!-- id: 11 -->
- [ ] Install Dependencies (`pip install -r src/backend/requirements.txt`) <!-- id: 12 -->
- [ ] Set Environment Variables (`.env`) <!-- id: 13 -->
    - `DATABASE_URL`
    - `TELEGRAM_BOT_TOKEN`
    - `SECRET_KEY`
- [ ] Run Migrations (`alembic upgrade head`) <!-- id: 14 -->
- [ ] Setup Systemd Service (`petcard-backend.service`) <!-- id: 15 -->
- [ ] Setup Reverse Proxy (Nginx/Caddy) pointing to FastAPI port <!-- id: 16 -->
- [ ] Setup SSL (Let's Encrypt) <!-- id: 17 -->

## Frontend (React Mini App)
- [ ] Install Node.js 20+ <!-- id: 18 -->
- [ ] Build for Production (`npm run build`) <!-- id: 19 -->
- [ ] Serve Static Files via Nginx/Caddy <!-- id: 20 -->
- [ ] Verify Telegram WebApp integration loads correctly in external browser (mocked) and Telegram <!-- id: 21 -->

## Telegram Bot
- [ ] Configure Webhook URL <!-- id: 22 -->
- [ ] Verify Bot receives messages <!-- id: 23 -->

## Verification
- [ ] Smoke Test: Login, Add Pet, View List <!-- id: 24 -->
- [ ] Check Logs (`journalctl -u petcard-backend -f`) <!-- id: 25 -->
