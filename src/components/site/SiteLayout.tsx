import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, ShieldCheck, LogOut, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";

import logo from "@/assets/geopetcare-logo.jpg.asset.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { displayName, useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const navGroups: { label: string; items: { label: string; to: string }[] }[] = [
  { label: "Home", items: [{ label: "Home", to: "/home" }] },
  {
    label: "About",
    items: [
      { label: "Our Vision", to: "/about" },
      { label: "Our Mission", to: "/about" },
      { label: "Our Promise", to: "/about" },
      { label: "Our Roadmap", to: "/roadmap" },
      { label: "Transparency", to: "/transparency" },
    ],
  },
  {
    label: "Programmes",
    items: [
      { label: "Rescue", to: "/programmes" },
      { label: "Emergency Medical Care", to: "/programmes" },
      { label: "Community Feeding", to: "/programmes" },
      { label: "Sterilization Programme", to: "/programmes" },
      { label: "Animal Ambulance", to: "/programmes" },
      { label: "GeoPet ID™", to: "/geopet-id" },
      { label: "Paws of India™", to: "/paws-of-india" },
    ],
  },
  {
    label: "Adopt",
    items: [
      { label: "Adopt. Don't Shop.", to: "/adopt" },
      { label: "Foster Programme", to: "/foster" },
    ],
  },
  {
    label: "Get Involved",
    items: [
      { label: "Volunteer With Us", to: "/volunteer" },
      { label: "Corporate CSR", to: "/csr" },
      { label: "Schools & Colleges", to: "/schools" },
      { label: "Sponsor A Life", to: "/donate" },
      { label: "Contact / Enquiry", to: "/contact" },
    ],
  },
];

const flatNav = [
  { label: "Home", to: "/home" },
  { label: "About", to: "/about" },
  { label: "Programmes", to: "/programmes" },
  { label: "GeoPet ID™", to: "/geopet-id" },
  { label: "Adopt", to: "/adopt" },
  { label: "Foster", to: "/foster" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Corporate CSR", to: "/csr" },
  { label: "Schools & Colleges", to: "/schools" },
  { label: "Paws of India™", to: "/paws-of-india" },
  { label: "Sponsor A Life", to: "/donate" },
  { label: "Roadmap", to: "/roadmap" },
  { label: "Transparency", to: "/transparency" },
  { label: "Contact", to: "/contact" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const name = displayName(profile, user);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/home" className="flex items-center gap-2.5">
            <img src={logo.url} alt="GeoPetCare Foundation" className="h-11 w-11 rounded-md object-cover" />
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold text-primary">
                GeoPetCare Foundation
              </span>
              <span className="block text-[11px] tracking-wide text-muted-foreground">
                Every Life Matters. Every Paw Deserves Love.
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-0.5 xl:flex">
            {flatNav.slice(0, 8).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "rounded-md px-2.5 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary",
                  pathname === item.to && "bg-secondary text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 xl:ml-2">
            <Button asChild className="hidden accent-surface sm:inline-flex">
              <Link to="/donate">Sponsor A Life</Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border border-border">
                    {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} alt={name} /> : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <UserRound className="mr-2 h-4 w-4" /> My profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Admin dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <div className="mt-8 grid gap-1">
                  {flatNav.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 bg-primary-deep text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={logo.url} alt="GeoPetCare Foundation" className="h-12 w-12 rounded-md object-cover" />
              <div>
                <p className="font-display text-lg font-semibold">GeoPetCare Foundation</p>
                <p className="text-xs opacity-80">www.GeoPetCare.org</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm opacity-85">
              One World. One Family. Every Pet Counts. GeoPetCare Foundation works for the rescue,
              treatment, feeding, sterilization and rehoming of animals in need.
            </p>
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider opacity-90">Explore</p>
            <div className="mt-4 grid gap-2 text-sm opacity-85">
              {flatNav.slice(0, 7).map((item) => (
                <Link key={item.label} to={item.to} className="hover:opacity-100 hover:underline">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-wider opacity-90">
              Get involved
            </p>
            <div className="mt-4 grid gap-2 text-sm opacity-85">
              {flatNav.slice(7).map((item) => (
                <Link key={item.label} to={item.to} className="hover:opacity-100 hover:underline">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 px-4 py-5 text-center text-xs opacity-75">
          © {new Date().getFullYear()} GeoPetCare Foundation. Every Life Matters. Every Paw Deserves Love.
        </div>
      </footer>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="hero-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm opacity-90 md:text-base">{description}</p>
        ) : null}
      </div>
    </section>
  );
}

export function Section({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-12 md:py-16", className)}>
      {title ? <h2 className="text-2xl font-semibold text-primary md:text-3xl">{title}</h2> : null}
      {description ? <p className="mt-3 max-w-3xl text-muted-foreground">{description}</p> : null}
      {children ? <div className={cn(title && "mt-8")}>{children}</div> : null}
    </section>
  );
}
