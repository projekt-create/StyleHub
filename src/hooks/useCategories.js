"use client";

import { useQuery } from "@tanstack/react-query";
import CategoryService from "@/service/CategoryService";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryService.getAll(),
    staleTime: 1000 * 60 * 10, // 10 min — categories rarely change
  });
}

export function useCategoryNames() {
  return useQuery({
    queryKey: ["categories", "names"],
    queryFn: () => CategoryService.getNames(),
    staleTime: 1000 * 60 * 10,
  });
}
