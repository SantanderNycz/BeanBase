import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, MessageCircle, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/use-language";
import { CommentDialog } from "@/components/shared/CommentDialog";
import { useState } from "react";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ["/api/posts", id],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-primary">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );

  if (!post)
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold font-serif mb-4">
          {t("postNotFound")}
        </h2>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6 rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToHome")}
        </Button>
      </Link>

      <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        {/* Photos */}
        {post.photos?.length > 0 && (
          <div
            className={`grid gap-1 ${post.photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
          >
            {post.photos.map((photo: string, idx: number) => (
              <div
                key={idx}
                className={`relative overflow-hidden cursor-pointer ${post.photos.length === 1 ? "aspect-video" : "aspect-square"}`}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={post.author?.profileImageUrl} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {post.author?.firstName?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {post.author?.firstName} {post.author?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="text-foreground/90 text-lg leading-relaxed">
            {post.content}
          </p>

          {/* Coffee Shop */}
          {post.coffeeShop && (
            <Link href={`/shops/${post.coffeeShop.id}`}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full w-fit hover:bg-secondary/50 transition-colors cursor-pointer">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{post.coffeeShop.name}</span>
              </div>
            </Link>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-border/40">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="w-5 h-5" />
              <span>{post.likesCount || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentsCount || 0}</span>
            </div>
          </div>

          {/* Comments */}
          <div className="pt-2 border-t border-border/40">
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => setCommentOpen(true)}
            >
              <MessageCircle className="w-4 h-4 mr-2" /> {t("viewComments")}
            </Button>
          </div>
          <CommentDialog
            open={commentOpen}
            onOpenChange={setCommentOpen}
            postId={post.id}
          />
        </div>
      </div>

      {/* Full screen photo modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt=""
            className="max-w-full max-h-full object-contain rounded-xl"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            onClick={() => setSelectedPhoto(null)}
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  );
}
