import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Send } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useComments, useCreateComment } from "@/hooks/use-comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CommentDialog({ 
  open, 
  onOpenChange, 
  postId 
}: { 
  open: boolean; 
  onOpenChange: (o: boolean) => void; 
  postId: number;
}) {
  const { data: comments, isLoading } = useComments(postId);
  const createComment = useCreateComment(postId);
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createComment.mutate({ content: content.trim() }, {
      onSuccess: () => setContent("")
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-card border-border/50">
        <DialogHeader className="p-6 pb-4 border-b border-border/40 bg-background/50 backdrop-blur-sm">
          <DialogTitle className="font-serif text-xl">Comments</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] p-6 pt-2">
          {isLoading ? (
            <div className="py-10 flex justify-center text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : comments?.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground flex flex-col items-center">
              <p>No comments yet.</p>
              <p className="text-sm mt-1">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6 pt-4">
              {comments?.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-8 w-8 shrink-0 border border-primary/10">
                    <AvatarImage src={comment.author?.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      {comment.author?.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 bg-secondary/20 p-3 rounded-2xl rounded-tl-none border border-border/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">
                        {comment.author?.firstName} {comment.author?.lastName}
                      </p>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt)) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t border-border/40 bg-background">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Add a comment..."
              className="resize-none min-h-[44px] h-[44px] rounded-2xl bg-secondary/30 border-transparent focus-visible:ring-primary/20 py-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!content.trim() || createComment.isPending}
              className="rounded-full shrink-0 h-11 w-11 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              {createComment.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
