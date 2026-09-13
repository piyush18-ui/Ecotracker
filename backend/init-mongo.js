// MongoDB initialization script
db = db.getSiblingDB('ecotracker');

// Create collections
db.createCollection('users');
db.createCollection('reports');
db.createCollection('facilities');
db.createCollection('vans');
db.createCollection('quizzes');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "points": -1 });
db.users.createIndex({ "createdAt": -1 });

db.reports.createIndex({ "userId": 1 });
db.reports.createIndex({ "status": 1 });
db.reports.createIndex({ "wasteType": 1 });
db.reports.createIndex({ "createdAt": -1 });
db.reports.createIndex({ "location": "2dsphere" });

db.facilities.createIndex({ "location": "2dsphere" });
db.facilities.createIndex({ "type": 1 });

db.vans.createIndex({ "status": 1 });
db.vans.createIndex({ "location": "2dsphere" });

// Insert sample admin user
db.users.insertOne({
  username: "admin",
  email: "admin@ecotracker.com",
  password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8K5K5K.", // password: admin123
  fullName: "System Administrator",
  role: "admin",
  points: 0,
  level: 1,
  createdAt: new Date(),
  isActive: true
});

// Insert sample facilities
db.facilities.insertMany([
  {
    name: "Community Bin - Park Street",
    type: "general",
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128]
    },
    capacity: 80,
    status: "available",
    lastEmptied: new Date(),
    createdAt: new Date()
  },
  {
    name: "Recycling Center - Main Road",
    type: "recycling",
    location: {
      type: "Point",
      coordinates: [-74.0050, 40.7118]
    },
    capacity: 60,
    status: "available",
    lastEmptied: new Date(),
    createdAt: new Date()
  },
  {
    name: "Organic Waste Bin - Garden",
    type: "organic",
    location: {
      type: "Point",
      coordinates: [-74.0070, 40.7138]
    },
    capacity: 90,
    status: "available",
    lastEmptied: new Date(),
    createdAt: new Date()
  }
]);

// Insert sample vans
db.vans.insertMany([
  {
    driverName: "John Smith",
    licensePlate: "ABC-123",
    status: "collecting",
    location: {
      type: "Point",
      coordinates: [-74.0060, 40.7128]
    },
    route: "Downtown Area",
    capacity: 75,
    lastUpdate: new Date(),
    createdAt: new Date()
  },
  {
    driverName: "Sarah Johnson",
    licensePlate: "XYZ-789",
    status: "en_route",
    location: {
      type: "Point",
      coordinates: [-74.0050, 40.7118]
    },
    route: "Residential Zone A",
    capacity: 60,
    lastUpdate: new Date(),
    createdAt: new Date()
  }
]);

print("Database initialized successfully!");
