# Telegram Mini App Setup Guide

## 1. Create a Telegram Bot
1. Open Telegram and search for **@BotFather**.
2. Send `/newbot`.
3. Follow the prompts:
   - **Name**: e.g., `PetCard App`
   - **Username**: e.g., `PetCardBot` (must end in `bot`)
4. **Copy the API Token**. You will need this for the Backend `.env` file (`TELEGRAM_BOT_TOKEN`).

## 2. Configure the Mini App (WebApp)
1. Send `/newapp` to BotFather.
2. Select your new bot (`@PetCardBot`).
3. Follow the prompts:
   - **Title**: `PetCard`
   - **Description**: `Digital Pet Health Passport`
   - **Photo**: Upload a logo (640x360).
   - **Gif**: Optional.
4. **WebApp URL**:
   - **For Local Development**: You need a secure tunnel (HTTPS).
     - Install `ngrok`: `brew install ngrok/ngrok/ngrok`
     - Run: `ngrok http 5173` (Frontend Port)
     - Use the https URL provided by ngrok (e.g., `https://random-id.ngrok-free.app`).
   - **For VPS (Production)**: Use your domain (e.g., `https://petcard.yourdomain.com`).
5. **Short Name**: e.g., `app`. This defines your direct link: `t.me/PetCardBot/app`.

## 3. Enable Menu Button (Optional but Recommended)
1. Send `/setmenubutton`.
2. Select your bot.
3. Send the URL again (same as WebApp URL).
4. Title: `Open PetCard`.

## 4. Testing
1. Click the link provided by BotFather (e.g., `t.me/PetCardBot/app`).
2. The Mini App should open inside Telegram.
3. If running locally with ngrok, ensure the Frontend is running (`npm run dev`) and ngrok is active.
