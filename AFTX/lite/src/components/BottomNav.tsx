import { NavLink } from "@/components/NavLink";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Maison" },
    { to: "/discover", icon: Search, label: "Découvrir" },
    { to: "/create", icon: Plus, label: "Créer", special: true },
    { to: "/messages", icon: MessageCircle, label: "Boîte de réception" },
    { to: "/profile", icon: User, label: "Moi" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                item.special && "relative"
              )}
              activeClassName="text-foreground"
            >
              {({ isActive }) => (
                <>
                  {item.special ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cedlite-cyan to-cedlite-pink rounded-lg blur-sm opacity-75" />
                      <div className="relative bg-gradient-to-r from-cedlite-cyan to-cedlite-pink p-2 rounded-lg">
                        <Icon className="h-6 w-6 text-background" />
                      </div>
                    </div>
                  ) : (
                    <Icon className={cn("h-6 w-6", isActive ? "text-foreground" : "text-muted-foreground")} />
                  )}
                  <span className={cn("text-[10px]", isActive ? "text-foreground font-semibold" : "text-muted-foreground")}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
