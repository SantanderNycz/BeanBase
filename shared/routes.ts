import { z } from 'zod';
import { insertCoffeeShopSchema, insertPostSchema, insertCommentSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  coffeeShops: {
    list: {
      method: 'GET' as const,
      path: '/api/coffee-shops' as const,
      responses: {
        200: z.array(z.custom<any>()), // CoffeeShopResponse
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/coffee-shops/:id' as const,
      responses: {
        200: z.custom<any>(), // CoffeeShopResponse
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/coffee-shops' as const,
      input: insertCoffeeShopSchema,
      responses: {
        201: z.custom<any>(), // CoffeeShopResponse
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    toggleFavorite: {
      method: 'POST' as const,
      path: '/api/coffee-shops/:id/favorite' as const,
      responses: {
        200: z.object({ isFavorite: z.boolean() }),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    }
  },
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts' as const,
      input: z.object({
        coffeeShopId: z.string().optional(),
        userId: z.string().optional(),
        favoritesOnly: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<any>()), // PostResponse
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts' as const,
      input: insertPostSchema,
      responses: {
        201: z.custom<any>(), // PostResponse
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    toggleLike: {
      method: 'POST' as const,
      path: '/api/posts/:id/like' as const,
      responses: {
        200: z.object({ isLiked: z.boolean() }),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    }
  },
  comments: {
    list: {
      method: 'GET' as const,
      path: '/api/posts/:postId/comments' as const,
      responses: {
        200: z.array(z.custom<any>()), // CommentResponse
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts/:postId/comments' as const,
      input: insertCommentSchema.omit({ postId: true }),
      responses: {
        201: z.custom<any>(), // CommentResponse
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
