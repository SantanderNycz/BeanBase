import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X, Image as ImageIcon } from "lucide-react";
import { useCreatePost } from "@/hooks/use-posts";
import { useCoffeeShops } from "@/hooks/use-coffee-shops";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

const formSchema = z.object({
  coffeeShopId: z.coerce.number().min(1, "Please select a coffee shop"),
  content: z.string().min(3, "Post content must be at least 3 characters"),
  photos: z
    .array(z.string().url())
    .max(4, "Maximum 4 photos allowed")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePostForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: shops, isLoading: shopsLoading } = useCoffeeShops();
  const createPost = useCreatePost();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: "", photos: [] },
  });

  const handleAddPhoto = () => {
    if (!currentUrl.trim()) return;
    try {
      new URL(currentUrl);
      if (photoUrls.length >= 4) {
        toast({
          title: t("limitReached"),
          description: t("maxPhotos"),
          variant: "destructive" as const,
        });
        return;
      }
      const updated = [...photoUrls, currentUrl];
      setPhotoUrls(updated);
      form.setValue("photos", updated);
      setCurrentUrl("");
    } catch {
      toast({
        title: t("invalidUrl"),
        description: t("invalidUrlDesc"),
        variant: "destructive" as const,
      });
    }
  };

  const removePhoto = (index: number) => {
    const updated = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(updated);
    form.setValue("photos", updated);
  };

  const onSubmit = (data: FormValues) => {
    createPost.mutate(data, {
      onSuccess: () => {
        toast({ title: t("postCreated") });
        form.reset();
        setPhotoUrls([]);
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="coffeeShopId"
          render={({ field }) => (
            <FormItem>
              <Label>{t("whereAreYou")}</Label>
              <Select onValueChange={field.onChange} disabled={shopsLoading}>
                <FormControl>
                  <SelectTrigger className="bg-background rounded-xl h-12 border-border/50 focus:ring-primary/20">
                    <SelectValue placeholder={t("selectCoffeeShop")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shops?.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id.toString()}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <Label>{t("yourThoughts")}</Label>
              <FormControl>
                <Textarea
                  placeholder={t("howsTheBrew")}
                  className="resize-none min-h-[120px] rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> {t("photos")}
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder={t("pasteImageUrl")}
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="rounded-xl bg-background border-border/50 h-11"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPhoto();
                }
              }}
              disabled={photoUrls.length >= 4}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddPhoto}
              disabled={!currentUrl || photoUrls.length >= 4}
              className="rounded-xl px-4 h-11"
            >
              {t("add")}
            </Button>
          </div>
          {photoUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {photoUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden group border border-border/50 shadow-sm"
                >
                  <img
                    src={url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => removePhoto(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl font-medium text-base shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
              {t("publishing")}
            </>
          ) : (
            t("sharePost")
          )}
        </Button>
      </form>
    </Form>
  );
}
