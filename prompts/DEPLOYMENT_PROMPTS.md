# Deployment Phase Prompts

Use these prompts to direct the agents to perform the integration and deployment.

## 1. Backend Agent (Server Setup & Deployment)
**Context:** You have SSH access to `user@91.188.215.191`.
**Token:** `8221128071:AAHQfsytW7V_4NnGKxOur5Wz27HvcEOLTgg`

**Prompt:**
> "Backend Agent, we are moving to Deployment.
> 1. **Update Configuration**: Update `src/backend/.env` (or create it) with the Telegram Bot Token: `8221128071:AAHQfsytW7V_4NnGKxOur5Wz27HvcEOLTgg`.
> 2. **Prepare Server**:
>    - SSH into `user@91.188.215.191` (access is configured).
>    - Install system dependencies: `sudo apt update && sudo apt install -y python3-pip python3-venv postgresql nginx`.
> 3. **Deploy Backend**:
>    - Copy the `src/backend` code to `/var/www/petcard/backend` on the VPS.
>    - Set up the virtual environment and install `requirements.txt`.
>    - Run Alembic migrations on the VPS.
>    - Configure Systemd to run the FastAPI app (Uvicorn).
> 4. **Nginx Proxy**:
>    - Configure Nginx to proxy `/api` requests to the Backend port (8000).
>    - Ensure the remaining traffic serves static files (for Frontend).
>
> Report back when the Backend is running on the VPS."

## 2. Frontend Agent (Build & Deploy)
**Prompt:**
> "Frontend Agent, deploy the application.
> 1. **Build**: Run `npm run build` locally to generate the production bundle (`dist/`).
> 2. **Deploy**:
>    - SSH into `user@91.188.215.191`.
>    - Copy the contents of `dist/` to `/var/www/petcard/dist`.
>    - Ensure Nginx is pointing the root `/` to this directory.
>
> Report back when the Frontend is live."

## 3. QA Agent (Verification)
**Prompt:**
> "QA Agent, verify the deployment.
> 1. Check if accessibility of the domain (or IP) is valid.
> 2. Verify `/api/docs` (Swagger UI) loads.
> 3. Verify the Telegram Mini App loads (even if via direct link for now)."
