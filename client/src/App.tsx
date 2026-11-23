import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/hooks/use-language";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const Landing = lazy(() => import("@/pages/Landing"));
const Home = lazy(() => import("@/pages/Home"));
const CoffeeShopsDirectory = lazy(() => import("@/pages/CoffeeShopsDirectory"));
const CoffeeShopDetails = lazy(() => import("@/pages/CoffeeShopDetails"));
const Profile = lazy(() => import("@/pages/Profile"));
const Login = lazy(() => import("@/pages/Login"));
const PostDetails = lazy(() => import("@/pages/PostDetails"));
const NotFound = lazy(() => import("@/pages/not-found"));

function RouteLoader() {
  return (
    <div className="h-[60vh] w-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary motion-safe:animate-spin" />
    </div>
  );
}

// Layout wrapper for authenticated/app views
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Suspense fallback={<RouteLoader />}>
    <Switch>
      {/* Root Route - Switch between Landing and Feed based on Auth */}
      <Route path="/">
        {isAuthenticated ? (
          <AppLayout>
            <Home />
          </AppLayout>
        ) : (
          <Landing />
        )}
      </Route>
      <Route path="/shops">
        <AppLayout>
          <CoffeeShopsDirectory />
        </AppLayout>
      </Route>

      <Route path="/shops/:id">
        <AppLayout>
          <CoffeeShopDetails />
        </AppLayout>
      </Route>

      <Route path="/posts/:id">
        <AppLayout>
          <PostDetails />
        </AppLayout>
      </Route>

      <Route path="/profile">
        <AppLayout>
          <Profile />
        </AppLayout>
      </Route>

      <Route path="/login">
        <Login />
      </Route>

      {/* Fallback to 404 */}
      <Route>
        <AppLayout>
          <NotFound />
        </AppLayout>
      </Route>
    </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
