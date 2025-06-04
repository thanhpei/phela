import React, { useState, useEffect } from 'react';
import Header from '~/components/admin/Header';
import api from '~/config/axios';
import { FaSearch, FaFilter, FaFileDownload, FaEnvelope, FaPhone, FaEye } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

interface Candidate {
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  applicationDate: string;
  status: string;
  jobPosting: {
    jobPostingId: string;
    title: string;
  };
}

const Candidate = () => {
  const { jobPostingId } = useParams();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [jobTitle, setJobTitle] = useState('Tất cả ứng viên');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jobPostingId) {
          const jobResponse = await api.get(`/api/job-postings/${jobPostingId}`);
          setJobTitle(`Ứng viên cho: ${jobResponse.data.title}`);
          
          const candidatesResponse = await api.get(`/api/job-postings/${jobPostingId}/applications`);
          setCandidates(candidatesResponse.data);
        } else {
          const response = await api.get('/api/applications');
          setCandidates(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [jobPostingId]);

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Chờ xử lý</span>;
      case 'REVIEWED':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Đã xem</span>;
      case 'ACCEPTED':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Đã chấp nhận</span>;
      case 'REJECTED':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Đã từ chối</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      await api.patch(`/api/job-postings/${jobPostingId || 'all'}/applications/${applicationId}/status`, {
        status: newStatus
      });
      setCandidates(candidates.map(candidate => 
        candidate.applicationId === applicationId ? { ...candidate, status: newStatus } : candidate
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Có lỗi khi cập nhật trạng thái ứng viên');
    }
  };

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  if (loading) {
    return (
      <div>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Header />
        </div>
        <div className="pt-16 flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý ứng viên</h1>
            <p className="text-gray-600">{jobTitle}</p>
          </div>
          {jobPostingId && (
            <Link
              to="/admin/candidates"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Xem tất cả ứng viên
            </Link>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <FaFilter className="text-gray-500 mr-2" />
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="reviewed">Đã xem</option>
                <option value="accepted">Đã chấp nhận</option>
                <option value="rejected">Đã từ chối</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên ứng viên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí ứng tuyển</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày ứng tuyển</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CV</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <tr key={candidate.applicationId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{candidate.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaEnvelope className="mr-2" /> {candidate.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaPhone className="mr-2" /> {candidate.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/admin/recruitment/${candidate.jobPosting.jobPostingId}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {candidate.jobPosting.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(candidate.applicationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(candidate.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.cvUrl ? (
                          <a 
                            href={candidate.cvUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <FaFileDownload className="mr-1" /> Tải xuống
                          </a>
                        ) : (
                          <span className="text-gray-400">Không có CV</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          <select
                            value={candidate.status}
                            onChange={(e) => handleStatusChange(candidate.applicationId, e.target.value)}
                            className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="REVIEWED">Đã xem</option>
                            <option value="ACCEPTED">Chấp nhận</option>
                            <option value="REJECTED">Từ chối</option>
                          </select>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => sendEmail(candidate.email)}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 flex items-center"
                            >
                              <FaEnvelope className="mr-1" /> Email
                            </button>
                            <Link
                              to={`/admin/candidates/${candidate.applicationId}`}
                              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 flex items-center"
                            >
                              <FaEye className="mr-1" /> Chi tiết
                            </Link>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy ứng viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidate;