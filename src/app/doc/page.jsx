"use client";

import React from "react";
import SaidBar from "@/components/saiidbar/SaidBar";
import {
  HiOutlineDocumentText,
  HiOutlineCodeBracket,
  HiOutlineServerStack,
  HiOutlineKey,
} from "react-icons/hi2";

export default function DocPage() {
  return (
    <div className="dashboard-layout">
      <SaidBar />
      <main className="dashboard-content">
        <header className="dash-header">
          <p className="dash-eyebrow">StyleHub tizim yo'riqnomasi</p>
          <h1 className="dash-title">Dokumentatsiya</h1>
          <p className="dash-subtitle">API endpointlar va platforma infratuzilmasi haqida texnik hujjatlar.</p>
        </header>

        <div className="space-y-6 max-w-4xl">
          {/* Base URL */}
          <div className="dash-table-section">
            <h2 className="dash-section-title flex items-center gap-2 mb-3">
              <HiOutlineServerStack className="text-[var(--primary)] text-xl" />
              API Server Base URL
            </h2>
            <div className="p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border)] font-mono text-sm text-[var(--primary)]">
              https://api.magnateshop.uz/api/v1
            </div>
          </div>

          {/* Endpoints Table */}
          <div className="dash-table-section">
            <h2 className="dash-section-title flex items-center gap-2 mb-4">
              <HiOutlineCodeBracket className="text-[var(--primary)] text-xl" />
              Asosiy API Endpointlar
            </h2>

            <div className="space-y-3">
              {/* Auth */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">POST</span>
                  <span className="font-mono text-sm font-bold text-[var(--text)]">/auth/login</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Foydalanuvchi logini. AccessToken va RefreshToken qaytaradi.</p>
              </div>

              {/* Products */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">GET</span>
                  <span className="font-mono text-sm font-bold text-[var(--text)]">/products</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Mahsulotlar ro'yxatini olish. Query params: page, limit, search, categoryId, sortBy, order.</p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">GET</span>
                  <span className="font-mono text-sm font-bold text-[var(--text)]">/products/:id yoki /products/slug/:slug</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">ID yoki slug bo'yicha yakka mahsulot ma'lumotlarini olish.</p>
              </div>

              {/* Users */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">GET</span>
                  <span className="font-mono text-sm font-bold text-[var(--text)]">/users</span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">Tizim foydalanuvchilari ro'yxatini olish (Admin huquqi talab etiladi).</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
