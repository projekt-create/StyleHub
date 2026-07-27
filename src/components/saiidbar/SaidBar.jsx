"use client";

import React, { useState, useContext, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UIContext } from "@/context/UIContext";
import { useAuth } from "@/hooks/useAuth";
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { BsSun, BsMoonStars } from "react-icons/bs";

const navLinks = [
  { href: "/", label: "Dashboard", icon: HiOutlineHome },
  { href: "/products", label: "Mahsulotlar", icon: HiOutlineShoppingBag },
  { href: "/users", label: "Foydalanuvchilar", icon: HiOutlineUsers },
  { href: "/profile", label: "Profil", icon: HiOutlineUser },
  { href: "/doc", label: "Dokumentatsiya", icon: HiOutlineCog6Tooth },
];

const SaidBar = () => {
  const [expanded, setExpanded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { theme, toggleTheme } = useContext(UIContext);
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);

  const handleMouseEnter = () => setExpanded(true);
  const handleMouseLeave = () => setExpanded(false);

  const handleFocus = () => setExpanded(true);
  const handleBlur = (e) => {
    if (sidebarRef.current && sidebarRef.current.contains(e.relatedTarget)) {
      return;
    }
    setExpanded(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      await logout();
    } finally {
      router.replace("/login");
    }
  };

  return (
    <aside
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1}
      className="sidebar-container"
      style={{
        width: expanded ? "240px" : "68px",
      }}
    >
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span>S</span>
        </div>
        {expanded && <span className="sidebar-logo-text">StyleHub</span>}
      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
              title={!expanded ? link.label : undefined}
            >
              <Icon className="sidebar-link-icon" />
              {expanded && <span className="sidebar-link-label">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          onClick={toggleTheme}
          className="sidebar-link sidebar-theme-btn"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? (
            <BsSun className="sidebar-link-icon" />
          ) : (
            <BsMoonStars className="sidebar-link-icon" />
          )}
          {expanded && (
            <span className="sidebar-link-label">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="sidebar-link sidebar-logout"
          title={!expanded ? "Chiqish" : undefined}
          aria-label="Chiqish"
        >
          <HiOutlineArrowRightOnRectangle className="sidebar-link-icon" />
          {expanded && <span className="sidebar-link-label">{loggingOut ? "Chiqilmoqda..." : "Chiqish"}</span>}
        </button>
      </div>
    </aside>
  );
};

export default SaidBar;
