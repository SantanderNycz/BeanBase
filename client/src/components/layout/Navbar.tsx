import { Link, useLocation } from "wouter";
import {
  Coffee,
  User as UserIcon,
  LogOut,
  Search,
  Languages,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Bell } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationsRead,
} from "@/hooks/use-notifications";

export function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const isActive = (path: string) => location === path;
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationsRead();
  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;

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
          <div className="flex items-center gap-3">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                  <Search className="w-5 h-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <DropdownMenu
                        onOpenChange={(open) => {
                          if (open && unreadCount > 0) markRead.mutate();
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="relative rounded-full"
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
                          <DropdownMenuLabel>
                            {t("notifications")}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {notifications?.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                              {t("noNotifications")}
                            </div>
                          ) : (
                            notifications?.slice(0, 10).map((n: any) => (
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
