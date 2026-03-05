import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 border-border/50">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-serif mb-2">
            {t("pageNotFound")}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {t("pageNotFoundDesc")}
          </p>
          <Link href="/">
            <Button className="rounded-full">{t("backToHome")}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
