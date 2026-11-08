'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import LoadingModal from '@/components/LoadingModal';
import CustomModal from '@/components/CustomModal';
import { API_URL } from '@/lib/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: Enter Email, 3: Reset Password
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [showPassword, setShowPassword] = useState(false);

  // Custom Pop-up Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');

  const showModal = (msg, type = 'success') => {
    setModalMessage(msg);
    setModalType(type);
    setModalOpen(true);
  };

  // Timer States
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();

  // Timer countdown logic for Step 3
  useEffect(() => {
    let interval = null;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Standard Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingMessage('Logging into your account...');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      localStorage.setItem('user', JSON.stringify({
        role: res.data.user.role, // 'admin' හෝ 'user'
        email: res.data.user.email
      }));
      showModal('Login Successful! Redirecting to dashboard...', 'success');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      showModal(err.response?.data?.message || 'Invalid email or password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Request Forgot Password OTP
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setLoadingMessage('Sending OTP code to your email...');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email: forgotEmail });
      showModal(res.data.message || 'OTP sent successfully!', 'success');
      setStep(3);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      showModal(err.response?.data?.message || 'No registered user found with this email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoadingMessage('Resending OTP code...');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email: forgotEmail });
      showModal('A new OTP code has been sent to your email!', 'success');
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      showModal(err.response?.data?.message || 'Failed to resend OTP code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 3. Reset Password with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showModal('Passwords do not match! Please check and try again.', 'error');
      return;
    }

    setLoadingMessage('Resetting your password...');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: forgotEmail,
        otp,
        newPassword,
      });

      showModal(res.data.message || 'Password reset successful! Please login.', 'success');

      setTimeout(() => {
        setStep(1);
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
          {step === 1 && 'Welcome Back'}
          {step === 2 && 'Forgot Password'}
          {step === 3 && 'Reset Password'}
        </h2>

        {/* STEP 1: LOGIN FORM */}
        {step === 1 && (
          <form onSubmit={handleLogin} className="flex flex-col gap-6" autoComplete="off">
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
                  autoComplete="off"
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
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 p-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-base shadow-lg active:scale-[0.99]"
            >
              Login
            </button>
          </form>
        )}

        {/* STEP 2: FORGOT PASSWORD - ENTER EMAIL */}
        {step === 2 && (
          <form onSubmit={handleForgotRequest} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Enter your registered email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                required
              />
            </div>
            <button
              type="submit"
              className="p-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-base shadow-lg active:scale-[0.99]"
            >
              Send OTP Code
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-center text-gray-500 hover:text-gray-700 font-medium"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* STEP 3: RESET PASSWORD, OTP & RESEND TIMER */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-center text-gray-700">Enter OTP Code</label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl text-center tracking-widest text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />

              {/* Resend OTP Section */}
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-xs text-gray-500">
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code?"}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className={`text-xs font-semibold ${canResend ? 'text-blue-600 hover:underline cursor-pointer' : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Resend OTP
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-base"
                required
              />
            </div>

            <button
              type="submit"
              className="p-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition text-base shadow-lg active:scale-[0.99]"
            >
              Reset Password
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-sm text-center text-gray-500 hover:text-gray-700 font-medium"
            >
              Change Email
            </button>
          </form>
        )}

      </div>

      {/* Loading Modal Overlay */}
      <LoadingModal isOpen={loading} message={loadingMessage} />

      {/* Custom Alert Pop-up Modal */}
      <CustomModal
        isOpen={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}