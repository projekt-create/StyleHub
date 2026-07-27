"use client";

import { createContext, useCallback, useState } from "react";

// ui holatlarini boshqarish uchun context yaratiladi
export const UIContext = createContext(null);

export function UIProvider({ children }) {
  // sidebar ochiq yoki yopiq holati saqlanadi
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // modal ochiq yoki yopiq holati saqlanadi
  const [modalOpen, setModalOpen] = useState(false);
  // modal ichiga yuboriladigan ma'lumot saqlanadi
  const [modalData, setModalData] = useState(null);
  // theme qanaqa bo'lishi
  const [theme, setTheme] = useState("dark");

  // sidebar holati almashtiriladi
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // modal ochiladi
  const openModal = useCallback((data = null) => {
    // modalga yuborilgan ma'lumot saqlanadi
    setModalData(data);
    // modal ochiladi
    setModalOpen(true);
  }, []);

  // modal yopiladi
  const closeModal = useCallback(() => {
    // modal yopiladi
    setModalOpen(false);
    // modal ma'lumotlari tozalanadi
    setModalData(null);
  }, []);

  // theme o'zgartirish
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        theme,
        toggleTheme,
        modalOpen,
        modalData,
        openModal,
        closeModal,
      }}
    >
      <div className="app-theme" data-theme={theme}>
        {children}
      </div>
    </UIContext.Provider>
  );
}
