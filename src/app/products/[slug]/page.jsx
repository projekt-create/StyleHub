"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ProductService from "@/service/ProductService";
import SaidBar from "@/components/saiidbar/SaidBar";
import {
  HiOutlineArchiveBox, HiOutlineArrowLeft, HiOutlineCheckCircle,
  HiOutlineExclamationCircle, HiOutlineShoppingBag,
  HiOutlineStar, HiOutlineTag, HiOutlineTrash,
} from "react-icons/hi2";

const price = (value) => new Intl.NumberFormat("uz-UZ", {
  style: "currency", currency: "USD", maximumFractionDigits: 2,
}).format(Number(value) || 0);

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const numericId = slug && !Number.isNaN(Number(slug));
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product-detail", slug],
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      try {
        return numericId ? await ProductService.getById(slug) : await ProductService.getBySlug(slug);
      } catch (err) {
        if (err?.response?.status === 404 && !numericId) return ProductService.getById(slug);
        throw err;
      }
    },
  });
  const product = data?.data || data;
  const stock = Number(product?.stock) || 0;

  const removeProduct = async () => {
    if (!confirm("Haqiqatan ham ushbu mahsulotni o‘chirmoqchimisiz?")) return;
    await ProductService.remove(product.id);
    router.push("/products");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SaidBar />
      <main className="ml-[68px] min-h-screen p-4 sm:p-8">
        <div className="mx-auto max-w-[1200px]">
          <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"><HiOutlineArrowLeft /> Mahsulotlar ro‘yxatiga qaytish</Link>

          {isLoading && <div className="grid min-h-96 place-items-center text-sm text-[var(--text-muted)]">Mahsulot ma’lumotlari yuklanmoqda...</div>}
          {isError && <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] px-5 py-16 text-center"><HiOutlineExclamationCircle className="mx-auto mb-3 text-5xl text-red-500" /><h1 className="mb-2 text-xl font-bold">Mahsulot topilmadi</h1><p className="mx-auto mb-6 max-w-md text-sm text-[var(--text-muted)]">{error?.response?.data?.message || "Qidirilgan mahsulot mavjud emas yoki o‘chirilgan bo‘lishi mumkin."}</p><Link href="/products" className="inline-flex rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white">Mahsulotlarga qaytish</Link></div>}

          {!isLoading && !isError && product && <>
            <section className="grid gap-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(280px,440px)_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--bg-hover)]">
                {product.image ? <img src={product.image} alt={product.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><HiOutlineShoppingBag className="text-7xl text-[var(--icon-secondary)]" /></div>}
                {stock <= 0 && <span className="absolute right-4 top-4 rounded-lg bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Tugagan</span>}
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1 rounded-lg bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--primary)]"><HiOutlineTag /> {product.category?.name || "Kategoriyasiz"}</span><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${product.isActive === false ? "bg-gray-500/15 text-gray-400" : "bg-emerald-500/15 text-emerald-500"}`}>{product.isActive === false ? "Nofaol" : <><HiOutlineCheckCircle /> Faol</>}</span></div>
                  <h1 className="mb-3 text-2xl font-extrabold leading-tight sm:text-3xl">{product.title}</h1>
                  <div className="mb-6 flex items-center gap-3 text-xs text-[var(--text-muted)]"><span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-sm font-semibold text-amber-500"><HiOutlineStar className="fill-amber-500" /> {product.rating ?? "—"}</span><span>ID: <code className="rounded bg-[var(--bg-hover)] px-2 py-1 text-[var(--text)]">{product.id}</code></span></div>
                  <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-hover)] p-4"><div><span className="block text-xs text-[var(--text-muted)]">Narxi</span><strong className="mt-1 block text-2xl font-black">{price(product.price)}</strong></div><div><span className="block text-xs text-[var(--text-muted)]">Ombordagi qoldiq</span><strong className={`mt-1 flex items-center gap-1.5 text-base ${stock > 0 ? "text-emerald-500" : "text-red-500"}`}><HiOutlineArchiveBox /> {stock} dona</strong></div></div>
                  <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Mahsulot tavsifi</h2><p className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 text-sm leading-relaxed text-[var(--text-muted)]">{product.description || "Ushbu mahsulot uchun qo‘shimcha tavsif mavjud emas."}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--border-light)] pt-4"><Link href={`/products/${product.slug || product.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]">Tahrirlash</Link><button type="button" onClick={removeProduct} className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/20"><HiOutlineTrash /> O‘chirish</button></div>
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-6"><h2 className="mb-4 text-lg font-bold">Mahsulot ma’lumotlari</h2><dl className="grid gap-3 text-sm sm:grid-cols-2">{[["Nomi", product.title], ["Kategoriya", product.category?.name || "Kiritilmagan"], ["Slug", product.slug || product.id], ["Yaratilgan sana", product.createdAt ? new Date(product.createdAt).toLocaleDateString("uz-UZ") : "—"]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 rounded-xl bg-[var(--bg-hover)] p-3"><dt className="text-[var(--text-muted)]">{label}</dt><dd className="max-w-[65%] truncate text-right font-semibold text-[var(--text)]">{value}</dd></div>)}</dl></section>
          </>}
        </div>
      </main>
    </div>
  );
}
