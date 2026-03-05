import { Link, useLocation } from "wouter";
import {
  Coffee,
  User as UserIcon,
  LogOut,
  Search,
  Languages,
  Moon,
  Sun,
  Bell,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  useNotifications,
  useMarkNotificationsRead,
} from "@/hooks/use-notifications";
import { usePosts } from "@/hooks/use-posts";
import { useCoffeeShops } from "@/hooks/use-coffee-shops";
import { useState, useRef, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: posts } = usePosts();
  const { data: shops } = useCoffeeShops();

  const isActive = (path: string) => location === path;

  const filteredPosts =
    searchQuery.length > 1
      ? posts?.filter(
          (p: any) =>
            p.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.coffeeShop?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()),
        ) || []
      : [];

  const filteredShops =
    searchQuery.length > 1
      ? shops?.filter(
          (s: any) =>
            s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.address?.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || []
      : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Coffee className="w-6 h-6 text-primary" />
            </div>
            <span className="font-serif font-bold text-xl text-foreground hidden sm:block">
              BeanBase
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`font-medium text-sm transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
            >
              {t("feed")}
            </Link>
            <Link
              href="/shops"
              className={`font-medium text-sm transition-colors hover:text-primary ${isActive("/shops") ? "text-primary" : "text-muted-foreground"}`}
            >
              {t("discoverShops")}
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            {isAuthenticated ? (
              <>
                {/* Search */}
                <div className="relative" ref={searchRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={() => setSearchOpen(!searchOpen)}
                  >
                    <Search className="w-5 h-5" />
                  </Button>

                  {searchOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden z-50">
                      <div className="flex items-center gap-2 p-3 border-b border-border/40">
                        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Input
                          autoFocus
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t("searchPlaceholder")}
                          className="border-0 shadow-none focus-visible:ring-0 h-8 p-0 bg-transparent"
                        />
                        {searchQuery && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => setSearchQuery("")}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>

                      {searchQuery.length > 1 && (
                        <div className="max-h-80 overflow-y-auto">
                          {filteredShops.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground px-3 py-2">
                                {t("coffeeShops")}
                              </p>
                              {filteredShops.slice(0, 3).map((shop: any) => (
                                <Link
                                  key={shop.id}
                                  href={`/shops/${shop.id}`}
                                  onClick={() => {
                                    setSearchOpen(false);
                                    setSearchQuery("");
                                  }}
                                >
                                  <div className="flex items-center gap-3 px-3 py-2 hover:bg-secondary/50 cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-secondary shrink-0">
                                      {shop.imageUrl && (
                                        <img
                                          src={shop.imageUrl}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">
                                        {shop.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {shop.address}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {filteredPosts.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground px-3 py-2">
                                {t("posts")}
                              </p>
                              {filteredPosts.slice(0, 3).map((post: any) => (
                                <Link
                                  key={post.id}
                                  href={`/posts/${post.id}`}
                                  onClick={() => {
                                    setSearchOpen(false);
                                    setSearchQuery("");
                                  }}
                                >
                                  <div className="flex items-center gap-3 px-3 py-2 hover:bg-secondary/50 cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                      <Coffee className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="text-sm truncate">
                                      {post.content}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}

                          {filteredShops.length === 0 &&
                            filteredPosts.length === 0 && (
                              <div className="py-8 text-center text-sm text-muted-foreground">
                                {t("noResults")}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <DropdownMenu
                  onOpenChange={(open) => {
                    if (open && unreadCount > 0) markRead.mutate();
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!notifications?.length ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {t("noNotifications")}
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n: any) => (
                        <DropdownMenuItem
                          key={n.id}
                          className={`flex flex-col items-start gap-1 p-3 ${!n.read ? "bg-primary/5" : ""}`}
                        >
                          <span className="text-sm">
                            {n.type === "like"
                              ? `❤️ ${t("notifLike")}`
                              : `💬 ${t("notifComment")}`}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Avatar + Profile Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 border-2 border-primary/20 transition-all hover:border-primary">
                        <AvatarImage
                          src={user?.profileImageUrl || undefined}
                          alt={user?.firstName || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {user?.firstName?.[0] || (
                            <UserIcon className="w-4 h-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Languages className="mr-2 h-4 w-4" />
                        <span>{t("language")}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() => setLanguage("pt-BR")}
                          >
                            Português (Brasil)
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setLanguage("pt-PT")}
                          >
                            Português (Portugal)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLanguage("en")}>
                            English
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLanguage("fr")}>
                            Français
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLanguage("es")}>
                            Español
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="cursor-pointer flex w-full items-center"
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>{t("profile")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                      onClick={() => logout()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Languages className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setLanguage("pt-BR")}>
                      Português (Brasil)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("pt-PT")}>
                      Português (Portugal)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("en")}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("fr")}>
                      Français
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("es")}>
                      Español
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/login">
                  <Button className="rounded-full px-6 font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                    {t("signIn")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
