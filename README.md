# ClimateHub - Singapore's Climate Action Platform

ClimateHub is a comprehensive full-stack web application designed to empower Singaporeans to take climate action. The platform provides carbon footprint tracking, environmental education, community events, and personalized climate action recommendations.

## 🌟 Features

### 🏠 Landing Page
- Informational homepage with sections about ClimateHub, mission, services, and contact
- Modern, responsive design with beautiful UI/UX
- Call-to-action buttons for carbon tracking and education

### 📊 Carbon Footprint Tracker
- Multi-step form covering 8 lifestyle categories:
  - Fast Fashion (clothing consumption)
  - Diet (food choices and local sourcing)
  - Transport (public/private vehicle usage)
  - Travel (air travel frequency)
  - Electricity (home energy consumption)
  - Waste (generation and recycling)
  - Outings (entertainment activities)
  - Electronics (device ownership and usage)
- Real-time calculation using emission factors dataset
- Comparison with Singapore and global averages
- Interactive charts and visualizations
- Save results to user profile when logged in

### 📚 Education Hub
- Static content on Singapore's environmental initiatives
- RSS-based news reader with climate/environment news
- Integrated AI chatbot for eco-related questions
- Filterable news by local/global categories
- Educational content on government policies

### 📅 Event Calendar
- List of environmental community events in Singapore
- Calendar view with filters (upcoming, ongoing, category)
- Allow logged-in users to submit events
- Event management (create, edit, delete)
- Search and filter functionality

### 🔐 Authentication & Profiles
- Firebase-based signup/login system
- User profiles with carbon footprint history
- Badge system for eco actions
- Progress tracking and achievements
- Profile customization

## 🛠 Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Firebase Auth** - Authentication
- **RSS Parser** - News feed integration
- **OpenAI API** - AI chatbot (optional)

### Deployment
- **Hostinger VPS** - Full-stack hosting (frontend + backend)
- **Nginx** - Web server and reverse proxy
- **PM2** - Node.js process manager
- **MongoDB Atlas** - Cloud database

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Firebase project (for authentication)
- OpenAI API key (optional, for chatbot)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd climatehub
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Backend (create `backend/.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/climatehub
   FRONTEND_URL=http://localhost:3000
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   OPENAI_API_KEY=your-openai-api-key
   JWT_SECRET=your-jwt-secret-key
   ```

   Frontend (create `frontend/.env`):
   ```env
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

5. **Start the development servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
climatehub/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── data/             # Emission factors dataset
│   ├── server.js         # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   └── App.js        # Main app component
│   ├── public/           # Static assets
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Google sign-in)
3. Create a service account and download the key
4. Add the configuration to your environment variables

### MongoDB Setup
1. Create a MongoDB database (local or Atlas)
2. Update the `MONGODB_URI` in your environment variables
3. The application will automatically create the required collections

### OpenAI Setup (Optional)
1. Get an API key from https://platform.openai.com
2. Add it to your backend environment variables
3. Uncomment the OpenAI integration in `backend/routes/chatbot.js`

## 🚀 Deployment

### Frontend (Hostinger VPS)
1. Build the React app: `npm run build`
2. Upload the `build` folder to your VPS
3. Configure Nginx to serve the static files
4. Set up SSL certificate for HTTPS
5. Configure domain DNS settings

### Backend (Render/Heroku)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in the platform dashboard

### Database (MongoDB Atlas)
1. Create a cluster in MongoDB Atlas
2. Get your connection string
3. Update `MONGODB_URI` in your deployment environment

## 🖥️ VPS Deployment Guide

### Frontend Deployment on Hostinger VPS

#### Step 1: Build the React App
```bash
cd frontend
npm run build
```
This creates a `build` folder with optimized static files.

#### Step 2: Upload to VPS
1. Connect to your VPS via SSH
2. Upload the `build` folder to `/var/www/climatehub/`
3. Set proper permissions:
```bash
sudo chown -R www-data:www-data /var/www/climatehub/
sudo chmod -R 755 /var/www/climatehub/
```

#### Step 3: Configure Nginx
Create `/etc/nginx/sites-available/climatehub`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/climatehub;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy to backend
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
}
```

#### Step 4: Enable Site and SSL
```bash
sudo ln -s /etc/nginx/sites-available/climatehub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### Step 5: Backend Deployment on Same VPS
1. Upload backend files to `/var/www/climatehub-backend/`
2. Install Node.js and PM2:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

3. Install dependencies and start:
```bash
cd /var/www/climatehub-backend
npm install
pm2 start server.js --name climatehub-backend
pm2 startup
pm2 save
```

#### Step 6: Environment Variables on VPS
Create `/var/www/climatehub-backend/.env`:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
FRONTEND_URL=https://your-domain.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-jwt-secret-key
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login/registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/badges` - Add badge to user

### Carbon Footprint
- `POST /api/carbon/calculate` - Calculate carbon footprint
- `POST /api/carbon/save` - Save calculation results
- `GET /api/carbon/history` - Get user's calculation history
- `GET /api/carbon/factors` - Get emission factors

### News
- `GET /api/news` - Get climate news
- `GET /api/news/category/:category` - Get news by category
- `GET /api/news/search` - Search news
- `GET /api/news/feeds` - Get available RSS feeds

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/categories/list` - Get event categories

### Chatbot
- `POST /api/chatbot/chat` - Send message to AI chatbot
- `GET /api/chatbot/topics` - Get available topics
- `GET /api/chatbot/status` - Get chatbot status

## 🎨 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize:
- Colors in `frontend/tailwind.config.js`
- Component styles in `frontend/src/index.css`
- Individual component styling

### Content
- Update emission factors in `backend/data/emissionFactors.js`
- Modify RSS feeds in `backend/routes/news.js`
- Customize chatbot responses in `backend/routes/chatbot.js`

### Features
- Add new carbon footprint categories
- Implement additional badge types
- Extend event categories
- Add more educational content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Singapore's environmental policies and initiatives
- Climate science research and emission factors
- Open source community for tools and libraries
- Environmental organizations for inspiration

## 📞 Support

For support or questions:
- Create an issue in the repository
- Contact: info@climatehub.sg
- Documentation: [Add your docs URL]

---

**ClimateHub** - Empowering Singaporeans to take climate action, one footprint at a time. 🌱 