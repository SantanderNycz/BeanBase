import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Coffee } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isRegister ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({
          title: "Erro",
          description: err.message,
          variant: "destructive" as const,
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      navigate("/");
    } catch {
      toast({
        title: "Erro",
        description: "Algo correu mal",
        variant: "destructive" as const,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Navbar />
      <div className="w-full max-w-md bg-card rounded-3xl border border-border/50 shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Coffee className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold">BeanBase</h1>
          <p className="text-muted-foreground mt-1">
            {isRegister ? "Cria a tua conta" : "Bem-vindo de volta"}
          </p>
        </div>

        {/* Google */}
        <a href="/api/auth/google">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl mb-6 flex items-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
            Continuar com Google
          </Button>
        </a>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Email/Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nome</Label>
                <Input
                  className="h-11 rounded-xl mt-1"
                  placeholder="João"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Apelido</Label>
                <Input
                  className="h-11 rounded-xl mt-1"
                  placeholder="Silva"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              className="h-11 rounded-xl mt-1"
              placeholder="joao@email.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              className="h-11 rounded-xl mt-1"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-xl"
            disabled={loading}
          >
            {loading ? "A processar..." : isRegister ? "Criar conta" : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isRegister ? "Já tens conta?" : "Ainda não tens conta?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary font-medium hover:underline"
          >
            {isRegister ? "Entrar" : "Registar"}
          </button>
        </p>
      </div>
    </div>
  );
}
