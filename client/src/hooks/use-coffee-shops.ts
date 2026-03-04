import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertCoffeeShop, type CoffeeShopResponse } from "@shared/routes";

export function useCoffeeShops() {
  return useQuery({
    queryKey: [api.coffeeShops.list.path],
    queryFn: async () => {
      const res = await fetch(api.coffeeShops.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch coffee shops");
      return api.coffeeShops.list.responses[200].parse(await res.json());
    },
  });
}

export function useCoffeeShop(id: number) {
  return useQuery({
    queryKey: [api.coffeeShops.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.coffeeShops.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch coffee shop");
      return api.coffeeShops.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateCoffeeShop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertCoffeeShop) => {
      const validated = api.coffeeShops.create.input.parse(data);
      const res = await fetch(api.coffeeShops.create.path, {
        method: api.coffeeShops.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create coffee shop");
      return api.coffeeShops.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.coffeeShops.list.path] });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.coffeeShops.toggleFavorite.path, { id });
      const res = await fetch(url, {
        method: api.coffeeShops.toggleFavorite.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to toggle favorite");
      return api.coffeeShops.toggleFavorite.responses[200].parse(await res.json());
    },
    onMutate: async (id) => {
      // Optimistic update for lists
      await queryClient.cancelQueries({ queryKey: [api.coffeeShops.list.path] });
      await queryClient.cancelQueries({ queryKey: [api.coffeeShops.get.path, id] });

      const previousShops = queryClient.getQueryData<CoffeeShopResponse[]>([api.coffeeShops.list.path]);
      
      if (previousShops) {
        queryClient.setQueryData<CoffeeShopResponse[]>([api.coffeeShops.list.path], 
          previousShops.map(shop => {
            if (shop.id === id) {
              const wasFav = shop.isFavorite;
              return { 
                ...shop, 
                isFavorite: !wasFav,
                favoritesCount: (shop.favoritesCount || 0) + (wasFav ? -1 : 1)
              };
            }
            return shop;
          })
        );
      }

      return { previousShops };
    },
    onError: (err, id, context) => {
      if (context?.previousShops) {
        queryClient.setQueryData([api.coffeeShops.list.path], context.previousShops);
      }
    },
    onSettled: (data, error, id) => {
      queryClient.invalidateQueries({ queryKey: [api.coffeeShops.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.coffeeShops.get.path, id] });
    }
  });
}
