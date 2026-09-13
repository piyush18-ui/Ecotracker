import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, RefreshCw, Navigation } from 'lucide-react';

const VanTracking = () => {
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVan, setSelectedVan] = useState(null);

  useEffect(() => {
    fetchVanLocations();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchVanLocations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchVanLocations = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would call your backend API
      const mockVans = [
        {
          id: '1',
          driverName: 'John Smith',
          licensePlate: 'ABC-123',
          status: 'collecting',
          location: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.01,
            lng: -74.0060 + (Math.random() - 0.5) * 0.01
          },
          lastUpdate: new Date().toISOString(),
          route: 'Downtown Area',
          capacity: 75,
          nextStop: '123 Main Street',
          estimatedArrival: '15 minutes'
        },
        {
          id: '2',
          driverName: 'Sarah Johnson',
          licensePlate: 'XYZ-789',
          status: 'en_route',
          location: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.01,
            lng: -74.0060 + (Math.random() - 0.5) * 0.01
          },
          lastUpdate: new Date().toISOString(),
          route: 'Residential Zone A',
          capacity: 60,
          nextStop: '456 Oak Avenue',
          estimatedArrival: '25 minutes'
        },
        {
          id: '3',
          driverName: 'Mike Wilson',
          licensePlate: 'DEF-456',
          status: 'at_depot',
          location: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.01,
            lng: -74.0060 + (Math.random() - 0.5) * 0.01
          },
          lastUpdate: new Date().toISOString(),
          route: 'Industrial District',
          capacity: 90,
          nextStop: '789 Industrial Blvd',
          estimatedArrival: '45 minutes'
        }
      ];

      setVans(mockVans);
    } catch (error) {
      console.error('Error fetching van locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'collecting':
        return 'bg-green-100 text-green-800';
      case 'en_route':
        return 'bg-blue-100 text-blue-800';
      case 'at_depot':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'collecting':
        return 'Collecting';
      case 'en_route':
        return 'En Route';
      case 'at_depot':
        return 'At Depot';
      default:
        return 'Unknown';
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity > 80) return 'bg-red-500';
    if (capacity > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Van Tracking</h1>
          <p className="text-gray-600">
            Track garbage collection vans in real-time and see when they'll reach your area.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchVanLocations}
              disabled={loading}
              className="btn-primary flex items-center"
            >
              <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
              {loading ? 'Updating...' : 'Refresh'}
            </button>
            <span className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Van List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {vans.map(van => (
            <div key={van.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Truck className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{van.licensePlate}</h3>
                    <p className="text-sm text-gray-600">Driver: {van.driverName}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(van.status)}`}>
                  {getStatusText(van.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Route: </span>
                  <span className="font-medium ml-1">{van.route}</span>
                </div>

                <div className="flex items-center text-sm">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">Next Stop: </span>
                  <span className="font-medium ml-1">{van.nextStop}</span>
                </div>

                <div className="flex items-center text-sm">
                  <Navigation size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">ETA: </span>
                  <span className="font-medium ml-1 text-primary-600">{van.estimatedArrival}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">{van.capacity}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getCapacityColor(van.capacity)}`}
                      style={{ width: `${van.capacity}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedVan(van)}
                    className="w-full btn-primary text-sm"
                  >
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Map</h2>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <Truck className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-2">Interactive Map Coming Soon</p>
              <p className="text-sm text-gray-500">
                Real-time van tracking with Google Maps integration
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Schedule</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">Monday</span>
                <span className="text-sm text-gray-600">6:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">Tuesday</span>
                <span className="text-sm text-gray-600">6:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">Wednesday</span>
                <span className="text-sm text-gray-600">6:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium">Thursday</span>
                <span className="text-sm text-gray-600">6:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Friday</span>
                <span className="text-sm text-gray-600">6:00 AM - 2:00 PM</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Areas</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm">Downtown Area</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm">Residential Zone A</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm">Industrial District</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm">Suburban Areas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VanTracking;
