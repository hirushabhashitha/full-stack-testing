'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/LoadingModal';
import CustomModal from '@/components/CustomModal';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Custom Alert Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const showModal = (msg, type = 'success') => {
    setModalMessage(msg);
    setModalType(type);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Submit Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoadingMessage('Creating your account & sending OTP...');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setStep(2);
      showModal(res.data.message || 'OTP code sent to your email!', 'success');
    } catch (err) {
      showModal(err.response?.data?.message || 'Error occurred during registration.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoadingMessage('Verifying OTP code...');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-register-otp', {
        email: formData.email,
        otp,
      });
      
      showModal(res.data.message || 'Email verified successfully!', 'success');

      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (err) {
      showModal(err.response?.data?.message || 'Invalid or expired OTP code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="p-10 sm:p-12 bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
          {step === 1 ? 'Create Account' : 'Verify Email'}
        </h2>

        {step === 1 ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Username</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="w-full p-4 pl-12 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.962 8.962 0 012.122-.383c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-4.692-4.692a3 3 0 00-4.243-4.243M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 p-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-base shadow-lg active:scale-[0.99]"
            >
              Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-center text-gray-700">Enter OTP Code</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-4 pl-12 border border-gray-300 rounded-xl text-center tracking-widest text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 p-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition text-base shadow-lg active:scale-[0.99]"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>

      {/* Loading Modal Overlay */}
      <LoadingModal isOpen={loading} message={loadingMessage} />

      {/* Custom Popup Modal */}
      <CustomModal
        isOpen={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}