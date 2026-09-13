# 🌍 EcoTracker - Environmental Waste Management System

A comprehensive web application that empowers citizens to report waste, track environmental impact, and engage in sustainability through gamification.

## 🚀 Features

### Citizen Features
- 👤 **User Registration & Login** - Secure authentication system
- 📸 **Waste Reporting** - Upload photos with auto-location tagging
- 🤖 **AI Object Scanner** - YOLO-powered waste type detection
- 🎮 **Quizzes & Games** - Environmental awareness and engagement
- 🏆 **Leaderboard System** - Points, ranks, and rewards
- 🚛 **Van Tracking** - Real-time garbage van location
- 🗑️ **Nearby Dustbins** - Find nearest disposal facilities via Google Maps

### Admin Features
- 🔐 **Admin Login** - Role-based access control
- 📊 **Report Monitoring** - Verify and approve/reject waste reports
- 🏅 **Leaderboard Management** - Ensure fairness in rewards
- 🚚 **Van & Facility Tracking** - Monitor movement and manage bins
- 📈 **Analytics Dashboard** - Data visualizations with Chart.js/D3.js

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS + Bootstrap
- **Maps**: Google Maps API
- **Charts**: Chart.js
- **PWA**: Service Worker support

### Backend
- **Framework**: Flask (Python)
- **Authentication**: JWT tokens
- **Database**: MongoDB Atlas
- **AI**: YOLO model integration
- **File Storage**: Cloudinary

### Deployment
- **Backend**: Render/Railway
- **Frontend**: Netlify/Vercel
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
ecotracker/
├── frontend/          # React.js application
├── backend/           # Flask API server
├── models/           # AI models and utilities
├── docs/             # Documentation
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB Atlas account
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecotracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🔧 Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET_KEY=your-secret-key
GOOGLE_MAPS_API_KEY=your-maps-key
CLOUDINARY_URL=cloudinary://...
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_KEY=your-maps-key
```

## 📱 PWA Features
- Offline support
- Push notifications
- App-like experience
- Installable on mobile devices

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License.

## 🌟 Acknowledgments
- YOLO model for waste detection
- Google Maps API for location services
- Chart.js for data visualization
- MongoDB Atlas for database hosting
