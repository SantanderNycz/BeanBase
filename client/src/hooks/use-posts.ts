import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertPost, type PostResponse } from "@shared/routes";

interface PostsFilter {
  coffeeShopId?: string;
  userId?: string;
  favoritesOnly?: string;
}

export function usePosts(filters?: PostsFilter) {
  return useQuery({
    queryKey: [api.posts.list.path, filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters?.coffeeShopId) searchParams.set("coffeeShopId", filters.coffeeShopId);
      if (filters?.userId) searchParams.set("userId", filters.userId);
      if (filters?.favoritesOnly) searchParams.set("favoritesOnly", filters.favoritesOnly);
      
      const url = `${api.posts.list.path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      return api.posts.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPost) => {
      const validated = api.posts.create.input.parse(data);
      const res = await fetch(api.posts.create.path, {
        method: api.posts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create post");
      return api.posts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.posts.toggleLike.path, { id });
      const res = await fetch(url, {
        method: api.posts.toggleLike.method,
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      return api.posts.toggleLike.responses[200].parse(await res.json());
    },
    // Optimistic Update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [api.posts.list.path] });
      
      // We don't know exact filters, so we might need to invalidate all post lists
      // For simplicity, we'll just invalidate on settlement, but try to update specific known lists
      const queryKeys = queryClient.getQueryCache().findAll({ queryKey: [api.posts.list.path] });
      
      queryKeys.forEach(query => {
        const previous = queryClient.getQueryData<PostResponse[]>(query.queryKey);
        if (previous) {
          queryClient.setQueryData<PostResponse[]>(query.queryKey, 
            previous.map(post => {
              if (post.id === id) {
                const wasLiked = post.isLiked;
                return {
                  ...post,
                  isLiked: !wasLiked,
                  likesCount: (post.likesCount || 0) + (wasLiked ? -1 : 1)
                };
              }
              return post;
            })
          );
        }
      });

      return { queryKeys };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
    }
  });
}
