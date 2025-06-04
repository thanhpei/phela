import React, { useState, useEffect } from 'react';
import Header from '~/components/admin/Header';
import api from '~/config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiMapPin, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import "~/assets/css/DeliveryAddress.css"

const useMapComponents = () => {
  const [mapComponents, setMapComponents] = useState<{
    MapContainer?: any;
    TileLayer?: any;
    Marker?: any;
    useMapEvents?: any;
    L?: any;
  }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import('react-leaflet'),
        import('leaflet'),
        import('leaflet/dist/leaflet.css'),
      ]).then(([{ MapContainer, TileLayer, Marker, useMapEvents }, L]) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });

        setMapComponents({
          MapContainer,
          TileLayer,
          Marker,
          useMapEvents,
          L,
        });
      });
    }
  }, []);

  return mapComponents;
};

interface Branch {
  branchCode: string;
  branchName: string;
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  address: string;
  status: string;
}

const Store = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [cityFilter, setCityFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentBranchCode, setCurrentBranchCode] = useState<string | null>(null);
  const [newBranch, setNewBranch] = useState({
    branchName: '',
    latitude: 0,
    longitude: 0,
    city: '',
    district: '',
    address: '',
    status: 'SHOW',
  });
  const [mapPosition, setMapPosition] = useState<[number, number]>([21.0278, 105.8342]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { MapContainer, TileLayer, Marker, useMapEvents, L } = useMapComponents();

  useEffect(() => {
    fetchBranches();
  }, [cityFilter]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const url = cityFilter
        ? `/api/branch/by-city?city=${cityFilter}`
        : '/api/branch';
      const response = await api.get(url);
      const formattedBranches = Array.isArray(response.data)
        ? response.data.map((branch: any) => ({ ...branch, status: branch.status.toString() }))
        : response.data.content.map((branch: any) => ({ ...branch, status: branch.status.toString() }));
      setBranches(formattedBranches);
    } catch (error: any) {
      console.error('Error fetching branches:', error);
      toast.error('Không thể tải danh sách cửa hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (branchCode: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái cửa hàng?')) return;
    setLoading(true);
    try {
      const response = await api.patch(`/api/admin/branch/${branchCode}/toggle-status`);
      
      setBranches((prev) =>
        prev.map((branch) =>
          branch.branchCode === branchCode ? {
            ...branch,
            status: response.data.status === 'SHOW' ? 'SHOW' : 'HIDE'
          } : branch
        )
      );
      toast.success('Cập nhật trạng thái thành công!');
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast.error('Không thể thay đổi trạng thái. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async () => {
    try {
      if (!newBranch.branchName || !newBranch.city || !newBranch.district || !newBranch.address) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const payload = {
        branchName: newBranch.branchName,
        latitude: newBranch.latitude,
        longitude: newBranch.longitude,
        city: newBranch.city,
        district: newBranch.district,
        address: newBranch.address,
        status: newBranch.status,
      };
      const response = await api.post('/api/admin/branch/create', payload);
      setBranches((prev) => [
        {
          ...response.data,
          status: response.data.status?.toString() || 'SHOW',
        },
        ...prev,
      ]);

      setIsModalOpen(false);
      toast.success('Tạo cửa hàng thành công!');
      resetForm();
    } catch (error: any) {
      console.error('Error creating branch:', error);
      if (error.response?.status === 409) {
        toast.error('Cửa hàng đã tồn tại. Vui lòng kiểm tra lại.');
      } else {
        toast.error('Không thể tạo cửa hàng. Vui lòng thử lại.');
      }
    }
  };

  const handleUpdateBranch = async () => {
    if (!currentBranchCode) return;
    try {
      if (!newBranch.branchName || !newBranch.city || !newBranch.district || !newBranch.address) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const payload = {
        branchName: newBranch.branchName,
        latitude: newBranch.latitude,
        longitude: newBranch.longitude,
        city: newBranch.city,
        district: newBranch.district,
        address: newBranch.address,
        status: newBranch.status,
      };
      const response = await api.put(`/api/admin/branch/${currentBranchCode}`, payload);
      setBranches((prev) =>
        prev.map((branch) =>
          branch.branchCode === currentBranchCode ? { ...branch, ...response.data } : branch
        )
      );
      setIsModalOpen(false);
      toast.success('Cập nhật cửa hàng thành công!');
      resetForm();
    } catch (error: any) {
      console.error('Error updating branch:', error);
      if (error.response?.status === 409) {
        toast.error('Tên cửa hàng đã tồn tại. Vui lòng chọn tên khác.');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy cửa hàng. Vui lòng thử lại.');
      } else {
        toast.error('Không thể cập nhật cửa hàng. Vui lòng thử lại.');
      }
    }
  };

  const openEditModal = (branch: Branch) => {
    setIsEditing(true);
    setCurrentBranchCode(branch.branchCode);
    setNewBranch({
      branchName: branch.branchName,
      latitude: branch.latitude,
      longitude: branch.longitude,
      city: branch.city,
      district: branch.district,
      address: branch.address,
      status: branch.status,
    });
    setMapPosition([branch.latitude, branch.longitude]);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewBranch({
      branchName: '',
      latitude: 0,
      longitude: 0,
      city: '',
      district: '',
      address: '',
      status: 'SHOW',
    });
    setMapPosition([21.0278, 105.8342]);
    setCurrentBranchCode(null);
    setIsEditing(false);
    setSearchQuery('');
  };

  const searchLocation = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setMapPosition([parseFloat(lat), parseFloat(lon)]);
        setNewBranch((prev) => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        }));
        toast.success('Đã tìm thấy vị trí!');
      } else {
        toast.error('Không tìm thấy vị trí. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast.error('Lỗi khi tìm kiếm vị trí. Vui lòng thử lại!');
    }
  };

  const LocationMarker = () => {
    if (!useMapEvents || !Marker) return null;

    const map = useMapEvents({
      click(e: any) {
        setMapPosition([e.latlng.lat, e.latlng.lng]);
        setNewBranch((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });

    return <Marker position={mapPosition} />;
  };

  const renderMap = () => {
    if (!MapContainer || !TileLayer) {
      return (
        <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-500">Đang tải bản đồ...</div>
        </div>
      );
    }

    return (
      <MapContainer
        center={mapPosition}
        zoom={13}
        style={{ height: '256px', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Header />
      </div>
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý cửa hàng</h1>
            <p className="text-gray-600">Danh sách các cửa hàng trong hệ thống</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="Lọc theo thành phố..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <FiPlus className="mr-2" />
              Thêm cửa hàng
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : branches.length > 0 ? (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã cửa hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên cửa hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành phố</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quận/Huyện</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {branches.map((branch) => (
                    <tr key={branch.branchCode} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.branchCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{branch.branchName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{branch.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.city}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.district}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          branch.status === 'SHOW' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {branch.status === 'SHOW' ? 'Hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(branch)}
                          className="text-primary hover:text-primary-dark p-1"
                          title="Chỉnh sửa"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => toggleStatus(branch.branchCode)}
                          className={`p-1 ${branch.status === 'SHOW' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          title={branch.status === 'SHOW' ? 'Tắt hoạt động' : 'Bật hoạt động'}
                        >
                          {branch.status === 'SHOW' ? <FiToggleLeft size={18} /> : <FiToggleRight size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Không có cửa hàng nào</h3>
            <p className="mt-1 text-gray-500">Bạn chưa có cửa hàng nào trong hệ thống.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Thêm cửa hàng mới
              </button>
            </div>
          </div>
        )}

        {/* Modal Thêm/Cập nhật cửa hàng */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {isEditing ? 'Cập nhật cửa hàng' : 'Thêm cửa hàng mới'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Đóng</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng *</label>
                    <input
                      type="text"
                      value={newBranch.branchName}
                      onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Nhập tên cửa hàng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố *</label>
                    <input
                      type="text"
                      value={newBranch.city}
                      onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Nhập thành phố"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện *</label>
                    <input
                      type="text"
                      value={newBranch.district}
                      onChange={(e) => setNewBranch({ ...newBranch, district: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Nhập quận/huyện"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ *</label>
                    <input
                      type="text"
                      value={newBranch.address}
                      onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Nhập địa chỉ"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm vị trí</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Nhập địa chỉ để tìm kiếm vị trí..."
                      />
                      <button
                        onClick={searchLocation}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        <FiSearch className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chọn vị trí trên bản đồ</label>
                    {renderMap()}
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium">Tọa độ:</span> {mapPosition[0].toFixed(6)}, {mapPosition[1].toFixed(6)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={isEditing ? handleUpdateBranch : handleCreateBranch}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {isEditing ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;