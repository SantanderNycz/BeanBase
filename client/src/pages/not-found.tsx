import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Coffee className="w-7 h-7 text-primary" />
        </div>
        <p className="font-serif text-5xl font-bold text-foreground mb-2">404</p>
        <h1 className="text-xl font-bold font-serif mb-2">
          {t("pageNotFound")}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {t("pageNotFoundDesc")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="rounded-full w-full sm:w-auto">
              {t("backToHome")}
            </Button>
          </Link>
          <Link href="/shops">
            <Button
              variant="outline"
              className="rounded-full w-full sm:w-auto border-2"
            >
              {t("exploreShops")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
