import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Home, Folder, Settings, Moon, Sun, Code } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/projects", icon: Folder, label: "My Projects" },
  ];

  return (
    <div className="w-64 bg-card border-r flex flex-col">
      {/* Logo and Brand */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold">CodeCraft</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start space-x-3"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="w-full justify-start space-x-2"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
