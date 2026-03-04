import { useState } from "react";
import { Store, Loader2, Plus } from "lucide-react";
import { useCoffeeShops } from "@/hooks/use-coffee-shops";
import { useAuth } from "@/hooks/use-auth";
import { CoffeeShopCard } from "@/components/shared/CoffeeShopCard";
import { CreateShopForm } from "@/components/forms/CreateShopForm";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { redirectToLogin } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";

export default function CoffeeShopsDirectory() {
  const { data: shops, isLoading } = useCoffeeShops();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      redirectToLogin(toast);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground">Coffee Shops</h1>
          <p className="text-muted-foreground mt-2 text-lg">Discover and favorite local roasters and cafes.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={handleCreateClick}
              size="lg"
              className="rounded-xl shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" /> Add Shop
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card border-border/50 p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-serif text-2xl">Add a new Coffee Shop</DialogTitle>
            </DialogHeader>
            <CreateShopForm onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-card rounded-2xl aspect-[3/4] animate-pulse border border-border/30" />
          ))}
        </div>
      ) : shops?.length === 0 ? (
        <div className="text-center py-32 bg-secondary/30 rounded-3xl border border-border/40 border-dashed">
          <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-serif text-2xl font-bold mb-2">No shops found</h3>
          <p className="text-muted-foreground">Help the community by adding your local favorites.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-700">
          {shops?.map(shop => (
            <CoffeeShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
