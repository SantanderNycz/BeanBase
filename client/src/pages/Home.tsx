import { useState } from "react";
import { Loader2, Plus, PenSquare, Coffee } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { PostCard } from "@/components/shared/PostCard";
import { CreatePostForm } from "@/components/forms/CreatePostForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { redirectToLogin } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

export default function Home() {
  const { data: posts, isLoading } = usePosts();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      redirectToLogin(toast);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8 bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {t("coffeeFeed")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("feedSubtitle")}
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleCreateClick}
              className="rounded-full h-12 px-6 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <PenSquare className="w-5 h-5 mr-2" /> {t("sharePost")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl bg-card border-border/50 p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-serif text-2xl">
                {t("createPost")}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t("feedSubtitle")}
              </DialogDescription>
            </DialogHeader>
            <CreatePostForm onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary">
          <Loader2 className="h-10 w-10 animate-spin mb-4" />
          <p className="font-medium text-muted-foreground">
            {t("brewingFeed")}
          </p>
        </div>
      ) : posts?.length === 0 ? (
        <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-border/40 border-dashed">
          <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Coffee className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl font-bold mb-2">
            {t("quietHere")}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {t("noPostsYet")}
          </p>
          <Button onClick={() => setCreateOpen(true)} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" /> {t("createFirstPost")}
          </Button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
