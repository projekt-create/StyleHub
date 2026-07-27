"use client";

import { useRouter } from "next/navigation";
import { HiArrowLeft, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useAuth } from "@/hooks/useAuth";

export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const destination = isAuthenticated ? "/dashboard" : "/login";

  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <HiOutlineExclamationTriangle aria-hidden="true" />
        </div>
        <p className="not-found-code">404</p>
        <h1>Sahifa topilmadi</h1>
        <p className="not-found-message">
          Siz qidirayotgan sahifa mavjud emas yoki ko‘chirilgan.
        </p>
        <button
          className="not-found-button"
          disabled={loading}
          onClick={() => router.push(destination)}
        >
          <HiArrowLeft aria-hidden="true" />
          {loading
            ? "Tekshirilmoqda..."
            : isAuthenticated
              ? "Dashboardga qaytish"
              : "Login sahifasiga qaytish"}
        </button>
      </div>
    </main>
  );
}
