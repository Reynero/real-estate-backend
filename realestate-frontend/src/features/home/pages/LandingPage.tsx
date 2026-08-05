import { Home, Key, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/Button";

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden px-6 py-24 text-center text-white sm:py-32">
        <img
          src="/hero-house.jpg"
          alt="A house exterior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/50 to-ink/30" />

        <div className="relative">
          <h1 className="font-display text-4xl leading-tight sm:text-5xl">{t("landing.heroTitle")}</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/85">{t("landing.heroSubtitle")}</p>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              onClick={() => navigate("/browse?listingType=ForSale")}
              className="flex flex-col items-center gap-2 rounded-card border border-white/30 bg-white/10 px-6 py-6 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Home size={28} />
              <span className="font-medium">{t("landing.buy")}</span>
            </button>
            <button
              onClick={() => navigate("/browse?listingType=ForRent")}
              className="flex flex-col items-center gap-2 rounded-card border border-white/30 bg-white/10 px-6 py-6 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Key size={28} />
              <span className="font-medium">{t("landing.rent")}</span>
            </button>
            <button
              onClick={() => navigate("/my-listings/new")}
              className="flex flex-col items-center gap-2 rounded-card border border-white/30 bg-white/10 px-6 py-6 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Tag size={28} />
              <span className="font-medium">{t("landing.sell")}</span>
            </button>
          </div>

          <div className="mt-8">
            <Button variant="secondary" onClick={() => navigate("/browse")}>
              {t("landing.browseAll")}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-ink">{t("landing.aboutTitle")}</h2>
        <p className="mt-4 text-mute">{t("landing.aboutBody")}</p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-3xl text-slate">1</p>
            <p className="mt-1 text-sm text-mute">{t("landing.step1")}</p>
          </div>
          <div>
            <p className="font-display text-3xl text-slate">2</p>
            <p className="mt-1 text-sm text-mute">{t("landing.step2")}</p>
          </div>
          <div>
            <p className="font-display text-3xl text-slate">3</p>
            <p className="mt-1 text-sm text-mute">{t("landing.step3")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}