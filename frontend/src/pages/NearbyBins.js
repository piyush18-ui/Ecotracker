import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Filter, RefreshCw, Info } from 'lucide-react';

const NearbyBins = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBins, setNearbyBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  const binTypes = [
    { key: 'all', label: 'All Types', color: 'bg-gray-500' },
    { key: 'general', label: 'General Waste', color: 'bg-gray-600' },
    { key: 'recycling', label: 'Recycling', color: 'bg-green-600' },
    { key: 'organic', label: 'Organic', color: 'bg-yellow-600' },
    { key: 'hazardous', label: 'Hazardous', color: 'bg-red-600' }
  ];

  useEffect(() => {
    getCurrentLocation();
    initializeMap();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyBins();
    }
  }, [userLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLoading(false);
        // Fallback to default location (New York)
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
      }
    );
  };

  const initializeMap = () => {
    if (window.google && mapRef.current) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 15,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(mapInstance);
    }
  };

  const fetchNearbyBins = async () => {
    if (!userLocation) return;

    try {
      // In a real app, this would call your backend API
      // For now, we'll use mock data
      const mockBins = [
        {
          id: '1',
          name: 'Community Bin - Park Street',
          type: 'general',
          location: {
            lat: userLocation.lat + 0.001,
            lng: userLocation.lng + 0.001
          },
          distance: 150,
          capacity: 80,
          lastEmptied: '2 hours ago',
          status: 'available'
        },
        {
          id: '2',
          name: 'Recycling Center - Main Road',
          type: 'recycling',
          location: {
            lat: userLocation.lat - 0.002,
            lng: userLocation.lng + 0.001
          },
          distance: 300,
          capacity: 60,
          lastEmptied: '1 hour ago',
          status: 'available'
        },
        {
          id: '3',
          name: 'Organic Waste Bin - Garden',
          type: 'organic',
          location: {
            lat: userLocation.lat + 0.001,
            lng: userLocation.lng - 0.002
          },
          distance: 250,
          capacity: 90,
          lastEmptied: '30 minutes ago',
          status: 'available'
        },
        {
          id: '4',
          name: 'Hazardous Waste Center',
          type: 'hazardous',
          location: {
            lat: userLocation.lat - 0.001,
            lng: userLocation.lng - 0.001
          },
          distance: 500,
          capacity: 40,
          lastEmptied: '1 day ago',
          status: 'available'
        }
      ];

      setNearbyBins(mockBins);
      updateMapMarkers(mockBins);
    } catch (error) {
      console.error('Error fetching nearby bins:', error);
    }
  };

  const updateMapMarkers = (bins) => {
    if (!map || !userLocation) return;

    // Clear existing markers
    if (window.markers) {
      window.markers.forEach(marker => marker.setMap(null));
    }
    window.markers = [];

    // Add user location marker
    const userMarker = new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Your Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3B82F6"/>
            <circle cx="12" cy="12" r="4" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24)
      }
    });

    // Add bin markers
    bins.forEach(bin => {
      const marker = new window.google.maps.Marker({
        position: bin.location,
        map: map,
        title: bin.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="4" width="12" height="16" rx="2" fill="${getBinColor(bin.type)}"/>
              <rect x="8" y="6" width="8" height="2" fill="white"/>
              <rect x="8" y="10" width="8" height="2" fill="white"/>
              <rect x="8" y="14" width="8" height="2" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${bin.name}</h3>
            <p class="text-sm text-gray-600">Type: ${bin.type}</p>
            <p class="text-sm text-gray-600">Distance: ${bin.distance}m</p>
            <p class="text-sm text-gray-600">Capacity: ${bin.capacity}%</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      window.markers.push(marker);
    });

    // Fit map to show all markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(userLocation);
    bins.forEach(bin => bounds.extend(bin.location));
    map.fitBounds(bounds);
  };

  const getBinColor = (type) => {
    const colors = {
      general: '#6B7280',
      recycling: '#10B981',
      organic: '#F59E0B',
      hazardous: '#EF4444'
    };
    return colors[type] || '#6B7280';
  };

  const getFilteredBins = () => {
    if (selectedFilter === 'all') {
      return nearbyBins;
    }
    return nearbyBins.filter(bin => bin.type === selectedFilter);
  };

  const getDirections = (bin) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.location.lat},${bin.location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nearby Waste Bins</h1>
          <p className="text-gray-600">
            Find the nearest waste disposal facilities in your area.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="btn-primary flex items-center"
          >
            <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
            {loading ? 'Locating...' : 'Refresh Location'}
          </button>

          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input-field"
            >
              {binTypes.map(type => (
                <option key={type.key} value={type.key}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              <div
                ref={mapRef}
                className="map-container"
                style={{ height: '500px' }}
              />
            </div>
          </div>

          {/* Bin List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Available Bins ({getFilteredBins().length})
            </h2>
            
            <div className="space-y-4">
              {getFilteredBins().map(bin => (
                <div key={bin.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {bin.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={14} className="mr-1" />
                        {bin.distance}m away
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${binTypes.find(t => t.key === bin.type)?.color}`}>
                      {bin.type}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">{bin.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          bin.capacity > 80 ? 'bg-red-500' :
                          bin.capacity > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${bin.capacity}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Last emptied: {bin.lastEmptied}
                    </p>
                  </div>

                  <button
                    onClick={() => getDirections(bin)}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Navigation size={16} className="mr-2" />
                    Get Directions
                  </button>
                </div>
              ))}

              {getFilteredBins().length === 0 && (
                <div className="card text-center py-8">
                  <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 mb-2">No bins found</p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your location or filter settings
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bin Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {binTypes.slice(1).map(type => (
              <div key={type.key} className="flex items-center">
                <div className={`w-4 h-4 ${type.color} rounded mr-2`}></div>
                <span className="text-sm text-gray-700">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 card bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <Info className="text-blue-600 mr-3 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Tips for Proper Waste Disposal</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Sort your waste by type before disposal</li>
                <li>• Check bin capacity before dumping</li>
                <li>• Report full or damaged bins to help others</li>
                <li>• Use the nearest bin to reduce transportation emissions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NearbyBins;
