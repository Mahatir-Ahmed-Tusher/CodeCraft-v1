import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/contexts/LanguageContext";
import { Settings, Palette, Globe, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6" />
              <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('settings.theme')}
              </CardTitle>
              <CardDescription>
                Choose between light and dark modes for your interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="theme-toggle">{theme === 'dark' ? t('settings.dark') : t('settings.light')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Dark mode is enabled' : 'Light mode is enabled'}
                  </p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('settings.language')}
              </CardTitle>
              <CardDescription>
                Switch between English and Bengali languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="language-toggle">
                    {language === 'bn' ? t('settings.bengali') : t('settings.english')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'বাংলা ভাষা সক্রিয়' : 'English language is active'}
                  </p>
                </div>
                <Switch
                  id="language-toggle"
                  checked={language === 'bn'}
                  onCheckedChange={(checked) => setLanguage(checked ? 'bn' : 'en')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Notice */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {language === 'bn' 
                  ? 'আপনার সেটিংস স্বয়ংক্রিয়ভাবে সংরক্ষিত হয় এবং সমস্ত পৃষ্ঠায় প্রয়োগ হয়।'
                  : 'Your settings are automatically saved and applied across all pages.'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}