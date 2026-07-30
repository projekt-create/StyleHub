"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import SaidBar from "../saiidbar/SaidBar";
import { useProducts } from "@/hooks/useProducts";
import { useUsers } from "@/hooks/useUsers";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell,
} from "recharts";
import {
  HiOutlineArrowRight, HiOutlineArrowTrendingUp, HiOutlineCube,
  HiOutlineRectangleStack, HiOutlineShoppingBag, HiOutlineUsers,
} from "react-icons/hi2";

const COLORS = ["#2563eb", "#22c55e"];
const cardClass = "rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_8px_24px_var(--shadow)]";

function StatCard({ icon: Icon, label, value, note, tone }) {
  const tones = {
    blue: "bg-blue-500/15 text-blue-400",
    green: "bg-green-500/15 text-green-400",
    violet: "bg-violet-500/15 text-violet-400",
    orange: "bg-orange-500/15 text-orange-400",
  };

  return (
    <div className={`${cardClass} flex items-start gap-3.5 transition-transform hover:-translate-y-0.5`}>
      <div className={`grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl text-[21px] ${tones[tone]}`}><Icon /></div>
      <div>
        <p className="mb-2 text-[13px] text-[var(--text-muted)]">{label}</p>
        <strong className="block text-[27px] leading-none tracking-tight text-[var(--text)]">{value}</strong>
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: products, isLoading: productsLoading, error: productsError, isError: productsIsError } = useProducts();
  const { data: users, isLoading: usersLoading, error: usersError, isError: usersIsError } = useUsers();

  const productTotal = products?.meta?.total ?? 0;
  const userTotal = users?.meta?.total ?? 0;
  const totalPages = products?.meta?.totalPages ?? 0;
  const productItems = Array.isArray(products?.items) ? products.items : [];
  const chartData = useMemo(() => [{ name: "Mahsulotlar", total: productTotal }, { name: "Foydalanuvchilar", total: userTotal }], [productTotal, userTotal]);
  const pieData = useMemo(() => [{ name: "Mahsulotlar", value: productTotal }, { name: "Foydalanuvchilar", value: userTotal }], [productTotal, userTotal]);

  if (productsLoading || usersLoading) return <div className="grid min-h-screen place-items-center text-sm text-[var(--text-muted)]">Ma’lumotlar yuklanmoqda...</div>;
  if (productsIsError || usersIsError) return <div className="grid min-h-screen place-items-center text-sm text-red-500">{productsError?.message || usersError?.message || "Ma’lumotlarni yuklashda xatolik yuz berdi."}</div>;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SaidBar SetSaidbarOpen={setSidebarOpen} saidBarOpen={sidebarOpen} />
      <main className={`min-h-screen p-4 pt-6 transition-[margin] duration-300 sm:p-8 ${sidebarOpen ? "ml-[68px] sm:ml-[240px]" : "ml-[68px]"}`}>
        <header className="mx-auto mb-7 flex max-w-[1440px] flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-[clamp(28px,4vw,38px)] font-extrabold leading-tight tracking-tight text-(--text)">Dashboard</h1>
          </div>
          <Link href="/products" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] md:w-auto"><HiOutlineShoppingBag /> Mahsulotlarni ko‘rish <HiOutlineArrowRight /></Link>
        </header>

        <section className="mx-auto mb-6 grid max-w-[1440px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={HiOutlineCube} label="Jami mahsulotlar" value={productTotal} tone="blue" note={<><HiOutlineArrowTrendingUp className="text-green-500" /> Katalogdagi jami</>} />
          <StatCard icon={HiOutlineUsers} label="Foydalanuvchilar" value={userTotal} tone="green" note={<><HiOutlineArrowTrendingUp className="text-green-500" /> Ro‘yxatdan o‘tganlar</>} />
          <StatCard icon={HiOutlineRectangleStack} label="Joriy sahifa" value={<>{products?.meta?.page ?? 0}<small className="text-sm text-[var(--text-muted)]"> / {totalPages}</small></>} tone="violet" note="Mahsulot sahifalari" />
          <StatCard icon={HiOutlineArrowTrendingUp} label="Holat" value={<span className="!text-[23px] !text-green-500">Faol</span>} tone="orange" note="Panel ishlayapti" />
        </section>

        <div className="mx-auto mb-6 grid max-w-[1440px] grid-cols-1 gap-4 xl:grid-cols-[1.35fr_1fr]">
          <section className={cardClass}>
            <div className="mb-2 flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">Umumiy ko‘rinish</p><h2 className="mt-1 text-lg font-bold text-[var(--text)]">Mahsulotlar va foydalanuvchilar</h2></div><span className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--text-muted)]">Jami</span></div>
            <ResponsiveContainer width="100%" height={350}><BarChart data={chartData}><CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)" }} /><YAxis stroke="var(--text-muted)" tick={{ fill: "var(--text-muted)" }} /><Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)" }} /><Bar dataKey="total" fill="var(--primary)" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
          </section>
          <section className={cardClass}>
            <div className="mb-2"><p className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">Taqsimot</p><h2 className="mt-1 text-lg font-bold text-[var(--text)]">Platforma tarkibi</h2></div>
            <ResponsiveContainer width="100%" height={350}><PieChart><Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{pieData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)" }} /></PieChart></ResponsiveContainer>
          </section>
        </div>

        <section className={`${cardClass} mx-auto max-w-[1440px]`}>
          <div className="mb-3 flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">Tezkor ko‘rish</p><h2 className="mt-1 text-lg font-bold text-[var(--text)]">So‘nggi mahsulotlar</h2></div><Link href="/products" className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)]">Barchasini ko‘rish <HiOutlineArrowRight /></Link></div>
          {productItems.length ? <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">{productItems.slice(0, 4).map((product) => <Link href={`/products/${product.slug || product.id}`} key={product.id} className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[var(--border)] p-2.5 transition hover:-translate-y-0.5 hover:border-[var(--primary)]"><div className="grid h-[42px] w-[42px] shrink-0 place-items-center overflow-hidden rounded-lg bg-[var(--bg-hover)] text-[var(--icon-secondary)]">{product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : <HiOutlineShoppingBag />}</div><div className="min-w-0 flex-1"><strong className="block truncate text-xs text-[var(--text)]">{product.title}</strong><span className="mt-0.5 block truncate text-[11px] text-[var(--text-muted)]">{product.category?.name || "Kategoriyasiz"}</span></div><b className="whitespace-nowrap text-[11px] text-[var(--primary)]">{product.stock ?? 0} dona</b></Link>)}</div> : <p className="py-5 text-center text-sm text-[var(--text-muted)]">Hozircha mahsulotlar mavjud emas.</p>}
        </section>
      </main>
    </div>
  );
}
