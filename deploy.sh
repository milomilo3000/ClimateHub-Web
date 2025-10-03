#!/bin/bash

# ClimateHub VPS Deployment Script
echo "🚀 Starting ClimateHub VPS Deployment..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Create deployment package
echo "📁 Creating deployment package..."
mkdir -p deployment
cp -r backend deployment/
cp -r frontend/build deployment/frontend

# Create VPS setup script
cat > deployment/setup-vps.sh << 'EOF'
#!/bin/bash

# ClimateHub VPS Setup Script
echo "🖥️ Setting up ClimateHub on VPS..."

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y

# Create directories
sudo mkdir -p /var/www/climatehub
sudo mkdir -p /var/www/climatehub-backend

# Copy files
sudo cp -r frontend/* /var/www/climatehub/
sudo cp -r backend/* /var/www/climatehub-backend/

# Copy nginx configuration
sudo cp nginx-config.conf /etc/nginx/sites-available/climatehub
sudo ln -sf /etc/nginx/sites-available/climatehub /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Set permissions
sudo chown -R www-data:www-data /var/www/climatehub/
sudo chmod -R 755 /var/www/climatehub/
sudo chown -R $USER:$USER /var/www/climatehub-backend/

# Install backend dependencies
cd /var/www/climatehub-backend
npm install

# Start backend with PM2
pm2 start server.js --name climatehub-backend
pm2 startup
pm2 save

echo "✅ VPS setup complete!"
echo "📝 Next steps:"
echo "1. Configure your domain DNS"
echo "2. Update environment variables in /var/www/climatehub-backend/.env"
echo "3. Configure Nginx (see README.md)"
echo "4. Set up SSL certificate"
EOF

chmod +x deployment/setup-vps.sh

echo "✅ Deployment package created!"
echo "📁 Files ready in 'deployment/' folder"
echo "📤 Upload this folder to your VPS and run setup-vps.sh" 