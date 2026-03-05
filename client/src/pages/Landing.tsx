import { ArrowRight, Heart, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "@/hooks/use-language";

export default function Landing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 relative z-10 -mt-10">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground/80 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            {t("landingTagline")}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-foreground text-balance leading-[1.1]">
            {t("landingHeroLine1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {t("landingHeroHighlight")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            {t("landingSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 w-full sm:w-auto"
              onClick={() => (window.location.href = "/login")}
            >
              {t("getStarted")} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-full text-base font-medium border-2 hover:bg-secondary/50 w-full sm:w-auto"
              onClick={() => (window.location.href = "/shops")}
            >
              {t("exploreShops")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mt-24 pt-10 border-t border-border/40 text-left animate-in fade-in duration-1000 delay-300 fill-mode-both">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif font-semibold text-xl mb-2">
              {t("featureDiscoverTitle")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("featureDiscoverDesc")}
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
            <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif font-semibold text-xl mb-2">
              {t("featureShareTitle")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("featureShareDesc")}
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
            <div className="bg-rose-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="font-serif font-semibold text-xl mb-2">
              {t("featureFavTitle")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("featureFavDesc")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
