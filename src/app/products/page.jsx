"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiOutlineArrowsUpDown, HiOutlineFunnel, HiOutlineMagnifyingGlass,
  HiOutlinePlus, HiOutlineShoppingBag, HiOutlineStar,
} from "react-icons/hi2";
import SaidBar from "@/components/saiidbar/SaidBar";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

const PAGE_SIZE = 12;
const inputClass = "rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]";

const price = (value) => new Intl.NumberFormat("uz-UZ", {
  style: "currency", currency: "USD", maximumFractionDigits: 2,
}).format(Number(value) || 0);

function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.slug || product.id}`} className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] transition duration-200 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-xl">
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[var(--bg-hover)]">
        {product.image ? <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <HiOutlineShoppingBag className="text-5xl text-[var(--icon-secondary)]" />}
        {product.stock <= 0 && <span className="absolute right-3 top-3 rounded-lg bg-red-500/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Tugagan</span>}
      </div>
      <div className="p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">{product.category?.name || "Kategoriyasiz"}</p>
        <h2 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[var(--text)] transition group-hover:text-[var(--primary)]">{product.title}</h2>
        <div className="mt-4 flex items-center justify-between gap-2">
          <strong className="text-base text-[var(--text)]">{price(product.price)}</strong>
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]"><HiOutlineStar className="text-amber-500" /> {product.rating ?? "—"}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[var(--border-light)] pt-3 text-[11px] text-[var(--text-muted)]">
          <span>Omborda: <b className="text-[var(--text)]">{product.stock ?? 0} dona</b></span>
          <span className="font-bold text-[var(--primary)]">Batafsil →</span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("createdAt-DESC");
  const [sortBy, order] = sort.split("-");
  const { data: categoryData } = useCategories();
  const categories = Array.isArray(categoryData) ? categoryData : categoryData?.items || [];
  const { data, isLoading, isError, error } = useProducts({ page, limit: PAGE_SIZE, search: search || undefined, categoryId: categoryId || undefined, sortBy, order });
  const items = Array.isArray(data?.items) ? data.items : [];
  const meta = data?.meta || {};
  const totalPages = Math.max(Number(meta.totalPages) || 1, 1);
  const resetPage = (setter) => (event) => { setter(event.target.value); setPage(1); };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SaidBar />
      <main className="ml-[68px] min-h-screen p-4 sm:p-8">
        <header className="mx-auto mb-7 flex max-w-[1440px] flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">StyleHub boshqaruvi</p><h1 className="text-3xl font-extrabold tracking-tight text-[var(--text)]">Mahsulotlar katalogi</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Mahsulotlarni qidiring, saralang va boshqaring.</p></div>
          <Link href="/products/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)]"><HiOutlinePlus className="text-lg" /> Yangi mahsulot</Link>
        </header>

        <section className="mx-auto mb-6 flex max-w-[1440px] flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm lg:flex-row">
          <label className="relative flex-1"><HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--icon-secondary)]" /><input value={search} onChange={resetPage(setSearch)} placeholder="Mahsulot nomini qidiring..." className={`${inputClass} w-full pl-10`} /></label>
          <label className="flex items-center gap-2"><HiOutlineFunnel className="text-[var(--text-muted)]" /><select value={categoryId} onChange={resetPage(setCategoryId)} className={inputClass}><option value="">Barcha kategoriyalar</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label className="flex items-center gap-2"><HiOutlineArrowsUpDown className="text-[var(--text-muted)]" /><select value={sort} onChange={resetPage(setSort)} className={inputClass}><option value="createdAt-DESC">Eng yangilar</option><option value="price-ASC">Arzonidan boshlab</option><option value="price-DESC">Qimmatidan boshlab</option><option value="rating-DESC">Reyting bo‘yicha</option></select></label>
        </section>

        <section className="mx-auto max-w-[1440px] rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-6">
          {isLoading && <p className="py-16 text-center text-sm text-[var(--text-muted)]">Mahsulotlar yuklanmoqda...</p>}
          {isError && <p className="py-16 text-center text-sm text-red-500">{error?.response?.data?.message || "Mahsulotlarni yuklashda xatolik yuz berdi."}</p>}
          {!isLoading && !isError && !items.length && <p className="py-16 text-center text-sm text-[var(--text-muted)]">Mos mahsulotlar topilmadi.</p>}
          {!isLoading && !isError && items.length > 0 && <>
            <div className="mb-5 flex items-center justify-between"><p className="text-sm text-[var(--text-muted)]">Jami <b className="text-[var(--text)]">{meta.total ?? items.length}</b> ta mahsulot</p><span className="text-xs text-[var(--text-muted)]">{page} / {totalPages}-sahifa</span></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4"><span className="text-xs text-[var(--text-muted)]">{page} / {totalPages}</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className={`${inputClass} px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40`}>Oldingi</button><button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className={`${inputClass} px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40`}>Keyingi</button></div></div>
          </>}
        </section>
      </main>
    </div>
  );
}
