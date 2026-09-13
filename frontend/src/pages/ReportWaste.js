import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Trash2, 
  Loader,
  CheckCircle,
  X,
  Image as ImageIcon
} from 'lucide-react';

const ReportWaste = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    wasteType: '',
    location: {
      lat: null,
      lng: null,
      address: ''
    }
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [aiDetection, setAiDetection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const fileInputRef = useRef(null);

  const wasteTypes = [
    'Plastic',
    'Paper',
    'Glass',
    'Metal',
    'Organic',
    'Electronic',
    'Hazardous',
    'Other'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Auto-detect waste type using AI
      detectWasteType(file);
    }
  };

  const detectWasteType = async (file) => {
    setDetecting(true);
    try {
      // Simulate AI detection - in real implementation, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI detection result
      const detectedType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      setAiDetection({
        type: detectedType,
        confidence: Math.floor(Math.random() * 30) + 70 // 70-100% confidence
      });
      
      setFormData(prev => ({
        ...prev,
        wasteType: detectedType
      }));
      
      toast.success(`AI detected: ${detectedType} (${Math.floor(Math.random() * 30) + 70}% confidence)`);
    } catch (error) {
      console.error('AI detection error:', error);
      toast.error('AI detection failed. Please select waste type manually.');
    } finally {
      setDetecting(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
          );
          const data = await response.json();
          
          const address = data.results[0]?.formatted_address || 'Unknown location';
          
          setFormData(prev => ({
            ...prev,
            location: {
              lat: latitude,
              lng: longitude,
              address: address
            }
          }));
          
          toast.success('Location detected successfully!');
        } catch (error) {
          console.error('Geocoding error:', error);
          setFormData(prev => ({
            ...prev,
            location: {
              lat: latitude,
              lng: longitude,
              address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }
          }));
          toast.success('Location detected!');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Unable to get your location. Please enter manually.');
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      toast.error('Please upload an image');
      return;
    }
    
    if (!formData.wasteType) {
      toast.error('Please select waste type');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please provide a description');
      return;
    }

    setLoading(true);
    
    try {
      // Upload image to Cloudinary (or your preferred service)
      const formDataToSend = new FormData();
      formDataToSend.append('file', image);
      formDataToSend.append('upload_preset', 'ecotracker'); // Replace with your preset
      
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataToSend
        }
      );
      
      const uploadData = await uploadResponse.json();
      
      // Submit report
      const reportData = {
        description: formData.description,
        wasteType: formData.wasteType,
        location: formData.location,
        imageUrl: uploadData.secure_url
      };
      
      const response = await axios.post('/api/reports', reportData);
      
      toast.success('Waste report submitted successfully!');
      
      // Reset form
      setFormData({
        description: '',
        wasteType: '',
        location: {
          lat: null,
          lng: null,
          address: ''
        }
      });
      setImage(null);
      setImagePreview(null);
      setAiDetection(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setAiDetection(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Waste</h1>
          <p className="text-gray-600">
            Help keep our environment clean by reporting waste in your area.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Photo</h2>
            
            {!imagePreview ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500">
                  PNG, JPG up to 5MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Waste preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                
                {detecting && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <Loader className="mx-auto mb-2 animate-spin" size={32} />
                      <p>AI is analyzing the image...</p>
                    </div>
                  </div>
                )}
                
                {aiDetection && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <CheckCircle size={16} className="mr-1" />
                    {aiDetection.type} ({aiDetection.confidence}%)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Waste Type Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Waste Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {wasteTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, wasteType: type }))}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.wasteType === type
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Trash2 className="mx-auto mb-2" size={24} />
                  <span className="text-sm font-medium">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="input-field"
              placeholder="Describe the waste you found (e.g., location details, quantity, condition)..."
              required
            />
          </div>

          {/* Location */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
            
            {formData.location.address ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="text-green-600 mr-2" size={20} />
                  <span className="text-green-800 font-medium">Location detected</span>
                </div>
                <p className="text-green-700 mt-1">{formData.location.address}</p>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800">No location detected</p>
              </div>
            )}
            
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <Loader className="mr-2 animate-spin" size={16} />
              ) : (
                <MapPin className="mr-2" size={16} />
              )}
              {loading ? 'Detecting...' : 'Use Current Location'}
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !image || !formData.wasteType || !formData.description.trim()}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <Loader className="mr-2 animate-spin" size={20} />
              ) : (
                <Upload className="mr-2" size={20} />
              )}
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportWaste;
