// src/routes/Store.tsx
import React, { useState, useEffect } from 'react';
import Header from '~/components/admin/Header';
import api from '~/config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hook để tải động react-leaflet và leaflet
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
  const [isEditing, setIsEditing] = useState<boolean>(false); // Thêm state để phân biệt tạo mới hay cập nhật
  const [currentBranchCode, setCurrentBranchCode] = useState<string | null>(null);
  const [newBranch, setNewBranch] = useState({
    branchName: '',
    latitude: 0,
    longitude: 0,
    city: '',
    district: '',
    address: '',
    status: 'SHOW', // Đặt mặc định là SHOW, không cần select
  });
  const [mapPosition, setMapPosition] = useState<[number, number]>([21.0278, 105.8342]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Thêm ô tìm kiếm
  const [error, setError] = useState<string | null>(null);
  const { MapContainer, TileLayer, Marker, useMapEvents, L } = useMapComponents();

  useEffect(() => {
    fetchBranches();
  }, [cityFilter]);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = cityFilter
        ? `/api/admin/branch/by-city?city=${cityFilter}`
        : '/api/admin/branch?page=0&size=10';
      const response = await api.get(url);
      const formattedBranches = Array.isArray(response.data)
      ? response.data.map((branch: any) => ({ ...branch, status: branch.status.toString() }))
      : response.data.content.map((branch: any) => ({ ...branch, status: branch.status.toString() }));
      setBranches(formattedBranches);
    } catch (error: any) {
      console.error('Error fetching branches:', error);
      setError('Không thể tải danh sách cửa hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (branchCode: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/api/admin/branch/${branchCode}/toggle-status`);
      console.log('Toggle status response:', response.data);
      setBranches((prev) =>
        prev.map((branch) =>
          branch.branchCode === branchCode ? { ...branch, status: response.data.status.toString() } : branch
        )
      );
    } catch (error: any) {
      console.error('Error toggling status:', error);
      if (error.response?.status === 404) {
      setError('Không tìm thấy chi nhánh. Vui lòng thử lại.');
    } else if (error.response?.status === 401) {
      setError('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
    } else if (error.response?.status === 403) {
      setError('Bạn không có quyền thay đổi trạng thái chi nhánh.');
    } else {
      setError('Không thể thay đổi trạng thái. Vui lòng thử lại.');
    }
    }
  };

  const handleCreateBranch = async () => {
    setError(null);
    try {

      // Validate dữ liệu trước khi gửi
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
      setBranches(prev => [{
      ...response.data,
      status: response.data.status?.toString() || 'SHOW'
    }, ...prev]);

      setIsModalOpen(false);
      toast.success('Tạo cửa hàng thành công!');
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
    setError(null);
    try {
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
          branch.branchCode === currentBranchCode ? response.data : branch
        )
      );
      setIsModalOpen(false);
      toast.success('Cập nhật cửa hàng thành công!');
      setNewBranch({
        branchName: '',
        latitude: 0,
        longitude: 0,
        city: '',
        district: '',
        address: '',
        status: 'SHOW',
      });
      setCurrentBranchCode(null);
      setIsEditing(false);
      setMapPosition([21.0278, 105.8342]);
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

  // Hàm tìm kiếm vị trí dựa trên OpenStreetMap Nominatim API
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
      return <div className="h-48 w-full bg-gray-200 flex items-center justify-center">Đang tải bản đồ...</div>;
    }

    return (
      <MapContainer
        center={mapPosition}
        zoom={13}
        style={{ height: '200px', width: '100%' }}
        className="border rounded"
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
    <div>
      <ToastContainer />
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Quản lý cửa hàng</h1>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="mb-4">
          <label htmlFor="cityFilter" className="mr-2 font-medium">
            Lọc theo thành phố:
          </label>
          <input
            type="text"
            id="cityFilter"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Nhập tên thành phố..."
            className="border rounded p-2"
          />
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : branches.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2 text-left">Mã cửa hàng</th>
                <th className="border border-gray-200 p-2 text-left">Tên</th>
                <th className="border border-gray-200 p-2 text-left">Địa chỉ</th>
                <th className="border border-gray-200 p-2 text-left">Thành phố</th>
                <th className="border border-gray-200 p-2 text-left">Quận/Huyện</th>
                <th className="border border-gray-200 p-2 text-left">Trạng thái</th>
                <th className="border border-gray-200 p-2 text-left"></th>
                <th className="border border-gray-200 p-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.branchCode} className="hover:bg-gray-50">
                  <td className="border border-gray-200 p-2">{branch.branchCode}</td>
                  <td className="border border-gray-200 p-2">{branch.branchName}</td>
                  <td className="border border-gray-200 p-2">
                    {branch.address}
                  </td>
                  <td className="border border-gray-200 p-2">{branch.city}</td>
                  <td className="border border-gray-200 p-2">{branch.district}</td>
                  <td className="border border-gray-200 p-2">
                    {branch.status === 'SHOW' ? (
                      <span className="text-green-600">Hoạt động</span>
                    ) : (
                      <span className="text-red-600">Ngừng hoạt động</span>
                    )}
                  </td>
                  <td className="border border-gray-200 p-2 space-x-2">
                    <button
                      onClick={() => openEditModal(branch)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Cập nhật
                    </button>
                  </td>
                  <td className='border border-gray-200 p-2 space-x-2'>
                    <button
                      onClick={() => toggleStatus(branch.branchCode)}
                      className={`${branch.status === 'SHOW' ? 'bg-red-500' : 'bg-green-500'
                        } text-white px-3 py-1 rounded hover:${branch.status === 'SHOW' ? 'bg-red-600' : 'bg-green-600'
                        }`}
                    >
                      {branch.status === 'SHOW' ? 'Tắt' : 'Bật'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có cửa hàng nào.</p>
        )}

        <div className="mt-4">
          <button
            onClick={() => {
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
              setIsModalOpen(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Thêm cửa hàng
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Thêm cửa hàng mới</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Tên cửa hàng</label>
                  <input
                    type="text"
                    value={newBranch.branchName}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, branchName: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    placeholder="Nhập tên cửa hàng..."
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Thành phố</label>
                  <input
                    type="text"
                    value={newBranch.city}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, city: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    placeholder="Nhập thành phố..."
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Quận/Huyện</label>
                  <input
                    type="text"
                    value={newBranch.district}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, district: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    placeholder="Nhập quận/huyện..."
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Địa chỉ</label>
                  <input
                    type="text"
                    value={newBranch.address}
                    onChange={(e) =>
                      setNewBranch({ ...newBranch, address: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    placeholder="Nhập địa chỉ..."
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Tìm kiếm vị trí</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      placeholder="Nhập địa chỉ để tìm kiếm..."
                    />
                    <button
                      onClick={searchLocation}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Tìm
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block mb-1 font-medium text-gray-700">Chọn hoặc xác nhận vị trí trên bản đồ</label>
                {renderMap()}
                <p className="mt-2 text-sm text-gray-600">
                  Lat: {mapPosition[0].toFixed(6)}, Long: {mapPosition[1].toFixed(6)}
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateBranch}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;