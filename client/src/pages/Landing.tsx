import { ArrowRight, Bell, MapPin, Users, LogIn, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "@/hooks/use-language";

const FEATURED_SHOPS = [
  {
    name: "The Roasted Bean",
    address: "Rua das Flores 12, Porto",
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Espresso Express",
    address: "Av. da Liberdade 44, Lisboa",
    image:
      "https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    name: "Central Perk",
    address: "Praça do Comércio 3, Coimbra",
    image:
      "https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    { icon: MapPin, title: t("featureDiscoverTitle"), desc: t("featureDiscoverDesc") },
    { icon: Users, title: t("featureShareTitle"), desc: t("featureShareDesc") },
    { icon: Bell, title: t("featureNotifTitle"), desc: t("featureNotifDesc") },
    { icon: LogIn, title: t("featureOAuthTitle"), desc: t("featureOAuthDesc") },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24">
          <div className="max-w-3xl space-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-sm font-medium text-foreground/80">
              <span className="flex h-2 w-2 rounded-full bg-primary motion-safe:animate-pulse" />
              {t("landingTagline")}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-foreground text-balance leading-[1.1]">
              {t("landingHeroLine1")}{" "}
              <span className="relative whitespace-nowrap text-primary">
                {t("landingHeroHighlight")}
                <span className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-primary/30" />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed text-balance">
              {t("landingSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                size="lg"
                className="h-12 px-7 rounded-full text-base font-semibold"
                onClick={() => (window.location.href = "/login")}
              >
                {t("getStarted")} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-7 rounded-full text-base font-medium border-2"
                onClick={() => (window.location.href = "/shops")}
              >
                {t("exploreShops")}
              </Button>
            </div>
          </div>
        </section>

        {/* Featured coffee shops */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {t("landingFeaturedTitle")}
            </h2>
            <p className="text-muted-foreground mt-1">{t("landingFeaturedSub")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_SHOPS.map((shop) => (
              <a
                key={shop.name}
                href="/shops"
                className="group block rounded-2xl overflow-hidden bg-card border border-border hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    loading="lazy"
                    className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-lg text-foreground">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {shop.address}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-secondary/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="space-y-3">
                  <div className="bg-primary/10 w-11 h-11 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif font-semibold text-lg text-foreground">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Coffee className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif font-bold text-foreground">BeanBase</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("footerTagline")}</p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BeanBase
          </p>
        </div>
      </footer>
    </div>
  );
}
