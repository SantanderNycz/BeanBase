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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Convert empty string to undefined for the API
    const payload = {
      ...data,
      imageUrl: data.imageUrl || undefined
    };

    createShop.mutate(payload, {
      onSuccess: () => {
        toast({ title: "Coffee Shop added!" });
        form.reset();
        onSuccess?.();
      }
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
              <Label>Shop Name</Label>
              <FormControl>
                <Input placeholder="e.g. The Daily Grind" className="h-11 rounded-xl bg-background border-border/50" {...field} />
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
              <Label>Location</Label>
              <FormControl>
                <Input placeholder="Full street address" className="h-11 rounded-xl bg-background border-border/50" {...field} />
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
              <Label>Description</Label>
              <FormControl>
                <Textarea 
                  placeholder="What makes this place special? Vibe, coffee beans, seating..." 
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
              <Label>Cover Image URL (Optional)</Label>
              <FormControl>
                <Input placeholder="https://..." className="h-11 rounded-xl bg-background border-border/50" {...field} />
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
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding Shop...</>
          ) : (
            <><Store className="mr-2 h-5 w-5" /> Add Coffee Shop</>
          )}
        </Button>
      </form>
    </Form>
  );
}
