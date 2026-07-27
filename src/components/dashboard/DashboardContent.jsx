"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiOutlineArchiveBox,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationTriangle,
  HiOutlineShoppingBag,
  HiOutlineStar,
} from "react-icons/hi2";
import SaidBar from "@/components/saiidbar/SaidBar";
import { useProducts } from "@/hooks/useProducts";

const PAGE_SIZE = 14;

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);
}

function ProductImage({ product }) {
  return (
    <div className="dashboard-product-image">
      {product.image ? (
        <img src={product.image} alt={product.title} />
      ) : (
        <HiOutlineShoppingBag aria-hidden="true" />
      )}
    </div>
  );
}

export default function DashboardContent() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useProducts({
    page,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    order: "DESC",
  });

  const items = useMemo(() => (Array.isArray(data?.items) ? data.items : []), [data]);
  const meta = data?.meta || {};
  const totalPages = Math.max(Number(meta.totalPages) || 1, 1);

  const stats = useMemo(() => {
    const lowStock = items.filter((product) => Number(product.stock) < 10).length;
    const inventoryValue = items.reduce(
      (total, product) => total + (Number(product.price) || 0) * (Number(product.stock) || 0),
      0,
    );

    return [
      { label: "Jami mahsulot", value: meta.total ?? 0, icon: HiOutlineArchiveBox, tone: "blue" },
      { label: "Faol mahsulot", value: items.filter((product) => product.isActive).length, icon: HiOutlineShoppingBag, tone: "green" },
      { label: "Kam qolgan", value: lowStock, icon: HiOutlineExclamationTriangle, tone: "orange" },
      { label: "Ombor qiymati", value: formatPrice(inventoryValue), icon: HiOutlineCurrencyDollar, tone: "purple" },
    ];
  }, [items, meta.total]);

  const goToPage = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) setPage(nextPage);
  };

  return (
    <div className="dashboard-layout">
      <SaidBar />
      <main className="dashboard-content">
        <header className="dash-header">
          <p className="dash-eyebrow">StyleHub boshqaruv paneli</p>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Mahsulotlaringiz holatini bir joyda kuzating.</p>
        </header>

        <section className="dash-stats" aria-label="Mahsulot statistikasi">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <article className="dash-stat-card" key={label}>
              <div className={`dash-stat-icon dash-stat-icon-${tone}`}><Icon aria-hidden="true" /></div>
              <div className="dash-stat-info">
                <span className="dash-stat-label">{label}</span>
                <strong className="dash-stat-value">{value}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="dash-table-section dashboard-products-section">
          <div className="dashboard-section-header">
            <div>
              <h2 className="dash-section-title">So‘nggi mahsulotlar</h2>
            </div>
            <Link className="dashboard-view-all" href="/products">Barchasini ko‘rish</Link>
          </div>

          {isLoading && <div className="dashboard-state">Mahsulotlar yuklanmoqda...</div>}
          {isError && (
            <div className="dashboard-state dashboard-state-error">
              Mahsulotlarni yuklashda xatolik yuz berdi{error?.response?.data?.message ? `: ${error.response.data.message}` : "."}
            </div>
          )}
          {!isLoading && !isError && items.length === 0 && (
            <div className="dashboard-state">Hozircha mahsulotlar topilmadi.</div>
          )}

          {!isLoading && !isError && items.length > 0 && (
            <>
              <div className="dashboard-product-grid">
                {items.map((product) => (
                  <Link className="dashboard-product-card" href={`/products/${product.slug}`} key={product.id}>
                    <ProductImage product={product} />
                    <div className="dashboard-product-body">
                      <div className="dashboard-product-category">{product.category?.name || "Kategoriya yo‘q"}</div>
                      <h3>{product.title}</h3>
                      <div className="dashboard-product-meta">
                        <strong>{formatPrice(product.price)}</strong>
                        <span><HiOutlineStar aria-hidden="true" /> {product.rating ?? "—"}</span>
                      </div>
                      <div className="dashboard-stock">Omborda: {product.stock ?? 0} dona</div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="dashboard-pagination">
                <span>{meta.total ?? items.length} ta mahsulotdan {page}-sahifa</span>
                <div>
                  <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>Oldingi</button>
                  <span className="dashboard-page-number">{page} / {totalPages}</span>
                  <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>Keyingi</button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
