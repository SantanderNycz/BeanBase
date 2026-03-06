import { useParams } from "wouter";
import { useCoffeeShop, useToggleFavorite } from "@/hooks/use-coffee-shops";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { PostCard } from "@/components/shared/PostCard";
import { Button } from "@/components/ui/button";
import { redirectToLogin } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Trash2,
} from "lucide-react";
import { useLocation } from "wouter";

export default function CoffeeShopDetails() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const shopId = parseInt(id, 10);
  const { data: shop, isLoading: shopLoading } = useCoffeeShop(shopId);
  const { data: posts, isLoading: postsLoading } = usePosts({
    coffeeShopId: id,
  });
  const { isAuthenticated } = useAuth();
  const toggleFavorite = useToggleFavorite();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleFavorite = () => {
    if (!isAuthenticated) {
      redirectToLogin(toast);
      return;
    }
    toggleFavorite.mutate(shopId);
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/coffee-shops/${shopId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) navigate("/shops");
  };

  if (shopLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-primary animate-pulse">
        {t("loading")}
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold font-serif mb-4">
          {t("shopNotFound")}
        </h2>
        <Link href="/shops">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToDirectory")}
          </Button>
        </Link>
      </div>
    );
  }

  const defaultBg =
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&h=600&fit=crop";

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] sm:h-[50vh] w-full bg-secondary">
        <img
          src={shop.imageUrl || defaultBg}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute top-6 left-6">
          <Link href="/shops">
            <Button
              variant="outline"
              size="sm"
              className="bg-background/50 backdrop-blur-md border-transparent hover:bg-background/80 rounded-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("directory")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-32">
        {/* Main Info Card */}
        <div className="bg-card rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/5 border border-border/50 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
                {shop.name}
              </h1>
              <div className="items-center gap-2 text-muted-foreground bg-secondary/30 inline-flex px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5 shrink-0 text-primary" />
                <span className="font-medium text-sm sm:text-base">
                  {shop.address}
                </span>
              </div>
              <p className="text-foreground/80 leading-relaxed text-lg pt-2">
                {shop.description}
              </p>
            </div>

            <div className="flex sm:flex-col gap-3 shrink-0">
              <Button
                size="lg"
                onClick={handleFavorite}
                className={`w-full sm:w-[160px] rounded-xl h-14 ${shop.isFavorite ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20" : ""}`}
                variant={shop.isFavorite ? "outline" : "default"}
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${shop.isFavorite ? "fill-current" : ""}`}
                />
                {shop.isFavorite ? t("saved") : t("favorite")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-[160px] rounded-xl h-14"
                asChild
              >
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(shop.address)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="w-5 h-5 mr-2" /> {t("directions")}
                </a>
              </Button>{" "}
              {user?.id === shop.userId && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-[160px] rounded-xl h-14 text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-5 h-5 mr-2" /> {t("delete")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h2 className="font-serif text-2xl font-bold">
              {t("communityReviews")}
            </h2>
            <span className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
              {posts?.length || 0} {t("posts")}
            </span>
          </div>

          {postsLoading ? (
            <div className="py-10 text-center text-primary">
              <Loader2 className="animate-spin h-8 w-8 mx-auto" />
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-3xl border border-border/50">
              <p className="text-muted-foreground text-lg mb-4">
                {t("noReviewsYet")} {shop.name}.
              </p>
              <Link href="/">
                <Button variant="outline">{t("beFirstToPost")}</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
