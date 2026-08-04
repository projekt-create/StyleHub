"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  HiOutlineKey,
  HiOutlineMagnifyingGlass,
  HiOutlineTrash,
  HiOutlineUsers,
  HiOutlineXMark,
} from "react-icons/hi2";
import SaidBar from "@/components/saiidbar/SaidBar";
import { useUsers } from "@/hooks/useUsers";
import UserService from "@/service/UserService";

const PAGE_SIZE = 12;
const inputClass =
  "rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]";

const getName = (user) =>
  [user.firstName, user.lastName].filter(Boolean).join(" ") ||
  user.username ||
  user.name ||
  "Noma’lum foydalanuvchi";

const getInitials = (user) =>
  getName(user)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function PasswordModal({ user, onClose, onSaved }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo‘lsin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Parollar bir xil emas.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await UserService.update(user.id, { password });
      onSaved("Parol muvaffaqiyatli o‘zgartirildi.");
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Parolni o‘zgartirishda xatolik yuz berdi."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="my-auto w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              Xavfsizlik
            </p>
            <h2 className="mt-1 text-xl font-bold">Parolni o‘zgartirish</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {getName(user)} uchun yangi parol.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <HiOutlineXMark />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Yangi parol</span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value.trim())}
              className={`${inputClass} w-full`}
              placeholder="Kamida 6 ta belgi"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">
              Parolni tasdiqlang
            </span>
            <input
              required
              minLength={6}
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value.trim())
              }
              className={`${inputClass} w-full`}
              placeholder="Parolni qayta kiriting"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`${inputClass} text-sm`}
            >
              Bekor qilish
            </button>
            <button
              disabled={saving}
              className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserActions({ user, onPassword, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        title="Parolni o‘zgartirish"
        onClick={() => onPassword(user)}
        className="rounded-lg p-2 text-amber-500 transition hover:bg-amber-500/10"
      >
        <HiOutlineKey />
      </button>
      <button
        type="button"
        title="O‘chirish"
        onClick={() => onDelete(user)}
        className="rounded-lg p-2 text-red-500 transition hover:bg-red-500/10"
      >
        <HiOutlineTrash />
      </button>
    </div>
  );
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useUsers({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const users = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data)
      ? data
      : [];
  const meta = data?.meta || {};
  const totalPages = Math.max(Number(meta.totalPages) || 1, 1);

  const deleteUser = async (user) => {
    if (!confirm(`${getName(user)}ni o‘chirishni xohlaysizmi?`)) return;

    try {
      await UserService.remove(user.id);
      setMessage("Foydalanuvchi o‘chirildi.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      setMessage(
        err?.response?.data?.message ||
          "Foydalanuvchini o‘chirishda xatolik yuz berdi."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SaidBar />
      <main className="ml-[68px] min-h-screen p-4 sm:p-8">
        <div className="mx-auto max-w-[1440px]">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <HiOutlineUsers className="text-[var(--primary)]" />
                Foydalanuvchilar ro‘yxati
              </h2>
              <label className="relative w-full sm:w-72">
                <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--icon-secondary)]" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  className={`${inputClass} w-full pl-10`}
                  placeholder="Qidirish..."
                />
              </label>
            </div>

            {message && (
              <div className="mb-4 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
                {message}
              </div>
            )}

            {isLoading && (
              <p className="py-16 text-center text-sm text-[var(--text-muted)]">
                Foydalanuvchilar yuklanmoqda...
              </p>
            )}

            {isError && (
              <p className="py-16 text-center text-sm text-red-500">
                {error?.response?.data?.message ||
                  "Foydalanuvchilarni yuklashda xatolik yuz berdi."}
              </p>
            )}

            {!isLoading && !isError && !users.length && (
              <p className="py-16 text-center text-sm text-[var(--text-muted)]">
                Foydalanuvchilar topilmadi.
              </p>
            )}

            {!isLoading && !isError && users.length > 0 && (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                      <tr>
                        <th className="px-3 py-3">Foydalanuvchi</th>
                        <th className="px-3 py-3">Email</th>
                        <th className="px-3 py-3">Rol</th>
                        <th className="px-3 py-3">Holat</th>
                        <th className="px-3 py-3">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {users.map((user) => (
                        <tr key={user.id} className="transition hover:bg-[var(--bg-hover)]">
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--primary)]/15 font-bold text-[var(--primary)]">
                                  <img src={user.avatar || user.image} alt="" className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold">{getName(user)}</p>
                                <p className="text-xs text-[var(--text-muted)]">@{user.username || "user"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 text-[var(--text-muted)]">{user.email || "—"}</td>
                          <td className="px-3 py-4"><span className="rounded-lg bg-[var(--primary)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">{user.role || user.roles?.[0] || "User"}</span></td>
                          <td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.isActive === false ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>{user.isActive === false ? "Nofaol" : "Faol"}</span></td>
                          <td className="px-3 py-4"><UserActions user={user} onPassword={setSelectedUser} onDelete={deleteUser} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-3 md:hidden">
                  {users.map((user) => (
                    <article key={user.id} className="rounded-xl border border-[var(--border)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--primary)]/15 font-bold text-[var(--primary)]">{getInitials(user)}</div>
                        <div className="min-w-0"><h3 className="truncate font-semibold">{getName(user)}</h3><p className="truncate text-xs text-[var(--text-muted)]">{user.email || "Email ko‘rsatilmagan"}</p></div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-[var(--border-light)] pt-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${user.isActive === false ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>{user.isActive === false ? "Nofaol" : "Faol"}</span><UserActions user={user} onPassword={setSelectedUser} onDelete={deleteUser} /></div>
                    </article>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <span className="text-xs text-[var(--text-muted)]">{page} / {totalPages}-sahifa</span>
                  <div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className={`${inputClass} px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40`}>Oldingi</button><button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className={`${inputClass} px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40`}>Keyingi</button></div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {selectedUser && <PasswordModal user={selectedUser} onClose={() => setSelectedUser(null)} onSaved={setMessage} />}
    </div>
  );
}
