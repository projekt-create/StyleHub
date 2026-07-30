"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlineCheck } from "react-icons/hi2";
import Link from "next/link";
import ProductService from "@/service/ProductService";
import { useCategories } from "@/hooks/useCategories";

const emptyProduct = { title: "", price: "", stock: "", categoryId: "", image: "", rating: "", description: "" };
const input = "w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]";

const productValues = (product) => product ? ({
  title: product.title || "", price: product.price ?? "", stock: product.stock ?? "",
  categoryId: product.category?.id || product.categoryId || "", image: product.image || "",
  rating: product.rating ?? "", description: product.description || "",
}) : emptyProduct;

export default function ProductForm({ product, editId }) {
  const router = useRouter();
  const { data: categoryData } = useCategories();
  const categories = Array.isArray(categoryData) ? categoryData : categoryData?.items || [];
  const [form, setForm] = useState(() => productValues(product));
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setValue = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    const cleanForm = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]));
    const payload = { ...cleanForm, price: Number(cleanForm.price), stock: Number(cleanForm.stock), rating: cleanForm.rating === "" ? undefined : Number(cleanForm.rating) };
    try {
      const result = editId ? await ProductService.update(editId, payload) : await ProductService.create(payload);
      const saved = result?.data || result;
      router.push(saved?.slug ? `/products/${saved.slug}` : saved?.id ? `/products/${saved.id}` : "/products");
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Saqlashda xatolik yuz berdi");
    } finally { setSaving(false); }
  };

  return (
    <main className="ml-[68px] min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link href={editId ? `/products/${product?.slug || editId}` : "/products"} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"><HiOutlineArrowLeft /> Orqaga</Link>
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-7">
          <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">StyleHub katalogi</p><h1 className="mt-1 text-2xl font-extrabold">{editId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo‘shish"}</h1><p className="mt-2 text-sm text-[var(--text-muted)]">Mahsulot ma’lumotlarini kiriting va saqlang.</p></div>
          {errorMessage && <p className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">{errorMessage}</p>}
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Mahsulot nomi *</span><input required name="title" value={form.title} onChange={setValue} className={input} placeholder="Masalan: Classic T-shirt" /></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Narxi *</span><input required min="0" step="0.01" type="number" name="price" value={form.price} onChange={setValue} className={input} placeholder="0.00" /></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Ombor qoldig‘i *</span><input required min="0" type="number" name="stock" value={form.stock} onChange={setValue} className={input} placeholder="0" /></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Kategoriya</span><select name="categoryId" value={form.categoryId} onChange={setValue} className={input}><option value="">Kategoriyani tanlang</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
              <label><span className="mb-1.5 block text-sm font-semibold">Reyting</span><input min="0" max="5" step="0.1" type="number" name="rating" value={form.rating} onChange={setValue} className={input} placeholder="0 - 5" /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Rasm URL</span><input type="url" name="image" value={form.image} onChange={setValue} className={input} placeholder="https://..." /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold">Tavsif</span><textarea name="description" value={form.description} onChange={setValue} rows="5" className={`${input} resize-y`} placeholder="Mahsulot haqida qisqacha..." /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--border-light)] pt-5"><Link href={editId ? `/products/${product?.slug || editId}` : "/products"} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-hover)]">Bekor qilish</Link><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-wait disabled:opacity-60">{saving ? "Saqlanmoqda..." : <><HiOutlineCheck /> Saqlash</>}</button></div>
          </form>
        </section>
      </div>
    </main>
  );
}
