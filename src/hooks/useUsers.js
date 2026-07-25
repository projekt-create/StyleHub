"use client";

import { useQuery } from "@tanstack/react-query";
import UserService from "@/service/UserService";

// barcha userlarni oladi
export function useUsers(params = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => UserService.getAll(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}
