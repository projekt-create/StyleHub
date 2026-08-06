"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  HiOutlineCheckCircle,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineKey,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineUsers,
} from "react-icons/hi2";
import SaidBar from "@/components/saiidbar/SaidBar";
import { useAuth } from "@/hooks/useAuth";
import { useChangePassword, useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

const inputClass =
  "mt-2 block w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--placeholder)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]";

const getErrorMessage = (error, fallback) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

  return Array.isArray(message) ? message.join(", ") : String(message);
};

const getUserName = (user) =>
  [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
  user?.name ||
  user?.username ||
  "Foydalanuvchi";

const getUserData = (response) => response?.data || response?.user || response;

export default function Profile() {
  const router = useRouter();

  const { user: authUser } = useAuth();
  const { data, isLoading, isError, error } = useUser();
  const changePassword = useChangePassword();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");

  const user = useMemo(() => getUserData(data) || authUser || {}, [data, authUser]);
  const name = getUserName(user);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (form.newPassword.length < 6) {
      setFormError("Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setFormError("Yangi parol va tasdiqlash paroli bir xil emas.");
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Parol muvaffaqiyatli o‘zgartirildi.");
    } catch (requestError) {
      const message = getErrorMessage(
        requestError,
        "Parolni o‘zgartirishda xatolik yuz berdi."
      );
      setFormError(message);
      toast.error(message);
    }
  };

  const detailItems = [
    { label: "Foydalanuvchi nomi", value: user?.username, icon: HiOutlineUser },
    { label: "Email", value: user?.email, icon: HiOutlineEnvelope },
    {
      label: "Rol",
      value: user?.role || user?.roles?.[0] || "User",
      icon: HiOutlineIdentification,
    },
    {
      label: "Holat",
      value: user?.isActive === false ? "Nofaol" : "Faol",
      icon: HiOutlineCheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SaidBar />
      <main className="ml-[68px] min-h-screen p-4 sm:p-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold">Profil</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Shaxsiy ma’lumotlaringiz va xavfsizlik sozlamalari
              </p>
            </div>
            <button
              type="button"
              onClick={() => (router.push("/users"))}
              className="flex items-center gap-2 self-start rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--bg-hover)] sm:self-auto"
            >
              <HiOutlineUsers className="text-lg text-[var(--primary)]" />
              Foydalanuvchilarni ko‘rish
            </button>
          </div>

          {isError && !authUser && (
            <div className="mb-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {getErrorMessage(error, "Profil ma’lumotlarini yuklashda xatolik yuz berdi.")}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-4 border-b border-[var(--border-light)] pb-6">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[var(--primary)]/15 text-xl font-bold text-[var(--primary)]">
                  {initials || <HiOutlineUser />}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold">{isLoading ? "Yuklanmoqda..." : name}</h2>
                  <p className="truncate text-sm text-[var(--text-muted)]">
                    {user.email || "Email ko‘rsatilmagan"}
                  </p>
                </div>
              </div>

              <h3 className="mb-4 text-lg font-semibold">Men haqimda</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {detailItems.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl border border-[var(--border)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <Icon className="text-base text-[var(--primary)]" />
                      {label}
                    </div>
                    <p className="truncate text-sm font-semibold">{value || "Ko‘rsatilmagan"}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--primary)]/10 text-xl text-[var(--primary)]">
                  <HiOutlineKey />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Parolni o‘zgartirish</h2>
                  <p className="text-sm text-[var(--text-muted)]">Hisobingizni himoyalang</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Joriy parol
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--icon-secondary)]" />
                    <input name="currentPassword" type="password" required value={form.currentPassword} onChange={handleChange} className={`${inputClass} pl-11`} placeholder="Joriy parolingiz" />
                  </div>
                </label>
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Yangi parol
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--icon-secondary)]" />
                    <input name="newPassword" type="password" minLength={6} required value={form.newPassword} onChange={handleChange} className={`${inputClass} pl-11`} placeholder="Kamida 6 ta belgi" />
                  </div>
                </label>
                <label className="block text-sm font-medium text-[var(--text-secondary)]">
                  Yangi parolni tasdiqlang
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--icon-secondary)]" />
                    <input name="confirmPassword" type="password" minLength={6} required value={form.confirmPassword} onChange={handleChange} className={`${inputClass} pl-11`} placeholder="Yangi parolni qayta kiriting" />
                  </div>
                </label>
                <button type="submit" disabled={changePassword.isPending} className="mt-2 flex w-full items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60">
                  {changePassword.isPending ? "Saqlanmoqda..." : "Yangi parolni saqlash"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
