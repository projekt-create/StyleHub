"use client";

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ProductContext } from "@/context/ProductContext";
import ProductService from "@/service/ProductService";

// customParams bo'lsa o'zini oladi, bo'lmasa contextdan oladi
export function useProducts(customParams) {
  const productContext = useContext(ProductContext);

  const params = customParams || productContext?.getQueryParams() || {};

  return useQuery({
    queryKey: ["products", params],
    queryFn: () => ProductService.getAll(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
}
