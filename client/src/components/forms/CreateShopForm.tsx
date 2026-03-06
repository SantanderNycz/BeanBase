import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Store, Upload, X } from "lucide-react";
import { useCreateCoffeeShop } from "@/hooks/use-coffee-shops";
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
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address is required"),
  description: z.string().min(10, "Please provide a short description"),
  imageUrl: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateShopForm({ onSuccess }: { onSuccess?: () => void }) {
  const createShop = useCreateCoffeeShop();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", address: "", description: "", imageUrl: "" },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      form.setValue("imageUrl", url);
      setPreviewUrl(url);
      toast({ title: t("uploadSuccess") });
    } catch {
      toast({ title: t("uploadError"), variant: "destructive" as const });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    const payload = { ...data, imageUrl: data.imageUrl || undefined };
    createShop.mutate(payload, {
      onSuccess: () => {
        toast({ title: t("shopAdded") });
        form.reset();
        setPreviewUrl(null);
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>{t("shopName")}</Label>
              <FormControl>
                <Input
                  placeholder={t("shopNamePlaceholder")}
                  className="h-11 rounded-xl bg-background border-border/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <Label>{t("location")}</Label>
              <FormControl>
                <Input
                  placeholder={t("fullAddress")}
                  className="h-11 rounded-xl bg-background border-border/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>{t("description")}</Label>
              <FormControl>
                <Textarea
                  placeholder={t("shopDescPlaceholder")}
                  className="resize-none min-h-[100px] rounded-xl bg-background border-border/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Upload de imagem */}
        <div className="space-y-2">
          <Label>{t("coverImageUrl")}</Label>
          {previewUrl ? (
            <div className="relative rounded-xl overflow-hidden aspect-video">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-full"
                onClick={() => {
                  setPreviewUrl(null);
                  form.setValue("imageUrl", "");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-border/50 bg-background cursor-pointer hover:bg-secondary/30 transition-colors">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {t("uploadImage")}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl mt-4 font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          disabled={createShop.isPending || uploading}
        >
          {createShop.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
              {t("addingShop")}
            </>
          ) : (
            <>
              <Store className="mr-2 h-5 w-5" /> {t("addCoffeeShop")}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
