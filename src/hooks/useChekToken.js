"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import AuthService from "@/service/AuthService";
import { useAuth } from "./useAuth";

// sahifa ochilganda tokenni tekshirish uchun hook
export function useCheckToken() {

  // auth context dan kerakli metodlar olinadi
  const {
    updateUser,
    logout,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {

    // tokenni tekshirish funksiyasi
    const checkToken = async () => {

      // cookie ichidan access token olinadi
      const accessToken = Cookies.get("accessToken");

      // token bo'lmasa tekshiruv to'xtatiladi
      if (!accessToken) return;

      try {

        // login qilgan foydalanuvchi ma'lumotlari olinadi
        const user = await AuthService.getMe();

        // user ma'lumotlari context ga yoziladi
        updateUser(user);

      } catch {

        // agar access token yaroqsiz bo'lsa
        // Api.js dagi interceptor avtomatik refresh qiladi
        // refresh ham ishlamasa logout qilinadi
        logout();

      }
    };

    // faqat login qilingan bo'lsa token tekshiriladi
    if (isAuthenticated) {
      checkToken();
    }

  }, [
    isAuthenticated,
    updateUser,
    logout,
  ]);
}