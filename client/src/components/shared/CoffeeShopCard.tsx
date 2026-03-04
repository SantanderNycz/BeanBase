import { Link } from "wouter";
import { Heart, MapPin, Coffee } from "lucide-react";
import { type CoffeeShopResponse } from "@shared/routes";
import { useToggleFavorite } from "@/hooks/use-coffee-shops";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { redirectToLogin } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";

export function CoffeeShopCard({ shop }: { shop: CoffeeShopResponse }) {
  const { isAuthenticated } = useAuth();
  const toggleFavorite = useToggleFavorite();
  const { toast } = useToast();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if clicking the heart inside the link area
    if (!isAuthenticated) {
      redirectToLogin(toast);
      return;
    }
    toggleFavorite.mutate(shop.id);
  };

  return (
    <Link href={`/shops/${shop.id}`} className="block group">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 hover-elevate shadow-sm h-full flex flex-col">
        {/* Image Header */}
        <div className="aspect-[4/3] w-full relative bg-secondary overflow-hidden">
          {shop.imageUrl ? (
            <img 
              src={shop.imageUrl} 
              alt={shop.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <Coffee className="w-12 h-12 text-primary/30" />
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className={`absolute top-3 right-3 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 transition-colors ${
              shop.isFavorite ? 'text-rose-500' : 'text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${shop.isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Stats badge bottom left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{shop.favoritesCount || 0}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {shop.name}
          </h3>
          
          <div className="flex items-start gap-1.5 mt-2 text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-sm line-clamp-2 leading-relaxed">
              {shop.address}
            </p>
          </div>
          
          <p className="mt-4 text-sm text-foreground/80 line-clamp-2 mt-auto">
            {shop.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
