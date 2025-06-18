import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Code, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-muted/20 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">CodeCraft</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <div className="space-y-2 text-sm">
              <Link href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.features')}
              </Link>
              <Link href="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.blog')}
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.about')}
              </Link>
              <Link href="/settings" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.settings')}
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.documentation')}
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.community')}
              </a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                {t('footer.contact')}
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CodeCraft by Mahatir Ahmed Tusher. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}