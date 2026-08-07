'use client';

import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await login(formData.username, formData.password);

      toast.success("Muvaffaqiyatli tizimga kirdingiz!");
      router.replace("/dashboard");
    } catch (error) {
      const rawMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Tizimga kirishda xatolik yuz berdi. Username va parolni tekshiring.";

      const formattedMsg = Array.isArray(rawMsg)
        ? rawMsg.join(", ")
        : typeof rawMsg === 'object'
        ? JSON.stringify(rawMsg)
        : rawMsg;

      setErrorMessage(formattedMsg);
      toast.error(formattedMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-light)]">

        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[var(--text)] mb-2">
            Kirish
          </h2>

          <p className="text-sm text-[var(--text-muted)]">
            Kirish uchun
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Foydalanuvchi nomi
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--icon)]">
                  <FaUser />
                </div>

                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Foydalanuvchi nomingiz"
                  className="block w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--icon)]">
                  <FaLock />
                </div>

                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text)] placeholder:text-[var(--placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)] transition-colors"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--icon-secondary)] hover:text-[var(--primary)] transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)] border border-[var(--border)] rounded cursor-pointer"
              />

              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-[var(--text-secondary)] cursor-pointer"
              >
                Eslab qol
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-[var(--primary-hover)] hover:text-[var(--primary)] transition-colors"
              >
                Parolni unutdingizmi?
              </a>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 rounded-xl bg-[var(--primary-hover)] hover:bg-[var(--primary-dark)] text-[var(--white)] text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-[var(--white)] border-t-transparent rounded-full animate-spin" />
            ) : (
              'Kirish'
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;