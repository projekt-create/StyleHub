"use client";

import { createContext, useCallback, useState } from "react";

// mahsulotlar bilan ishlash uchun context yaratiladi
export const ProductContext = createContext(null);

// filterlarning boshlang'ich qiymatlari
const defaultFilters = {
  page: 1,
  limit: 12,
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "createdAt",
  order: "DESC",
};

export function ProductProvider({ children }) {

  // barcha filterlar shu state da saqlanadi
  const [filters, setFilters] = useState(defaultFilters);

  // bitta filter qiymati yangilanadi
  const setFilter = useCallback((key, value) => {

    setFilters((prev) => ({
      ...prev,

      // tanlangan filter yangilanadi
      [key]: value,

      // page dan boshqa filter o'zgarsa page 1 ga qaytariladi
      ...(key !== "page" ? { page: 1 } : {}),
    }));

  }, []);

  // bir nechta filter bir vaqtda yangilanadi
  const setMultipleFilters = useCallback((newFilters) => {

    setFilters((prev) => ({
      ...prev,

      // yangi filterlar qo'shiladi
      ...newFilters,

      // page yuborilmasa avtomatik 1 beriladi
      page: newFilters.page || 1,
    }));

  }, []);

  // barcha filterlar boshlang'ich holatga qaytariladi
  const resetFilters = useCallback(() => {

    setFilters(defaultFilters);

  }, []);

  // bo'sh qiymatlar olib tashlanib query params tayyorlanadi
  const getQueryParams = useCallback(() => {

    const params = {};

    Object.entries(filters).forEach(([key, value]) => {

      // faqat qiymati mavjud filterlar params ga qo'shiladi
      if (
        value !== "" &&
        value !== null &&
        value !== undefined
      ) {
        params[key] = value;
      }

    });

    return params;

  }, [filters]);

  return (
    <ProductContext.Provider
      value={{
        filters,
        setFilter,
        setMultipleFilters,
        resetFilters,
        getQueryParams,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}