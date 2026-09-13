from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import requests
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# MongoDB configuration
app.config['MONGO_URI'] = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/ecotracker')

# Initialize extensions
CORS(app)
jwt = JWTManager(app)
mongo = PyMongo(app)

# Cloudinary configuration
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Google Maps API key
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

# Helper function to serialize ObjectId
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

# Routes

@app.route('/')
def home():
    return jsonify({
        'message': 'EcoTracker API is running!',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth',
            'users': '/api/users',
            'reports': '/api/reports',
            'admin': '/api/admin'
        }
    })

# Authentication Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'fullName']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user already exists
        if mongo.db.users.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already registered'}), 400
        
        if mongo.db.users.find_one({'username': data['username']}):
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create new user
        user_data = {
            'username': data['username'],
            'email': data['email'],
            'password': generate_password_hash(data['password']),
            'fullName': data['fullName'],
            'role': 'citizen',
            'points': 0,
            'level': 1,
            'createdAt': datetime.utcnow(),
            'isActive': True
        }
        
        result = mongo.db.users.insert_one(user_data)
        user_data['_id'] = str(result.inserted_id)
        del user_data['password']
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            'message': 'User registered successfully',
            'user': serialize_doc(user_data),
            'access_token': access_token
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = mongo.db.users.find_one({'email': data['email']})
        
        if not user or not check_password_hash(user['password'], data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.get('isActive', True):
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        # Remove password from response
        user_data = serialize_doc(user)
        del user_data['password']
        
        return jsonify({
            'message': 'Login successful',
            'user': user_data,
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = serialize_doc(user)
        del user_data['password']
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Waste Reports Routes
@app.route('/api/reports', methods=['POST'])
@jwt_required()
def create_report():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['description', 'location', 'wasteType']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create report
        report_data = {
            'userId': ObjectId(user_id),
            'description': data['description'],
            'location': data['location'],
            'wasteType': data['wasteType'],
            'imageUrl': data.get('imageUrl', ''),
            'status': 'pending',
            'points': 10,  # Base points for reporting
            'createdAt': datetime.utcnow(),
            'verifiedAt': None,
            'verifiedBy': None
        }
        
        result = mongo.db.reports.insert_one(report_data)
        report_data['_id'] = str(result.inserted_id)
        
        # Update user points
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$inc': {'points': report_data['points']}}
        )
        
        return jsonify({
            'message': 'Report created successfully',
            'report': serialize_doc(report_data)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reports', methods=['GET'])
@jwt_required()
def get_reports():
    try:
        user_id = get_jwt_identity()
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        
        # Check if user is admin
        if user.get('role') == 'admin':
            reports = list(mongo.db.reports.find().sort('createdAt', -1))
        else:
            reports = list(mongo.db.reports.find({'userId': ObjectId(user_id)}).sort('createdAt', -1))
        
        return jsonify({
            'reports': [serialize_doc(report) for report in reports]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin Routes
@app.route('/api/admin/reports/<report_id>/verify', methods=['PUT'])
@jwt_required()
def verify_report(report_id):
    try:
        user_id = get_jwt_identity()
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        
        if user.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        status = data.get('status')  # 'approved' or 'rejected'
        
        if status not in ['approved', 'rejected']:
            return jsonify({'error': 'Invalid status. Must be approved or rejected'}), 400
        
        # Update report
        update_data = {
            'status': status,
            'verifiedAt': datetime.utcnow(),
            'verifiedBy': ObjectId(user_id)
        }
        
        result = mongo.db.reports.update_one(
            {'_id': ObjectId(report_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Report not found'}), 404
        
        return jsonify({'message': f'Report {status} successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Leaderboard Routes
@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        # Get top users by points
        users = list(mongo.db.users.find(
            {'role': 'citizen', 'isActive': True}
        ).sort('points', -1).limit(50))
        
        leaderboard = []
        for i, user in enumerate(users):
            leaderboard.append({
                'rank': i + 1,
                'username': user['username'],
                'fullName': user['fullName'],
                'points': user.get('points', 0),
                'level': user.get('level', 1)
            })
        
        return jsonify({'leaderboard': leaderboard}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Google Maps Integration
@app.route('/api/maps/nearby-bins', methods=['GET'])
def get_nearby_bins():
    try:
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        radius = request.args.get('radius', 1000)  # Default 1km radius
        
        if not lat or not lng:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # This would typically query your database for nearby bins
        # For now, returning mock data
        nearby_bins = [
            {
                'id': '1',
                'name': 'Community Bin - Park Street',
                'location': {'lat': float(lat) + 0.001, 'lng': float(lng) + 0.001},
                'type': 'general',
                'distance': 150
            },
            {
                'id': '2',
                'name': 'Recycling Center - Main Road',
                'location': {'lat': float(lat) - 0.002, 'lng': float(lng) + 0.001},
                'type': 'recycling',
                'distance': 300
            }
        ]
        
        return jsonify({'bins': nearby_bins}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Analytics Routes
@app.route('/api/analytics/dashboard', methods=['GET'])
@jwt_required()
def get_analytics():
    try:
        user_id = get_jwt_identity()
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
        
        if user.get('role') != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get analytics data
        total_reports = mongo.db.reports.count_documents({})
        pending_reports = mongo.db.reports.count_documents({'status': 'pending'})
        approved_reports = mongo.db.reports.count_documents({'status': 'approved'})
        total_users = mongo.db.users.count_documents({'role': 'citizen'})
        
        # Get reports by waste type
        waste_types = mongo.db.reports.aggregate([
            {'$group': {'_id': '$wasteType', 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}}
        ])
        
        analytics = {
            'overview': {
                'totalReports': total_reports,
                'pendingReports': pending_reports,
                'approvedReports': approved_reports,
                'totalUsers': total_users
            },
            'wasteTypes': list(waste_types)
        }
        
        return jsonify(analytics), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
