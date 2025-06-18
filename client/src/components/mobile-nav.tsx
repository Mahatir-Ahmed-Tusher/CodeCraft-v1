import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, Code, Home, MessageSquare, FolderOpen, Settings, BookOpen, Info } from "lucide-react";
import { Link, useLocation } from "wouter";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/generator", label: t('hero.getStarted'), icon: <Code className="w-4 h-4" /> },
    { href: "/chat", label: t('hero.chat'), icon: <MessageSquare className="w-4 h-4" /> },
    { href: "/projects", label: t('nav.projects'), icon: <FolderOpen className="w-4 h-4" /> },
    { href: "/blog", label: t('nav.blog'), icon: <BookOpen className="w-4 h-4" /> },
    { href: "/about", label: t('nav.about'), icon: <Info className="w-4 h-4" /> },
    { href: "/settings", label: t('nav.settings'), icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex items-center space-x-2 px-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">CodeCraft</span>
          </div>
          
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <Button 
                variant={location === item.href ? "default" : "ghost"} 
                className="w-full justify-start gap-3"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}