"use client";

import { useQuery } from "@tanstack/react-query";
import ProductService from "@/service/ProductService";

// product id bo'yicha ma'lumotlarni oladi
export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => ProductService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// product slug bo'yicha ma'lumotlarni oladi
export function useProductBySlug(slug) {
  return useQuery({
    queryKey: ["product", "slug", slug],
    queryFn: () => ProductService.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}
