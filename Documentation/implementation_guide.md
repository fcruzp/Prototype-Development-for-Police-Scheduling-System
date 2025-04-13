# Jamaica Constabulary Force Workforce Management System
# Implementation Guide

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation Process](#installation-process)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Deployment Options](#deployment-options)
7. [Integration with Existing Systems](#integration-with-existing-systems)
8. [Security Implementation](#security-implementation)
9. [Testing Procedures](#testing-procedures)
10. [Maintenance and Updates](#maintenance-and-updates)
11. [Scaling Considerations](#scaling-considerations)
12. [Disaster Recovery](#disaster-recovery)

## Introduction

This implementation guide provides detailed instructions for deploying the Jamaica Constabulary Force (JCF) Workforce Management System. It is intended for IT administrators, system engineers, and technical staff responsible for implementing and maintaining the system.

The guide covers all aspects of implementation, from initial setup to ongoing maintenance, with a focus on best practices for security, performance, and reliability.

## System Requirements

### Hardware Requirements

#### Production Environment
- **Application Servers**: 
  - Minimum: 4 CPU cores, 8GB RAM, 100GB SSD
  - Recommended: 8 CPU cores, 16GB RAM, 250GB SSD
- **Database Servers**:
  - Minimum: 4 CPU cores, 16GB RAM, 500GB SSD
  - Recommended: 8 CPU cores, 32GB RAM, 1TB SSD with RAID configuration
- **Load Balancer**:
  - Minimum: 2 CPU cores, 4GB RAM
  - Recommended: 4 CPU cores, 8GB RAM

#### Development/Testing Environment
- **Application Server**: 4 CPU cores, 8GB RAM, 100GB SSD
- **Database Server**: 4 CPU cores, 8GB RAM, 250GB SSD

### Software Requirements

#### Server Environment
- **Operating System**: Ubuntu Server 20.04 LTS or later
- **Web Server**: Nginx 1.18 or later
- **Node.js**: v14.x or later
- **Database**:
  - MongoDB 4.4 or later
  - PostgreSQL 12 or later
- **Container Platform**: Docker 20.10 or later, Docker Compose 2.0 or later
- **Orchestration** (optional): Kubernetes 1.20 or later

#### Client Requirements
- **Web Browsers**:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **Mobile Devices**:
  - iOS 13+ for iOS app
  - Android 8.0+ for Android app

## Installation Process

### Preparation

1. **Create Installation Directory**:
   ```bash
   mkdir -p /opt/jcf-wfm
   cd /opt/jcf-wfm
   ```

2. **Clone Repository**:
   ```bash
   git clone https://github.com/jamaica-police/workforce-management.git .
   ```

3. **Set Up Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Edit Environment Variables**:
   ```bash
   nano .env
   ```
   Update the following variables:
   - `PORT`: Application port (default: 5000)
   - `MONGODB_URI`: MongoDB connection string
   - `POSTGRES_URI`: PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `NODE_ENV`: Environment (production, development, testing)
   - `CORS_ORIGIN`: Allowed origins for CORS
   - `MAPBOX_TOKEN`: Mapbox API token for maps

### Backend Installation

1. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install --production
   ```

2. **Initialize Database**:
   ```bash
   npm run db:init
   ```

3. **Run Database Migrations**:
   ```bash
   npm run db:migrate
   ```

4. **Seed Initial Data**:
   ```bash
   npm run db:seed
   ```

5. **Start Backend Server**:
   ```bash
   npm start
   ```

   For production with PM2:
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Frontend Installation

1. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install --production
   ```

2. **Build Production Bundle**:
   ```bash
   npm run build
   ```

3. **Configure Nginx**:
   ```bash
   sudo cp nginx/jcf-wfm.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/jcf-wfm.conf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Mobile App Build

1. **Install Mobile App Dependencies**:
   ```bash
   cd ../mobile
   npm install
   ```

2. **Configure App Settings**:
   ```bash
   cp app.config.example.js app.config.js
   nano app.config.js
   ```
   Update the API URL and other settings.

3. **Build Android App**:
   ```bash
   npm run build:android
   ```
   The APK file will be generated in `android/app/build/outputs/apk/release/`.

4. **Build iOS App**:
   ```bash
   npm run build:ios
   ```
   The app will be built in Xcode. You'll need a Mac with Xcode installed.

### Docker Installation

1. **Build and Start Containers**:
   ```bash
   docker-compose up -d
   ```

2. **Initialize Database in Docker**:
   ```bash
   docker-compose exec backend npm run db:init
   docker-compose exec backend npm run db:migrate
   docker-compose exec backend npm run db:seed
   ```

## Configuration

### Backend Configuration

The backend configuration is managed through environment variables in the `.env` file:

```
# Server Configuration
PORT=5000
NODE_ENV=production
LOG_LEVEL=info

# Database Configuration
MONGODB_URI=mongodb://mongodb:27017/jcf_wfm
POSTGRES_URI=postgresql://postgres:password@postgres:5432/jcf_wfm

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRATION=1d
JWT_REFRESH_EXPIRATION=7d

# CORS Configuration
CORS_ORIGIN=https://jcf-wfm.gov.jm

# External Services
MAPBOX_TOKEN=your_mapbox_token
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@jcf-wfm.gov.jm
SMTP_PASS=your_smtp_password

# Feature Flags
ENABLE_GEOLOCATION=true
ENABLE_BIOMETRICS=true
ENABLE_NOTIFICATIONS=true
```

### Frontend Configuration

The frontend configuration is managed through environment variables in the `.env` file:

```
REACT_APP_API_URL=https://api.jcf-wfm.gov.jm
REACT_APP_SOCKET_URL=wss://api.jcf-wfm.gov.jm
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_VERSION=$npm_package_version
REACT_APP_ENVIRONMENT=production
```

### Nginx Configuration

Example Nginx configuration for the web application:

```nginx
server {
    listen 80;
    server_name jcf-wfm.gov.jm;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name jcf-wfm.gov.jm;

    ssl_certificate /etc/letsencrypt/live/jcf-wfm.gov.jm/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jcf-wfm.gov.jm/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_stapling on;
    ssl_stapling_verify on;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://api.mapbox.com; style-src 'self' 'unsafe-inline' https://api.mapbox.com; img-src 'self' data: https://*.mapbox.com; connect-src 'self' https://api.jcf-wfm.gov.jm wss://api.jcf-wfm.gov.jm https://api.mapbox.com";

    root /opt/jcf-wfm/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Database Setup

### MongoDB Setup

1. **Install MongoDB**:
   ```bash
   sudo apt update
   sudo apt install -y mongodb
   ```

2. **Enable and Start MongoDB**:
   ```bash
   sudo systemctl enable mongodb
   sudo systemctl start mongodb
   ```

3. **Create Database and User**:
   ```bash
   mongo
   ```
   
   ```javascript
   use jcf_wfm
   db.createUser({
     user: "jcf_admin",
     pwd: "secure_password",
     roles: [{ role: "readWrite", db: "jcf_wfm" }]
   })
   exit
   ```

4. **Enable Authentication**:
   ```bash
   sudo nano /etc/mongodb.conf
   ```
   
   Add or modify:
   ```
   security:
     authorization: enabled
   ```

5. **Restart MongoDB**:
   ```bash
   sudo systemctl restart mongodb
   ```

### PostgreSQL Setup

1. **Install PostgreSQL**:
   ```bash
   sudo apt update
   sudo apt install -y postgresql postgresql-contrib
   ```

2. **Create Database and User**:
   ```bash
   sudo -u postgres psql
   ```
   
   ```sql
   CREATE DATABASE jcf_wfm;
   CREATE USER jcf_admin WITH ENCRYPTED PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE jcf_wfm TO jcf_admin;
   \q
   ```

3. **Configure PostgreSQL for Remote Access** (if needed):
   ```bash
   sudo nano /etc/postgresql/12/main/postgresql.conf
   ```
   
   Modify:
   ```
   listen_addresses = '*'
   ```
   
   ```bash
   sudo nano /etc/postgresql/12/main/pg_hba.conf
   ```
   
   Add:
   ```
   host    jcf_wfm         jcf_admin        0.0.0.0/0               md5
   ```

4. **Restart PostgreSQL**:
   ```bash
   sudo systemctl restart postgresql
   ```

## Deployment Options

### Standard Deployment

The standard deployment uses PM2 for process management and Nginx as a reverse proxy:

1. **Install PM2**:
   ```bash
   npm install -g pm2
   ```

2. **Create PM2 Ecosystem File**:
   ```bash
   nano ecosystem.config.js
   ```
   
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'jcf-wfm-api',
         script: 'backend/server.js',
         instances: 'max',
         exec_mode: 'cluster',
         env: {
           NODE_ENV: 'production',
           PORT: 5000
         }
       }
     ]
   };
   ```

3. **Start Application with PM2**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx** as shown in the [Nginx Configuration](#nginx-configuration) section.

### Docker Deployment

Docker deployment uses Docker Compose to manage containers:

1. **Create Docker Compose File**:
   ```bash
   nano docker-compose.yml
   ```
   
   ```yaml
   version: '3.8'
   
   services:
     mongodb:
       image: mongo:4.4
       restart: always
       volumes:
         - mongodb_data:/data/db
       environment:
         MONGO_INITDB_ROOT_USERNAME: root
         MONGO_INITDB_ROOT_PASSWORD: example
       networks:
         - app-network
   
     postgres:
       image: postgres:12
       restart: always
       volumes:
         - postgres_data:/var/lib/postgresql/data
       environment:
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: example
         POSTGRES_DB: jcf_wfm
       networks:
         - app-network
   
     backend:
       build: ./backend
       restart: always
       depends_on:
         - mongodb
         - postgres
       environment:
         NODE_ENV: production
         PORT: 5000
         MONGODB_URI: mongodb://root:example@mongodb:27017/jcf_wfm?authSource=admin
         POSTGRES_URI: postgresql://postgres:example@postgres:5432/jcf_wfm
         JWT_SECRET: your_secure_jwt_secret
       networks:
         - app-network
   
     frontend:
       build: ./frontend
       restart: always
       depends_on:
         - backend
       networks:
         - app-network
   
     nginx:
       image: nginx:1.19
       restart: always
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx/conf.d:/etc/nginx/conf.d
         - ./nginx/ssl:/etc/nginx/ssl
         - ./frontend/build:/usr/share/nginx/html
       depends_on:
         - backend
         - frontend
       networks:
         - app-network
   
   networks:
     app-network:
       driver: bridge
   
   volumes:
     mongodb_data:
     postgres_data:
   ```

2. **Start Docker Containers**:
   ```bash
   docker-compose up -d
   ```

### Kubernetes Deployment

For large-scale deployments, Kubernetes provides better scalability and management:

1. **Create Kubernetes Manifests**:
   
   **Namespace**:
   ```yaml
   apiVersion: v1
   kind: Namespace
   metadata:
     name: jcf-wfm
   ```
   
   **MongoDB StatefulSet**:
   ```yaml
   apiVersion: apps/v1
   kind: StatefulSet
   metadata:
     name: mongodb
     namespace: jcf-wfm
   spec:
     serviceName: mongodb
     replicas: 1
     selector:
       matchLabels:
         app: mongodb
     template:
       metadata:
         labels:
           app: mongodb
       spec:
         containers:
         - name: mongodb
           image: mongo:4.4
           ports:
           - containerPort: 27017
           volumeMounts:
           - name: mongodb-data
             mountPath: /data/db
           env:
           - name: MONGO_INITDB_ROOT_USERNAME
             valueFrom:
               secretKeyRef:
                 name: mongodb-secret
                 key: username
           - name: MONGO_INITDB_ROOT_PASSWORD
             valueFrom:
               secretKeyRef:
                 name: mongodb-secret
                 key: password
     volumeClaimTemplates:
     - metadata:
         name: mongodb-data
       spec:
         accessModes: [ "ReadWriteOnce" ]
         resources:
           requests:
             storage: 10Gi
   ```
   
   **Backend Deployment**:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: backend
     namespace: jcf-wfm
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: backend
     template:
       metadata:
         labels:
           app: backend
       spec:
         containers:
         - name: backend
           image: jcf-wfm/backend:latest
           ports:
           - containerPort: 5000
           env:
           - name: NODE_ENV
             value: production
           - name: PORT
             value: "5000"
           - name: MONGODB_URI
             valueFrom:
               secretKeyRef:
                 name: backend-secret
                 key: mongodb-uri
           - name: JWT_SECRET
             valueFrom:
               secretKeyRef:
                 name: backend-secret
                 key: jwt-secret
           livenessProbe:
             httpGet:
               path: /health
               port: 5000
             initialDelaySeconds: 30
             periodSeconds: 10
           readinessProbe:
             httpGet:
               path: /health
               port: 5000
             initialDelaySeconds: 5
             periodSeconds: 5
   ```
   
   **Frontend Deployment**:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: frontend
     namespace: jcf-wfm
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: frontend
     template:
       metadata:
         labels:
           app: frontend
       spec:
         containers:
         - name: frontend
           image: jcf-wfm/frontend:latest
           ports:
           - containerPort: 80
   ```
   
   **Services**:
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: mongodb
     namespace: jcf-wfm
   spec:
     selector:
       app: mongodb
     ports:
     - port: 27017
       targetPort: 27017
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: backend
     namespace: jcf-wfm
   spec:
     selector:
       app: backend
     ports:
     - port: 5000
       targetPort: 5000
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: frontend
     namespace: jcf-wfm
   spec:
     selector:
       app: frontend
     ports:
     - port: 80
       targetPort: 80
   ```
   
   **Ingress**:
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: jcf-wfm-ingress
     namespace: jcf-wfm
     annotations:
       kubernetes.io/ingress.class: nginx
       cert-manager.io/cluster-issuer: letsencrypt-prod
   spec:
     tls:
     - hosts:
       - jcf-wfm.gov.jm
       secretName: jcf-wfm-tls
     rules:
     - host: jcf-wfm.gov.jm
       http:
         paths:
         - path: /api
           pathType: Prefix
           backend:
             service:
               name: backend
               port:
                 number: 5000
         - path: /
           pathType: Prefix
           backend:
             service:
               name: frontend
               port:
                 number: 80
   ```

2. **Apply Kubernetes Manifests**:
   ```bash
   kubectl apply -f kubernetes/
   ```

## Integration with Existing Systems

### Active Directory Integration

To integrate with Active Directory for authentication:

1. **Install Required Packages**:
   ```bash
   npm install passport-ldapauth
   ```

2. **Configure LDAP Authentication**:
   ```javascript
   // In auth.js or similar file
   const passport = require('passport');
   const LdapStrategy = require('passport-ldapauth').Strategy;
   
   passport.use(new LdapStrategy({
     server: {
       url: 'ldap://ad.jcf.gov.jm',
       bindDN: 'cn=serviceaccount,ou=ServiceAccounts,dc=jcf,dc=gov,dc=jm',
       bindCredentials: 'service_account_password',
       searchBase: 'ou=Users,dc=jcf,dc=gov,dc=jm',
       searchFilter: '(sAMAccountName={{username}})'
     }
   }));
   ```

3. **Create Login Route**:
   ```javascript
   app.post('/api/auth/ldap', passport.authenticate('ldapauth', { session: false }), (req, res) => {
     // Generate JWT token
     const token = generateToken(req.user);
     res.json({ token, user: req.user });
   });
   ```

### Email System Integration

To integrate with the JCF email system for notifications:

1. **Install Required Packages**:
   ```bash
   npm install nodemailer
   ```

2. **Configure Email Service**:
   ```javascript
   // In email-service.js or similar file
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     secure: process.env.SMTP_PORT === '465',
     auth: {
       user: process.env.SMTP_USER,
       pass: process.env.SMTP_PASS
     }
   });
   
   async function sendEmail(to, subject, text, html) {
     try {
       const info = await transporter.sendMail({
         from: '"JCF Workforce Management" <notifications@jcf-wfm.gov.jm>',
         to,
         subject,
         text,
         html
       });
       return info;
     } catch (error) {
       console.error('Email sending failed:', error);
       throw error;
     }
   }
   
   module.exports = { sendEmail };
   ```

### Radio System Integration

To integrate with the JCF radio system for emergency alerts:

1. **Create Radio API Client**:
   ```javascript
   // In radio-service.js or similar file
   const axios = require('axios');
   
   const radioApiClient = axios.create({
     baseURL: process.env.RADIO_API_URL,
     headers: {
       'Authorization': `Bearer ${process.env.RADIO_API_KEY}`,
       'Content-Type': 'application/json'
     }
   });
   
   async function sendEmergencyAlert(officerId, location, message) {
     try {
       const response = await radioApiClient.post('/alerts', {
         officerId,
         location,
         message,
         priority: 'high'
       });
       return response.data;
     } catch (error) {
       console.error('Emergency alert failed:', error);
       throw error;
     }
   }
   
   module.exports = { sendEmergencyAlert };
   ```

## Security Implementation

### SSL/TLS Configuration

1. **Generate SSL Certificate** using Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d jcf-wfm.gov.jm
   ```

2. **Configure Auto-renewal**:
   ```bash
   sudo systemctl status certbot.timer
   ```

### Data Encryption

1. **Database Encryption**:
   
   For MongoDB:
   ```javascript
   // In mongoose schema
   const userSchema = new mongoose.Schema({
     // ...
     password: {
       type: String,
       required: true
     },
     personalInfo: {
       type: String,
       required: true,
       encrypt: true // Field-level encryption
     }
   });
   
   // Encrypt password before saving
   userSchema.pre('save', async function(next) {
     if (this.isModified('password')) {
       this.password = await bcrypt.hash(this.password, 10);
     }
     next();
   });
   ```

2. **API Data Encryption**:
   ```javascript
   // In middleware/encryption.js
   const crypto = require('crypto');
   
   const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
   const IV_LENGTH = 16;
   
   function encrypt(text) {
     const iv = crypto.randomBytes(IV_LENGTH);
     const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
     let encrypted = cipher.update(text);
     encrypted = Buffer.concat([encrypted, cipher.final()]);
     return iv.toString('hex') + ':' + encrypted.toString('hex');
   }
   
   function decrypt(text) {
     const textParts = text.split(':');
     const iv = Buffer.from(textParts.shift(), 'hex');
     const encryptedText = Buffer.from(textParts.join(':'), 'hex');
     const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
     let decrypted = decipher.update(encryptedText);
     decrypted = Buffer.concat([decrypted, decipher.final()]);
     return decrypted.toString();
   }
   
   module.exports = { encrypt, decrypt };
   ```

### Authentication Security

1. **JWT Configuration**:
   ```javascript
   // In auth.js
   const jwt = require('jsonwebtoken');
   
   function generateToken(user) {
     return jwt.sign(
       { 
         id: user._id,
         role: user.role,
         department: user.department
       },
       process.env.JWT_SECRET,
       { expiresIn: process.env.JWT_EXPIRATION }
     );
   }
   
   function verifyToken(req, res, next) {
     const authHeader = req.headers.authorization;
     
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ message: 'No token provided' });
     }
     
     const token = authHeader.split(' ')[1];
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (error) {
       return res.status(401).json({ message: 'Invalid or expired token' });
     }
   }
   
   module.exports = { generateToken, verifyToken };
   ```

2. **Password Policy**:
   ```javascript
   // In validators/password.js
   function validatePassword(password) {
     // At least 8 characters
     if (password.length < 8) {
       return false;
     }
     
     // At least one uppercase letter
     if (!/[A-Z]/.test(password)) {
       return false;
     }
     
     // At least one lowercase letter
     if (!/[a-z]/.test(password)) {
       return false;
     }
     
     // At least one number
     if (!/[0-9]/.test(password)) {
       return false;
     }
     
     // At least one special character
     if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
       return false;
     }
     
     return true;
   }
   
   module.exports = { validatePassword };
   ```

### API Security

1. **Rate Limiting**:
   ```javascript
   // In middleware/rate-limit.js
   const rateLimit = require('express-rate-limit');
   
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP, please try again after 15 minutes'
   });
   
   const authLimiter = rateLimit({
     windowMs: 60 * 60 * 1000, // 1 hour
     max: 5, // limit each IP to 5 failed login attempts per hour
     message: 'Too many login attempts from this IP, please try again after an hour'
   });
   
   module.exports = { apiLimiter, authLimiter };
   ```

2. **Input Validation**:
   ```javascript
   // In middleware/validation.js
   const { body, validationResult } = require('express-validator');
   
   const loginValidation = [
     body('email').isEmail().withMessage('Please enter a valid email'),
     body('password').notEmpty().withMessage('Password is required')
   ];
   
   const userValidation = [
     body('firstName').notEmpty().withMessage('First name is required'),
     body('lastName').notEmpty().withMessage('Last name is required'),
     body('email').isEmail().withMessage('Please enter a valid email'),
     body('badgeNumber').notEmpty().withMessage('Badge number is required'),
     body('role').isIn(['admin', 'supervisor', 'officer']).withMessage('Invalid role'),
     body('department').notEmpty().withMessage('Department is required')
   ];
   
   const validate = (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     next();
   };
   
   module.exports = {
     loginValidation,
     userValidation,
     validate
   };
   ```

## Testing Procedures

### Unit Testing

1. **Install Testing Dependencies**:
   ```bash
   npm install --save-dev jest supertest
   ```

2. **Configure Jest**:
   ```javascript
   // In jest.config.js
   module.exports = {
     testEnvironment: 'node',
     coveragePathIgnorePatterns: ['/node_modules/'],
     coverageReporters: ['text', 'lcov', 'clover'],
     testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
   };
   ```

3. **Write Unit Tests**:
   ```javascript
   // In __tests__/auth.test.js
   const request = require('supertest');
   const app = require('../app');
   const User = require('../models/user.model');
   
   describe('Authentication API', () => {
     beforeAll(async () => {
       // Connect to test database
       // ...
     });
     
     afterAll(async () => {
       // Disconnect from test database
       // ...
     });
     
     it('should register a new user', async () => {
       const res = await request(app)
         .post('/api/auth/register')
         .send({
           firstName: 'Test',
           lastName: 'User',
           email: 'test@example.com',
           password: 'Password123!',
           badgeNumber: 'TEST123',
           role: 'officer',
           department: 'Test Department'
         });
       
       expect(res.statusCode).toEqual(201);
       expect(res.body).toHaveProperty('user');
       expect(res.body.user).toHaveProperty('email', 'test@example.com');
     });
     
     it('should login a user', async () => {
       const res = await request(app)
         .post('/api/auth/login')
         .send({
           email: 'test@example.com',
           password: 'Password123!'
         });
       
       expect(res.statusCode).toEqual(200);
       expect(res.body).toHaveProperty('token');
       expect(res.body).toHaveProperty('user');
     });
   });
   ```

4. **Run Tests**:
   ```bash
   npm test
   ```

### Integration Testing

1. **Write Integration Tests**:
   ```javascript
   // In __tests__/integration/shift.test.js
   const request = require('supertest');
   const app = require('../../app');
   const mongoose = require('mongoose');
   const User = require('../../models/user.model');
   const Shift = require('../../models/shift.model');
   
   describe('Shift API Integration', () => {
     let token;
     let supervisorId;
     
     beforeAll(async () => {
       // Connect to test database
       // ...
       
       // Create test supervisor
       const supervisor = await User.create({
         firstName: 'Test',
         lastName: 'Supervisor',
         email: 'supervisor@example.com',
         password: 'Password123!',
         badgeNumber: 'SUPER123',
         role: 'supervisor',
         department: 'Test Department'
       });
       
       supervisorId = supervisor._id;
       
       // Login to get token
       const res = await request(app)
         .post('/api/auth/login')
         .send({
           email: 'supervisor@example.com',
           password: 'Password123!'
         });
       
       token = res.body.token;
     });
     
     afterAll(async () => {
       // Clean up test data
       await User.deleteMany({});
       await Shift.deleteMany({});
       
       // Disconnect from test database
       await mongoose.connection.close();
     });
     
     it('should create a new shift', async () => {
       const res = await request(app)
         .post('/api/shifts')
         .set('Authorization', `Bearer ${token}`)
         .send({
           name: 'Test Shift',
           startTime: '08:00',
           endTime: '16:00',
           department: 'Test Department',
           description: 'Test shift description',
           capacity: 5,
           recurrence: 'daily'
         });
       
       expect(res.statusCode).toEqual(201);
       expect(res.body).toHaveProperty('shift');
       expect(res.body.shift).toHaveProperty('name', 'Test Shift');
     });
     
     it('should get all shifts', async () => {
       const res = await request(app)
         .get('/api/shifts')
         .set('Authorization', `Bearer ${token}`);
       
       expect(res.statusCode).toEqual(200);
       expect(res.body).toHaveProperty('shifts');
       expect(Array.isArray(res.body.shifts)).toBe(true);
     });
   });
   ```

2. **Run Integration Tests**:
   ```bash
   npm run test:integration
   ```

### Load Testing

1. **Install Artillery**:
   ```bash
   npm install -g artillery
   ```

2. **Create Load Test Scenario**:
   ```yaml
   # In load-test.yml
   config:
     target: "https://api.jcf-wfm.gov.jm"
     phases:
       - duration: 60
         arrivalRate: 5
         rampTo: 50
         name: "Warm up phase"
       - duration: 120
         arrivalRate: 50
         name: "Sustained load phase"
     defaults:
       headers:
         Content-Type: "application/json"
   
   scenarios:
     - name: "Login and view shifts"
       flow:
         - post:
             url: "/api/auth/login"
             json:
               email: "{{ $processEnvironment.TEST_USER }}"
               password: "{{ $processEnvironment.TEST_PASSWORD }}"
             capture:
               - json: "$.token"
                 as: "token"
         - get:
             url: "/api/shifts"
             headers:
               Authorization: "Bearer {{ token }}"
         - get:
             url: "/api/users/me"
             headers:
               Authorization: "Bearer {{ token }}"
   ```

3. **Run Load Test**:
   ```bash
   TEST_USER=loadtest@jcf-wfm.gov.jm TEST_PASSWORD=LoadTest123! artillery run load-test.yml
   ```

## Maintenance and Updates

### Backup Procedures

1. **Database Backup Script**:
   ```bash
   #!/bin/bash
   # In scripts/backup.sh
   
   # Set variables
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_DIR="/opt/jcf-wfm/backups"
   MONGODB_HOST="localhost"
   MONGODB_PORT="27017"
   MONGODB_USER="jcf_admin"
   MONGODB_PASSWORD="secure_password"
   MONGODB_DB="jcf_wfm"
   POSTGRES_HOST="localhost"
   POSTGRES_PORT="5432"
   POSTGRES_USER="jcf_admin"
   POSTGRES_PASSWORD="secure_password"
   POSTGRES_DB="jcf_wfm"
   
   # Create backup directory if it doesn't exist
   mkdir -p $BACKUP_DIR
   
   # MongoDB backup
   echo "Starting MongoDB backup..."
   mongodump --host $MONGODB_HOST --port $MONGODB_PORT --username $MONGODB_USER --password $MONGODB_PASSWORD --db $MONGODB_DB --out $BACKUP_DIR/mongodb_$TIMESTAMP
   
   # PostgreSQL backup
   echo "Starting PostgreSQL backup..."
   PGPASSWORD=$POSTGRES_PASSWORD pg_dump -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -F c -f $BACKUP_DIR/postgres_$TIMESTAMP.dump
   
   # Compress backups
   echo "Compressing backups..."
   tar -czf $BACKUP_DIR/mongodb_$TIMESTAMP.tar.gz -C $BACKUP_DIR mongodb_$TIMESTAMP
   rm -rf $BACKUP_DIR/mongodb_$TIMESTAMP
   
   # Clean up old backups (keep last 30 days)
   echo "Cleaning up old backups..."
   find $BACKUP_DIR -name "mongodb_*.tar.gz" -type f -mtime +30 -delete
   find $BACKUP_DIR -name "postgres_*.dump" -type f -mtime +30 -delete
   
   echo "Backup completed successfully!"
   ```

2. **Schedule Backup with Cron**:
   ```bash
   crontab -e
   ```
   
   Add:
   ```
   0 2 * * * /opt/jcf-wfm/scripts/backup.sh >> /var/log/jcf-wfm-backup.log 2>&1
   ```

### Update Procedures

1. **Backend Update Script**:
   ```bash
   #!/bin/bash
   # In scripts/update-backend.sh
   
   # Set variables
   APP_DIR="/opt/jcf-wfm"
   BACKUP_DIR="$APP_DIR/backups/updates"
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   
   # Create backup directory if it doesn't exist
   mkdir -p $BACKUP_DIR
   
   # Backup current version
   echo "Backing up current version..."
   tar -czf $BACKUP_DIR/backend_$TIMESTAMP.tar.gz -C $APP_DIR backend
   
   # Pull latest changes
   echo "Pulling latest changes..."
   cd $APP_DIR
   git pull origin main
   
   # Install dependencies
   echo "Installing dependencies..."
   cd $APP_DIR/backend
   npm install --production
   
   # Run database migrations
   echo "Running database migrations..."
   npm run db:migrate
   
   # Restart application
   echo "Restarting application..."
   pm2 restart jcf-wfm-api
   
   echo "Update completed successfully!"
   ```

2. **Frontend Update Script**:
   ```bash
   #!/bin/bash
   # In scripts/update-frontend.sh
   
   # Set variables
   APP_DIR="/opt/jcf-wfm"
   BACKUP_DIR="$APP_DIR/backups/updates"
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   
   # Create backup directory if it doesn't exist
   mkdir -p $BACKUP_DIR
   
   # Backup current build
   echo "Backing up current build..."
   tar -czf $BACKUP_DIR/frontend_build_$TIMESTAMP.tar.gz -C $APP_DIR/frontend build
   
   # Pull latest changes
   echo "Pulling latest changes..."
   cd $APP_DIR
   git pull origin main
   
   # Install dependencies
   echo "Installing dependencies..."
   cd $APP_DIR/frontend
   npm install
   
   # Build frontend
   echo "Building frontend..."
   npm run build
   
   echo "Update completed successfully!"
   ```

### Monitoring

1. **Install Monitoring Tools**:
   ```bash
   npm install pm2-prometheus-exporter
   ```

2. **Configure Prometheus Metrics**:
   ```javascript
   // In monitoring.js
   const express = require('express');
   const client = require('prom-client');
   
   const register = new client.Registry();
   
   // Add default metrics
   client.collectDefaultMetrics({ register });
   
   // Custom metrics
   const httpRequestDurationMicroseconds = new client.Histogram({
     name: 'http_request_duration_ms',
     help: 'Duration of HTTP requests in ms',
     labelNames: ['method', 'route', 'status'],
     buckets: [0.1, 5, 15, 50, 100, 500]
   });
   
   register.registerMetric(httpRequestDurationMicroseconds);
   
   const activeUsers = new client.Gauge({
     name: 'active_users',
     help: 'Number of active users'
   });
   
   register.registerMetric(activeUsers);
   
   // Middleware to measure request duration
   function measureRequestDuration(req, res, next) {
     const end = httpRequestDurationMicroseconds.startTimer();
     res.on('finish', () => {
       end({ method: req.method, route: req.route?.path || req.path, status: res.statusCode });
     });
     next();
   }
   
   // Metrics endpoint
   const metricsApp = express();
   
   metricsApp.get('/metrics', async (req, res) => {
     res.set('Content-Type', register.contentType);
     res.end(await register.metrics());
   });
   
   metricsApp.listen(9090, () => {
     console.log('Metrics server listening on port 9090');
   });
   
   module.exports = { measureRequestDuration, activeUsers };
   ```

3. **Configure Grafana Dashboard**:
   - Install Grafana
   - Add Prometheus as a data source
   - Import or create dashboards for monitoring

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer Configuration** with Nginx:
   ```nginx
   upstream backend_servers {
       server backend1.jcf-wfm.local:5000;
       server backend2.jcf-wfm.local:5000;
       server backend3.jcf-wfm.local:5000;
   }
   
   server {
       listen 80;
       server_name api.jcf-wfm.gov.jm;
       
       location / {
           proxy_pass http://backend_servers;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Session Management** with Redis:
   ```javascript
   // In app.js
   const session = require('express-session');
   const RedisStore = require('connect-redis').default;
   const { createClient } = require('redis');
   
   // Redis client
   const redisClient = createClient({
     url: process.env.REDIS_URL || 'redis://localhost:6379'
   });
   
   redisClient.connect().catch(console.error);
   
   // Session configuration
   app.use(session({
     store: new RedisStore({ client: redisClient }),
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
     cookie: {
       secure: process.env.NODE_ENV === 'production',
       httpOnly: true,
       maxAge: 24 * 60 * 60 * 1000 // 1 day
     }
   }));
   ```

### Database Scaling

1. **MongoDB Replication**:
   ```bash
   # Create replica set configuration
   cat > /etc/mongodb/replset.conf << EOF
   replication:
     replSetName: "jcf_wfm_rs"
   EOF
   
   # Restart MongoDB
   sudo systemctl restart mongodb
   
   # Initialize replica set
   mongo
   ```
   
   ```javascript
   rs.initiate({
     _id: "jcf_wfm_rs",
     members: [
       { _id: 0, host: "mongodb1:27017" },
       { _id: 1, host: "mongodb2:27017" },
       { _id: 2, host: "mongodb3:27017" }
     ]
   })
   ```

2. **PostgreSQL Replication**:
   ```bash
   # On primary server
   sudo nano /etc/postgresql/12/main/postgresql.conf
   ```
   
   Add:
   ```
   wal_level = replica
   max_wal_senders = 10
   wal_keep_segments = 64
   ```
   
   ```bash
   sudo nano /etc/postgresql/12/main/pg_hba.conf
   ```
   
   Add:
   ```
   host    replication     postgres        replica_server_ip/32        md5
   ```
   
   ```bash
   # On replica server
   sudo -u postgres pg_basebackup -h primary_server_ip -D /var/lib/postgresql/12/main -U postgres -P -v -R
   ```

## Disaster Recovery

### Recovery Plan

1. **Database Recovery**:
   ```bash
   # MongoDB recovery
   mongorestore --host localhost --port 27017 --username jcf_admin --password secure_password --db jcf_wfm /path/to/backup/mongodb_20250411_020000
   
   # PostgreSQL recovery
   PGPASSWORD=secure_password pg_restore -h localhost -p 5432 -U jcf_admin -d jcf_wfm -v /path/to/backup/postgres_20250411_020000.dump
   ```

2. **Application Recovery**:
   ```bash
   # Restore from backup
   tar -xzf /path/to/backup/backend_20250411_020000.tar.gz -C /opt/jcf-wfm
   tar -xzf /path/to/backup/frontend_build_20250411_020000.tar.gz -C /opt/jcf-wfm/frontend
   
   # Restart services
   pm2 restart all
   sudo systemctl restart nginx
   ```

### Failover Configuration

1. **Automated Failover** with Keepalived:
   ```bash
   sudo apt install keepalived
   ```
   
   ```bash
   # On primary server
   sudo nano /etc/keepalived/keepalived.conf
   ```
   
   ```
   vrrp_script check_nginx {
       script "/usr/bin/pgrep nginx"
       interval 2
       weight 2
   }
   
   vrrp_instance VI_1 {
       state MASTER
       interface eth0
       virtual_router_id 51
       priority 101
       advert_int 1
       authentication {
           auth_type PASS
           auth_pass jcf_secret
       }
       virtual_ipaddress {
           192.168.1.100
       }
       track_script {
           check_nginx
       }
   }
   ```
   
   ```bash
   # On backup server
   sudo nano /etc/keepalived/keepalived.conf
   ```
   
   ```
   vrrp_script check_nginx {
       script "/usr/bin/pgrep nginx"
       interval 2
       weight 2
   }
   
   vrrp_instance VI_1 {
       state BACKUP
       interface eth0
       virtual_router_id 51
       priority 100
       advert_int 1
       authentication {
           auth_type PASS
           auth_pass jcf_secret
       }
       virtual_ipaddress {
           192.168.1.100
       }
       track_script {
           check_nginx
       }
   }
   ```
   
   ```bash
   # Start keepalived on both servers
   sudo systemctl enable keepalived
   sudo systemctl start keepalived
   ```

2. **Data Synchronization**:
   ```bash
   # Set up rsync for configuration files
   sudo nano /etc/cron.d/rsync-config
   ```
   
   ```
   */5 * * * * root rsync -avz --delete /opt/jcf-wfm/config/ backup-server:/opt/jcf-wfm/config/
   ```

This implementation guide provides a comprehensive roadmap for deploying the Jamaica Constabulary Force Workforce Management System. By following these instructions, IT staff can successfully install, configure, and maintain the system to meet the specific needs of the police department.
