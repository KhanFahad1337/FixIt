#!/bin/bash
set -e

echo "==========================================="
echo " FixIt - Oracle Cloud VM Setup (Ubuntu 22.04+)"
echo "==========================================="

# 1. Update system
echo "[1/7] Updating system..."
sudo apt-get update -y && sudo apt-get upgrade -y

# 2. Install Node.js 20 (LTS)
echo "[2/7] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version

# 3. Install git
echo "[3/7] Installing git..."
sudo apt-get install -y git

# 4. Clone the repo
echo "[4/7] Cloning FixIt..."
cd ~
if [ ! -d "FixIt" ]; then
  git clone https://github.com/KhanFahad1337/FixIt.git
fi
cd FixIt

# 5. Install deps + build frontend
echo "[5/7] Installing dependencies and building..."
npm install --prefix backend
npm install --prefix frontend --include=dev
npm run build --prefix frontend

# 6. Create environment file
echo "[6/7] Creating .env - EDIT THIS WITH YOUR VALUES"
cat > backend/.env << 'EOF'
PORT=3000
MONGO_URI=PASTE_YOUR_MONGO_URI_HERE
JWT_SECRET=change_this_secret
STRIPE_SECRET_KEY=sk_test_placeholder
AI_API_KEY=
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.1-8b-instant
EOF

# 7. Create systemd service (auto-start, runs forever)
echo "[7/7] Creating systemd service..."
sudo tee /etc/systemd/system/fixit.service > /dev/null << 'EOF'
[Unit]
Description=FixIt Home Services
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/FixIt/backend
EnvironmentFile=/root/FixIt/backend/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable fixit
sudo systemctl start fixit

echo ""
echo "==========================================="
echo " DONE! Now do these steps:"
echo "==========================================="
echo "1. Edit backend/.env:  nano ~/FixIt/backend/.env"
echo "   - Set MONGO_URI (your Atlas connection string)"
echo "   - Set JWT_SECRET and optional AI_API_KEY"
echo ""
echo "2. Restart the service:"
echo "   sudo systemctl restart fixit"
echo ""
echo "3. Open firewall for your app:"
echo "   sudo iptables -I INPUT 6 -p tcp --dport 3000 -j ACCEPT"
echo ""
echo "4. Your app is live at:  http://YOUR_VM_IP:3000"
echo "   (Get IP with: hostname -I)"
echo "==========================================="
