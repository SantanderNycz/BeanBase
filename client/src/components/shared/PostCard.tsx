import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { Heart, MessageCircle, MapPin, Trash2 } from "lucide-react";
import type { Post, CoffeeShop } from "@shared/schema";
import type { User } from "@shared/models/auth";
import { useToggleLike } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./Carousel";
import { redirectToLogin } from "@/lib/auth-utils";
import { useToast } from "@/hooks/use-toast";
import { CommentDialog } from "./CommentDialog";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type PostResponse = Post & {
  author?: User;
  coffeeShop?: CoffeeShop;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  photos?: string[];
};

export function PostCard({ post }: { post: PostResponse }) {
  const { isAuthenticated, user } = useAuth();
  const toggleLike = useToggleLike();
  const { toast } = useToast();
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleLike = () => {
    if (!isAuthenticated) {
      redirectToLogin(toast);
      return;
    }
    toggleLike.mutate(post.id);
  };

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      redirectToLogin(toast);
      return;
    }
    setCommentDialogOpen(true);
  };

  const handleDelete = async () => {
    await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
  };

  const hasPhotos = post.photos && post.photos.length > 0;

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden hover-elevate transition-all duration-300">
      {/* Header */}
      <div className="p-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
            <AvatarImage src={post.author?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {post.author?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {post.author?.firstName} {post.author?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">
              {post.createdAt
                ? formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.coffeeShop && (
            <Link
              href={`/shops/${post.coffeeShop.id}`}
              className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">
                {post.coffeeShop.name}
              </span>
            </Link>
          )}

          {/* Botão de eliminar — só aparece para o autor */}
          {user?.id === post.author?.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:bg-destructive/10 rounded-full p-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Photos Carousel */}
      {hasPhotos && (
        <div className="w-full relative bg-secondary/30">
          <Carousel className="w-full">
            <CarouselContent>
              {post.photos!.map((photoUrl: string, idx: number) => (
                <CarouselItem key={idx}>
                  <div className="aspect-[4/3] sm:aspect-video w-full overflow-hidden">
                    <img
                      src={photoUrl}
                      alt={`Post image ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {post.photos!.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Content */}
      <div className="p-5 pt-4">
        <p className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex items-center gap-4 border-t border-border/40 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center gap-2 rounded-full px-4 ${post.isLiked ? "text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 dark:bg-rose-500/10" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
          <span className="font-medium">{post.likesCount || 0}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCommentClick}
          className="flex items-center gap-2 rounded-full px-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{post.commentsCount || 0}</span>
        </Button>
      </div>

      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        postId={post.id}
      />
    </div>
  );
}
