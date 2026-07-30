"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductService from "@/service/ProductService";
import SaidBar from "@/components/saiidbar/SaidBar";
import ProductForm from "@/components/products/ProductForm";

export default function EditProductPage() {
  const { slug } = useParams();
  const query = useQuery({
    queryKey: ["product-edit", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const numeric = !Number.isNaN(Number(slug));
      return numeric ? ProductService.getById(slug) : ProductService.getBySlug(slug);
    },
  });
  const product = query.data?.data || query.data;

  return <><SaidBar />{query.isLoading ? <main className="ml-[68px] grid min-h-screen place-items-center bg-[var(--bg)] text-sm text-[var(--text-muted)]">Mahsulot yuklanmoqda...</main> : query.isError ? <main className="ml-[68px] grid min-h-screen place-items-center bg-[var(--bg)] text-sm text-red-500">Mahsulotni yuklab bo‘lmadi.</main> : <ProductForm product={product} editId={product?.id} />}</>;
}
