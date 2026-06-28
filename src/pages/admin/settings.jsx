import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaSave, FaMoneyBillWave, FaBuilding, FaQrcode, FaUpload, FaTrash } from 'react-icons/fa';

const API_URL = 'https://diamond11-backend.onrender.com';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [qrPreview, setQrPreview] = useState('');
  const fileInputRef = useRef(null);
  const [settings, setSettings] = useState({
    upiId: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    minDeposit: '100',
    maxDeposit: '50000',
    minWithdraw: '200',
    maxWithdraw: '10000',
    referralBonus: '10',
    qrCodeImage: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/settings`);
      if (res.data.success) {
        setSettings(prev => ({ ...prev, ...res.data.data }));
        if (res.data.data.qrCodeImage) {
          setQrPreview(res.data.data.qrCodeImage);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  // ✅ QR Code Image Upload Handler
  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB!');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setQrPreview(base64);
      setSettings(prev => ({ ...prev, qrCodeImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // ✅ Remove QR Code
  const removeQr = () => {
    setQrPreview('');
    setSettings(prev => ({ ...prev, qrCodeImage: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ✅ Save All Settings
  const handleSave = async () => {
    setLoading(true);
    try {
      // Save QR Code separately (because it's large)
      if (settings.qrCodeImage) {
        await axios.post(`${API_URL}/settings/upload-qr`, { qrImage: settings.qrCodeImage });
      }

      // Save other settings
      const settingsArray = Object.keys(settings)
        .filter(key => key !== 'qrCodeImage')
        .map(key => ({ key, value: settings[key] }));

      await axios.put(`${API_URL}/settings/bulk`, { settings: settingsArray });
      alert('✅ Settings saved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
        <FaSave /> Payment & Settings
      </h2>

      {/* UPI Settings */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
          <FaMoneyBillWave /> UPI Payment Details
        </h3>
        <p className="text-gray-400 text-sm mb-4">Users will see these details on deposit page.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">UPI ID</label>
            <input type="text" name="upiId" value={settings.upiId} onChange={handleChange} placeholder="example@upi" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account Name</label>
            <input type="text" name="accountName" value={settings.accountName} onChange={handleChange} placeholder="Account holder name" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Account Number</label>
            <input type="text" name="accountNumber" value={settings.accountNumber} onChange={handleChange} placeholder="Account number" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">IFSC Code</label>
            <input type="text" name="ifsc" value={settings.ifsc} onChange={handleChange} placeholder="IFSC code" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bank Name</label>
            <input type="text" name="bankName" value={settings.bankName} onChange={handleChange} placeholder="Bank name" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* ✅ QR Code Upload Section */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
          <FaQrcode /> Payment QR Code
        </h3>
        <p className="text-gray-400 text-sm mb-4">Upload your UPI QR code. Users will see this on deposit page.</p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Upload Area */}
          <div className="flex-1">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleQrUpload}
              className="hidden"
              id="qrUpload"
            />
            <label
              htmlFor="qrUpload"
              className="flex flex-col items-center justify-center w-full h-40 bg-gray-900 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-yellow-400 transition-colors"
            >
              <FaUpload className="text-3xl text-gray-500 mb-2" />
              <p className="text-gray-400 text-sm">Click to upload QR Code</p>
              <p className="text-gray-500 text-xs mt-1">PNG, JPG (Max 5MB)</p>
            </label>

            {qrPreview && (
              <button
                onClick={removeQr}
                className="mt-3 flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
              >
                <FaTrash /> Remove QR Code
              </button>
            )}
          </div>

          {/* Preview */}
          <div className="flex-1">
            {qrPreview ? (
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Preview:</p>
                <img
                  src={qrPreview}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto rounded-xl border-2 border-yellow-400 object-contain bg-white p-2"
                />
                <p className="text-green-400 text-xs mt-2">✅ QR Code Ready</p>
              </div>
            ) : (
              <div className="w-48 h-48 mx-auto rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center">
                <p className="text-gray-500 text-sm text-center">No QR Code<br/>uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Limits Settings */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
          <FaBuilding /> Deposit & Withdraw Limits
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Deposit (₹)</label>
            <input type="number" name="minDeposit" value={settings.minDeposit} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Deposit (₹)</label>
            <input type="number" name="maxDeposit" value={settings.maxDeposit} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Min Withdraw (₹)</label>
            <input type="number" name="minWithdraw" value={settings.minWithdraw} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Max Withdraw (₹)</label>
            <input type="number" name="maxWithdraw" value={settings.maxWithdraw} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Referral Bonus (₹)</label>
            <input type="number" name="referralBonus" value={settings.referralBonus} onChange={handleChange} className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-yellow-400 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 py-3 rounded-xl font-bold text-gray-900 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
      >
        <FaSave /> {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default Settings;