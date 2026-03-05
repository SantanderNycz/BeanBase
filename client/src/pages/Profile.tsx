import { useAuth } from "@/hooks/use-auth";
import { usePosts } from "@/hooks/use-posts";
import { useCoffeeShops } from "@/hooks/use-coffee-shops";
import { PostCard } from "@/components/shared/PostCard";
import { CoffeeShopCard } from "@/components/shared/CoffeeShopCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();

  // Get user's own posts
  const { data: posts, isLoading: postsLoading } = usePosts({
    userId: user?.id,
  });

  const { data: allShops, isLoading: shopsLoading } = useCoffeeShops();
  const favoriteShops = allShops?.filter((s) => s.isFavorite) || [];

  const {t} = useLanguage();

  if (authLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-8 bg-card rounded-3xl border border-border">
        <h2 className="text-2xl font-serif font-bold mb-4">t("notSignedIn")</h2>
        <p className="text-muted-foreground mb-6">t("notSignedInDesc")</p>
        <Button onClick={() => (window.location.href = "/login")} size="lg">
          {t("signIn")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-secondary/50" />

        <Avatar className="h-32 w-32 border-4 border-background shadow-xl mt-8 sm:mt-10 relative z-10 bg-background">
          <AvatarImage src={user.profileImageUrl || undefined} />
          <AvatarFallback className="text-4xl bg-primary/10 text-primary font-serif">
            {user.firstName?.[0] || <UserIcon className="w-12 h-12" />}
          </AvatarFallback>
        </Avatar>

        <div className="mt-4 sm:mt-24 relative z-10 flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-serif text-foreground">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" className="rounded-full">
              <Settings className="w-4 h-4 mr-2" /> t("editProfile")
            </Button>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-6 mt-6 pt-6 border-t border-border/40">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {posts?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">t("posts")</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {favoriteShops.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">t("savedShops")</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-secondary/50 rounded-full p-1 h-14">
            <TabsTrigger value="posts" className="rounded-full text-base">
              t("myPosts")
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-full text-base">
              t("savedShops")
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="posts" className="focus-visible:outline-none">
              {postsLoading ? (
                <div className="py-10 text-center text-primary">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto" />
                </div>
              ) : posts?.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
                  <p className="text-muted-foreground">t("noPostsProfile")</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {posts?.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="favorites"
              className="focus-visible:outline-none"
            >
              {shopsLoading ? (
                <div className="py-10 text-center text-primary">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto" />
                </div>
              ) : favoriteShops.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
                  <p className="text-muted-foreground">
                    t("noFavoritesProfile")
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteShops.map((shop) => (
                    <CoffeeShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
