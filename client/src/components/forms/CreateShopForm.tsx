import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Store } from "lucide-react";
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
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateShopForm({ onSuccess }: { onSuccess?: () => void }) {
  const createShop = useCreateCoffeeShop();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", address: "", description: "", imageUrl: "" },
  });

  const onSubmit = (data: FormValues) => {
    const payload = { ...data, imageUrl: data.imageUrl || undefined };
    createShop.mutate(payload, {
      onSuccess: () => {
        toast({ title: t("shopAdded") });
        form.reset();
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

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <Label>{t("coverImageUrl")}</Label>
              <FormControl>
                <Input
                  placeholder="https://..."
                  className="h-11 rounded-xl bg-background border-border/50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-12 rounded-xl mt-4 font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          disabled={createShop.isPending}
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
