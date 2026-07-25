"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserService from "@/service/UserService";

// user ma'lumotlarini oladi
export function useUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => UserService.getMe(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

// user ma'lumotlarini yangilaydi
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => UserService.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
}

// user parolini o'zgartiradi
export function useChangePassword() {
  return useMutation({
    mutationFn: (data) => UserService.changePassword(data),
  });
}
