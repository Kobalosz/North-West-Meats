import { Link } from "react-router-dom";
import { ShoppingCart, Shield, Sun, Moon, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import logo from "@/assets/logo.svg";

function Navbar() {
  const { getCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const cartCount = getCartCount();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b glass shadow-soft">
      <div className="container mx-auto flex h-14 items-center justify-between gap-2 px-4 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-smooth-fast hover:scale-105 sm:gap-3">
          <img src={logo} alt="North West Meats Logo" className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-sm" />
          <h1 className="hidden text-base font-bold text-gradient sm:block sm:text-xl">
            North West Meats
          </h1>
        </Link>

        {/* Navigation Menu and Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavigationMenu>
            <NavigationMenuList className="gap-1 sm:gap-2">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className="text-sm sm:text-base">Home</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/order">
                  <NavigationMenuLink className="relative text-sm sm:text-base">
                    <ShoppingCart className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Order</span>
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/contact">
                  <NavigationMenuLink className="text-sm sm:text-base">
                    <Mail className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Contact</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {isAuthenticated && (
                <NavigationMenuItem>
                  <Link to="/admin">
                    <NavigationMenuLink className="text-sm sm:text-base">
                      <Shield className="mr-1 h-4 w-4 sm:mr-2 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">Admin</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-1.5 rounded-lg border bg-muted/50 px-2 py-1 shadow-sm transition-smooth-fast hover:bg-muted/70 sm:gap-2 sm:px-3 sm:py-1.5">
            <Sun className="h-3.5 w-3.5 text-muted-foreground transition-smooth-fast sm:h-4 sm:w-4" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-3.5 w-3.5 text-muted-foreground transition-smooth-fast sm:h-4 sm:w-4" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
