# EcoTracker Deployment Guide

This guide covers different deployment options for the EcoTracker application.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ecotracker
```

### 2. Environment Configuration
```bash
# Copy environment files
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

# Edit the environment files with your actual values
nano backend/.env
nano frontend/.env
```

### 3. Start Services
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## 🌐 Production Deployment

### Option 1: Cloud Platform Deployment

#### Backend (Render/Railway)
1. **Connect Repository**: Link your GitHub repository
2. **Environment Variables**: Set all required environment variables
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `gunicorn app:app`

#### Frontend (Netlify/Vercel)
1. **Connect Repository**: Link your GitHub repository
2. **Build Command**: `npm run build`
3. **Publish Directory**: `build`
4. **Environment Variables**: Set React environment variables

#### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update backend environment variables

### Option 2: VPS Deployment

#### Server Setup (Ubuntu 20.04+)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y
```

#### Application Deployment
```bash
# Clone repository
git clone <repository-url>
cd ecotracker

# Configure environment
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
# Edit .env files with production values

# Start services
docker-compose up -d

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/ecotracker
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecotracker

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Flask
FLASK_ENV=production
```

### Frontend (.env)
```env
# API
REACT_APP_API_URL=https://your-backend-url.com

# Google Maps
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-api-key

# Cloudinary
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## 📊 Monitoring and Maintenance

### Health Checks
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Restart services
docker-compose restart backend
```

### Database Backup
```bash
# Backup MongoDB
docker exec ecotracker-mongodb mongodump --out /backup

# Restore MongoDB
docker exec ecotracker-mongodb mongorestore /backup
```

### SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 Security Considerations

### Production Security
1. **Change Default Passwords**: Update all default credentials
2. **Use Strong JWT Secret**: Generate a secure random key
3. **Enable HTTPS**: Use SSL certificates
4. **Firewall**: Configure proper firewall rules
5. **Regular Updates**: Keep all dependencies updated
6. **Database Security**: Use MongoDB authentication
7. **API Rate Limiting**: Implement rate limiting
8. **Input Validation**: Validate all user inputs

### Environment Security
```bash
# Set proper file permissions
chmod 600 backend/.env
chmod 600 frontend/.env

# Use secrets management
# Consider using Docker secrets or cloud secret managers
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
    # ... other config
```

### Load Balancing
```nginx
upstream backend {
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}

server {
    location /api/ {
        proxy_pass http://backend;
    }
}
```

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check logs
docker-compose logs backend

# Common fixes
# 1. Check environment variables
# 2. Verify MongoDB connection
# 3. Check port conflicts
```

#### Frontend Build Fails
```bash
# Check Node.js version
node --version

# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues
```bash
# Test MongoDB connection
docker exec ecotracker-mongodb mongo --eval "db.adminCommand('ismaster')"

# Check network connectivity
docker network ls
docker network inspect ecotracker_ecotracker-network
```

## 📞 Support

For deployment issues:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Check network connectivity
4. Review security groups/firewall rules
5. Consult the troubleshooting section above

## 🔄 Updates and Maintenance

### Application Updates
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Migrations
```bash
# Run migrations if needed
docker exec ecotracker-backend python migrate.py
```

### Backup Strategy
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec ecotracker-mongodb mongodump --out /backup/ecotracker_$DATE
```

This deployment guide should help you get EcoTracker running in production! 🚀
