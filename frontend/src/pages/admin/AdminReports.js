import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter,
  Search,
  Eye,
  MapPin,
  Calendar,
  User
} from 'lucide-react';

const AdminReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports');
      let filteredReports = response.data.reports;

      if (filter !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === filter);
      }

      setReports(filteredReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReport = async (reportId, status) => {
    try {
      await axios.put(`/api/admin/reports/${reportId}/verify`, { status });
      toast.success(`Report ${status} successfully`);
      fetchReports();
      setShowModal(false);
    } catch (error) {
      console.error('Error verifying report:', error);
      toast.error(`Failed to ${status} report`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWasteTypeColor = (type) => {
    const colors = {
      plastic: 'bg-blue-100 text-blue-800',
      paper: 'bg-green-100 text-green-800',
      glass: 'bg-purple-100 text-purple-800',
      metal: 'bg-gray-100 text-gray-800',
      organic: 'bg-yellow-100 text-yellow-800',
      electronic: 'bg-red-100 text-red-800',
      hazardous: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const filteredReports = reports.filter(report =>
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.wasteType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Management</h1>
          <p className="text-gray-600">
            Review and verify waste reports submitted by users.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {report.imageUrl && (
                          <img
                            src={report.imageUrl}
                            alt="Report"
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {report.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.location?.address || 'Location not specified'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWasteTypeColor(report.wasteType)}`}>
                        {report.wasteType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Eye size={16} />
                      </button>
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerifyReport(report._id, 'approved')}
                            className="text-green-600 hover:text-green-900 mr-2"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleVerifyReport(report._id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No reports found</p>
                <p className="text-sm text-gray-500 mt-2">
                  {searchTerm ? 'Try adjusting your search terms' : 'No reports match the current filter'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Report Detail Modal */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Report Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Image */}
                  {selectedReport.imageUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Photo</h3>
                      <img
                        src={selectedReport.imageUrl}
                        alt="Report"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-900">{selectedReport.description}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Waste Type</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWasteTypeColor(selectedReport.wasteType)}`}>
                        {selectedReport.wasteType}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  {selectedReport.location && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                      <div className="flex items-center text-gray-900">
                        <MapPin size={16} className="mr-2" />
                        {selectedReport.location.address || `${selectedReport.location.lat}, ${selectedReport.location.lng}`}
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Submitted</h3>
                    <div className="flex items-center text-gray-900">
                      <Calendar size={16} className="mr-2" />
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Submitted By</h3>
                    <div className="flex items-center text-gray-900">
                      <User size={16} className="mr-2" />
                      User ID: {selectedReport.userId}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {selectedReport.status === 'pending' && (
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleVerifyReport(selectedReport._id, 'rejected')}
                      className="btn-secondary flex items-center"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerifyReport(selectedReport._id, 'approved')}
                      className="btn-primary flex items-center"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
