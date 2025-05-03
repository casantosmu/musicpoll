#!/bin/bash

# deploy.sh - A script to deploy backend and frontend code to a remote server
# Usage: ./deploy.sh [server_ip]

USERNAME="musicpoll"
SERVER_IP=${1}
BACKEND_PATH="./apps/back"
FRONTEND_PATH="./apps/front"
REMOTE_BACKEND_PATH="/home/$USERNAME/app/back"
REMOTE_FRONTEND_PATH="/home/$USERNAME/app/front"

# Colors
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RESET="\033[0m"

# Check if server is reachable
echo -e "${YELLOW}Checking SSH connection to $SERVER_IP on port 22...${RESET}"
if ! nc -z -w 5 $SERVER_IP 22 &> /dev/null; then
    echo "Error: Cannot reach SSH (port 22) on server at $SERVER_IP"
    exit 1
fi

# Build frontend and backend
echo -e "${YELLOW}Building frontend and backend...${RESET}"
pnpm build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build completed successfully!${RESET}"
else
    echo "Error: Build failed"
    exit 1
fi

# Deploy backend
echo -e "${YELLOW}Deploying backend code to $SERVER_IP...${RESET}"
rsync -avz "$BACKEND_PATH/" "$USERNAME@$SERVER_IP:$REMOTE_BACKEND_PATH/" --exclude node_modules --exclude .env

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backend deployment successful!${RESET}"
else
    echo "Error: Backend deployment failed"
    exit 1
fi

# Restart backend PM2 service
echo -e "${YELLOW}Restarting backend service...${RESET}"
ssh $USERNAME@$SERVER_IP "source ~/.nvm/nvm.sh && cd $REMOTE_BACKEND_PATH && pm2 reload musicpoll-back"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backend service restarted successfully!${RESET}"
else
    echo "Error: Failed to restart backend service"
    exit 1
fi

# Deploy frontend
echo -e "${YELLOW}Deploying frontend build to $SERVER_IP...${RESET}"
rsync -avz "$FRONTEND_PATH/" "$USERNAME@$SERVER_IP:$REMOTE_FRONTEND_PATH/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Frontend deployment successful!${RESET}"
else
    echo "Error: Frontend deployment failed"
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${RESET}"
