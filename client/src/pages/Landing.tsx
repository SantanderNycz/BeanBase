import { Coffee, ArrowRight, Heart, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Decorative background blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Coffee className="w-6 h-6 text-primary" />
          </div>
          <span className="font-serif font-bold text-2xl text-foreground">
            BeanBase
          </span>
        </div>
        <Button
          variant="ghost"
          className="font-medium hover:bg-primary/5 hover:text-primary"
          onClick={() => (window.location.href = "/api/login")}
        >
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 relative z-10 -mt-10">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-sm font-medium text-foreground/80 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Join the community of coffee lovers
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-foreground text-balance leading-[1.1]">
            Discover your next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              perfect cup
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            Share your favorite spots, review the best brews, and explore a
            curated directory of coffee shops tailored by enthusiasts like you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1 w-full sm:w-auto"
              onClick={() => (window.location.href = "/api/login")}
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 rounded-full text-base font-medium border-2 hover:bg-secondary/50 w-full sm:w-auto"
              onClick={() => (window.location.href = "/shops")}
            >
              Explore Shops
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full mt-24 pt-10 border-t border-border/40 text-left animate-in fade-in duration-1000 delay-300 fill-mode-both">
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif font-semibold text-xl mb-2">
              Discover Local
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Find hidden gems and highly rated coffee shops near you with
              detailed community insights.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
            <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif font-semibold text-xl mb-2">
              Share Reviews
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Post your experiences, attach photos, and engage in conversations
              about the perfect roast.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
            <div className="bg-rose-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="font-serif font-semibold text-xl mb-2">
              Save Favorites
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Keep a personal collection of your top-tier shops and build your
              ultimate coffee bucket list.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
