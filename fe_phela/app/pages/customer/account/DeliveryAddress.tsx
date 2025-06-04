import React, { useState, useEffect } from 'react';
import HeadOrder from '~/components/customer/HeadOrder';
import '~/assets/css/DeliveryAddress.css'; // Assuming you have some styles for this component
import api from '~/config/axios';
import { useAuth } from '~/AuthContext';
import { FaMapMarkerAlt, FaEdit, FaTrash, FaStar, FaRegStar, FaSearchLocation } from 'react-icons/fa';

interface Address {
  addressId: string;
  city: string;
  district: string;
  ward: string;
  recipientName: string;
  phone: string;
  detailedAddress: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

const DeliveryAddress = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({
    city: '',
    district: '',
    ward: '',
    recipientName: '',
    phone: '',
    detailedAddress: '',
    latitude: 0,
    longitude: 0,
    isDefault: false
  });
  const [mapUrl, setMapUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && user.type === 'customer') {
      fetchAddresses();
    }
  }, [user]);

  useEffect(() => {
    if (showForm && currentAddress.detailedAddress) {
      updateMapUrl();
    }
  }, [showForm, currentAddress.detailedAddress, currentAddress.latitude, currentAddress.longitude]);

  const fetchAddresses = async () => {
    if (!user || user.type !== 'customer') return;
    try {
      const response = await api.get(`/api/address/customer/${user.customerId}`);
      setAddresses(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Không thể tải danh sách địa chỉ. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const updateMapUrl = () => {
    const lat = currentAddress.latitude || 10.762622;
    const lng = currentAddress.longitude || 106.660172;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;
    setMapUrl(url);
  };

  const handleSearchLocation = async () => {
    if (!searchQuery) return;

    try {
      // Sử dụng Nominatim API để tìm kiếm địa chỉ
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        setCurrentAddress(prev => ({
          ...prev,
          latitude: parseFloat(firstResult.lat),
          longitude: parseFloat(firstResult.lon),
          detailedAddress: firstResult.display_name
        }));
      } else {
        alert('Không tìm thấy địa chỉ. Vui lòng thử lại với từ khóa khác.');
      }
    } catch (err) {
      console.error('Error searching location:', err);
      alert('Có lỗi khi tìm kiếm địa chỉ. Vui lòng thử lại.');
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.type !== 'customer') return;

    try {
      if (editMode && currentAddress.addressId) {
        await api.put(`/api/address/${currentAddress.addressId}`, currentAddress);
      } else {
        await api.post(`/api/address/customer/${user.customerId}`, currentAddress);
      }

      fetchAddresses();
      resetForm();
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Có lỗi khi lưu địa chỉ. Vui lòng thử lại.');
    }
  };

  const handleEdit = (address: Address) => {
    setCurrentAddress(address);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        await api.delete(`/api/address/${addressId}`);
        fetchAddresses();
      } catch (err) {
        console.error('Error deleting address:', err);
        alert('Có lỗi khi xóa địa chỉ. Vui lòng thử lại.');
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user || user.type !== 'customer') return;
    try {
      await api.patch(`/api/address/customer/${user.customerId}/default/${addressId}`);
      fetchAddresses();
    } catch (err) {
      console.error('Error setting default address:', err);
      alert('Có lỗi khi đặt địa chỉ mặc định. Vui lòng thử lại.');
    }
  };

  const resetForm = () => {
    setCurrentAddress({
      city: '',
      district: '',
      ward: '',
      recipientName: '',
      phone: '',
      detailedAddress: '',
      isDefault: false
    });
    setEditMode(false);
    setShowForm(false);
  };



  if (loading) return <div className="text-center py-8">Đang tải địa chỉ...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <HeadOrder />
      </div>
      <div className="container mx-auto mt-16 p-4 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Địa chỉ giao hàng</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            + Thêm địa chỉ mới
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Họ và tên người nhận</label>
                  <input
                    type="text"
                    name="recipientName"
                    value={currentAddress.recipientName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={currentAddress.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
                  <input
                    type="text"
                    name="city"
                    value={currentAddress.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
                  <input
                    type="text"
                    name="district"
                    value={currentAddress.district}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                  <input
                    type="text"
                    name="ward"
                    value={currentAddress.ward}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Tìm kiếm địa chỉ</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nhập địa chỉ để tìm kiếm"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={handleSearchLocation}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                      <FaSearchLocation /> Tìm
                    </button>
                  </div>


                  <label className="block text-sm font-medium mb-1">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    name="detailedAddress"
                    value={currentAddress.detailedAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mb-2"
                    required
                  />

                  {currentAddress.detailedAddress && (
                    <>
                      <div className="mb-2">
                        <iframe
                          src={mapUrl}
                          width="100%"
                          height="300"
                          style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                          loading="lazy"
                          title="Bản đồ địa chỉ"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Tọa độ:
                          <span className="font-mono ml-2">
                            {currentAddress.latitude?.toFixed(6)}, {currentAddress.longitude?.toFixed(6)}
                          </span>
                        </p>
                        <p className="mt-1">Kéo marker trên bản đồ để điều chỉnh vị trí chính xác</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={currentAddress.isDefault || false}
                    onChange={(e) => setCurrentAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  {editMode ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">Bạn chưa có địa chỉ nào</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.addressId}
                className={`bg-white p-4 rounded-lg shadow ${address.isDefault ? 'border-2 border-primary' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-primary mt-1 mr-2" />
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold">{address.recipientName}</h3>
                        {address.isDefault && (
                          <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{address.phone}</p>
                      <p className="text-gray-800">
                        {address.detailedAddress}, {address.ward}, {address.district}, {address.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(address.addressId)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.addressId)}
                        className="text-yellow-500 hover:text-yellow-700 p-1"
                        title="Đặt làm mặc định"
                      >
                        <FaRegStar />
                      </button>
                    )}
                    {address.isDefault && (
                      <button
                        className="text-yellow-500 p-1"
                        title="Địa chỉ mặc định"
                        disabled
                      >
                        <FaStar />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;