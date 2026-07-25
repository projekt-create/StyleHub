"use client";

import Cookies from "js-cookie";
import { createContext, useCallback, useEffect, useState } from "react";
import AuthService from "@/service/AuthService";

// authentication ma'lumotlarini butun loyiha bo'ylab ulashish uchun context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // login qilgan foydalanuvchi
  const [user, setUser] = useState(null);

  // foydalanuvchi login qilgan yoki qilmaganini saqlaydi
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // loading holati
  const [loading, setLoading] = useState(true);

  // xatolik matni
  const [error, setError] = useState(null);

  // sahifa ochilganda localStorage dan userni tiklaydi
  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {

        // user ma'lumotini state ga yozadi
        setUser(JSON.parse(savedUser));

        // login holatini true qiladi
        setIsAuthenticated(true);

      } catch {

        // json buzilgan bo'lsa localStorage ni tozalaydi
        localStorage.removeItem("user");
      }
    }

    // tekshiruv tugadi
    setLoading(false);

  }, []);

  // login qilish
  const login = useCallback(async (username, password) => {

    setLoading(true);
    setError(null);

    try {

      // login request yuboradi
      const data = await AuthService.login(username, password);

      // backenddan kelgan ma'lumotlarni ajratib oladi
      const {
        accessToken,
        refreshToken,
        user: userData,
      } = data;

      // tokenlarni cookie ga saqlaydi
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);

      // userni localStorage ga saqlaydi
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      // state ni yangilaydi
      setUser(userData);
      setIsAuthenticated(true);

      return data;

    } catch (err) {

      // backenddan kelgan xatolikni oladi
      const message =
        err.response?.data?.message ||
        "Login yoki parol noto'g'ri";

      setError(message);

      throw err;

    } finally {

      setLoading(false);

    }

  }, []);

  // logout qilish
  const logout = useCallback(async () => {

    try {

      // backendga logout request yuboradi
      await AuthService.logout();

    } catch {

      // backend ishlamasa ham local ma'lumotlarni tozalaydi

    } finally {

      // userni state dan o'chiradi
      setUser(null);

      // login holatini false qiladi
      setIsAuthenticated(false);

      // xatolikni tozalaydi
      setError(null);

      // localStorage ni tozalaydi
      localStorage.removeItem("user");

      // cookiedagi tokenlarni o'chiradi
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

    }

  }, []);

  // user ma'lumotlarini yangilash
  const updateUser = useCallback((updatedUser) => {

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

  }, []);

  // xatolikni tozalash
  const clearError = useCallback(() => {

    setError(null);

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}