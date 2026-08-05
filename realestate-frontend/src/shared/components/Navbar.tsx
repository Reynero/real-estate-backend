import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Button } from "./Button";

export function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);
  const toggleLanguage = () => i18n.changeLanguage(i18n.language === "en" ? "es" : "en");

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl text-ink" onClick={closeMenu}>
          HomeFind
        </Link>

        <nav className="hidden items-center gap-4 text-sm sm:flex">
          <Link to="/browse" className="text-ink hover:text-slate">
            {t("nav.browse")}
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/favorites" className="text-ink hover:text-slate">
                {t("nav.saved")}
              </Link>
              <Link to="/my-listings" className="text-ink hover:text-slate">
                {t("nav.myListings")}
              </Link>
              {user?.role === "Admin" && (
                <Link to="/admin/properties" className="text-ink hover:text-slate">
                  {t("nav.allProperties")}
                </Link>
              )}
            </>
          )}

          <button
            onClick={toggleLanguage}
            className="rounded-lg border border-line px-2 py-1 text-xs font-medium text-ink hover:bg-linen"
          >
            {i18n.language === "en" ? "ES" : "EN"}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/account" className="text-mute hover:text-slate">
                {t("nav.hi", { name: user?.name.split(" ")[0] })}
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                {t("nav.logOut")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">{t("nav.logIn")}</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">{t("nav.signUp")}</Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={toggleLanguage}
            className="rounded-lg border border-line px-2 py-1.5 text-xs font-medium text-ink"
          >
            {i18n.language === "en" ? "ES" : "EN"}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-line px-6 py-3 text-sm sm:hidden">
          <Link to="/browse" onClick={closeMenu} className="rounded-lg px-2 py-2 text-ink hover:bg-linen">
            {t("nav.browse")}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/favorites" onClick={closeMenu} className="rounded-lg px-2 py-2 text-ink hover:bg-linen">
                {t("nav.saved")}
              </Link>
              <Link to="/my-listings" onClick={closeMenu} className="rounded-lg px-2 py-2 text-ink hover:bg-linen">
                {t("nav.myListings")}
              </Link>
              {user?.role === "Admin" && (
                <Link
                  to="/admin/properties"
                  onClick={closeMenu}
                  className="rounded-lg px-2 py-2 text-ink hover:bg-linen"
                >
                  {t("nav.allProperties")}
                </Link>
              )}
              <Link to="/account" onClick={closeMenu} className="rounded-lg px-2 py-2 text-ink hover:bg-linen">
                {t("nav.hi", { name: user?.name.split(" ")[0] })}
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 rounded-lg px-2 py-2 text-left text-clay hover:bg-linen"
              >
                {t("nav.logOut")}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="rounded-lg px-2 py-2 text-ink hover:bg-linen">
                {t("nav.logIn")}
              </Link>
              <Link to="/register" onClick={closeMenu} className="rounded-lg px-2 py-2 text-ink hover:bg-linen">
                {t("nav.signUp")}
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}