import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.projects': 'My Projects',
    'nav.settings': 'Settings',
    
    // Hero Section
    'hero.title': 'Build Web Apps & Analyze Data with Natural Language',
    'hero.subtitle': 'Transform your ideas into functional web applications and perform advanced data science - all through simple conversation. No coding experience required.',
    'hero.getStarted': 'Get Started Free',
    'hero.chat': 'Chat with CodeCraft',
    'hero.tryDataGenie': 'Try DataGenie',
    
    // DataGenie Section
    'datagenie.title': 'Introducing DataGenie',
    'datagenie.subtitle': 'Your End-to-End AI-Powered Data Science Assistant',
    'datagenie.description': 'From natural language dataset generation to machine learning and NLP - DataGenie streamlines your entire data science lifecycle with AI-powered automation, smart preprocessing, visual EDA, and chat-based data insights.',
    'datagenie.feature1': 'Natural Language to Dataset',
    'datagenie.feature2': 'ML Training Suite',
    'datagenie.feature3': 'Chat with Your Data',
    
    // Features
    'features.title': 'Why Choose CodeCraft?',
    'features.subtitle': 'The perfect platform for building web applications and performing data science',
    'features.nlp.title': 'Natural Language to Code',
    'features.nlp.desc': 'Describe your app idea in plain English and watch it come to life instantly.',
    'features.preview.title': 'Live Preview',
    'features.preview.desc': 'See your application running in real-time as you make changes.',
    'features.editor.title': 'Code Editor',
    'features.editor.desc': 'Professional Monaco editor with syntax highlighting and IntelliSense.',
    
    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.english': 'English',
    'settings.bengali': 'বাংলা',
    
    // Footer
    'footer.description': 'Build web applications and perform data science with natural language. No coding required.',
    'footer.quickLinks': 'Quick Links',
    'footer.features': 'Features',
    'footer.blog': 'Blog',
    'footer.about': 'About',
    'footer.settings': 'Settings',
    'footer.support': 'Support',
    'footer.documentation': 'Documentation',
    'footer.community': 'Community',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
    
    // Blog
    'blog.title': 'CodeCraft Blog',
    'blog.subtitle': 'Latest insights on web development and data science',
    
    // About
    'about.title': 'About CodeCraft',
    'about.subtitle': 'Democratizing software creation through AI-powered development',
  },
  bn: {
    // Navigation
    'nav.features': 'বৈশিষ্ট্য',
    'nav.blog': 'ব্লগ',
    'nav.about': 'সম্পর্কে',
    'nav.projects': 'আমার প্রকল্প',
    'nav.settings': 'সেটিংস',
    
    // Hero Section
    'hero.title': 'প্রাকৃতিক ভাষায় ওয়েব অ্যাপ তৈরি করুন ও ডেটা বিশ্লেষণ করুন',
    'hero.subtitle': 'সহজ কথোপকথনের মাধ্যমে আপনার ধারণাগুলিকে কার্যকর ওয়েব অ্যাপ্লিকেশন এবং উন্নত ডেটা সায়েন্সে রূপান্তরিত করুন। কোন কোডিং অভিজ্ঞতার প্রয়োজন নেই।',
    'hero.getStarted': 'বিনামূল্যে শুরু করুন',
    'hero.chat': 'CodeCraft এর সাথে কথা বলুন',
    'hero.tryDataGenie': 'DataGenie চেষ্টা করুন',
    
    // DataGenie Section
    'datagenie.title': 'DataGenie এর পরিচয়',
    'datagenie.subtitle': 'আপনার সম্পূর্ণ AI-চালিত ডেটা সায়েন্স সহায়ক',
    'datagenie.description': 'প্রাকৃতিক ভাষার ডেটাসেট জেনারেশন থেকে মেশিন লার্নিং এবং NLP পর্যন্ত - DataGenie AI-চালিত অটোমেশন, স্মার্ট প্রিপ্রসেসিং, ভিজ্যুয়াল EDA এবং চ্যাট-ভিত্তিক ডেটা অন্তর্দৃষ্টি দিয়ে আপনার সম্পূর্ণ ডেটা সায়েন্স জীবনচক্রকে সহজ করে।',
    'datagenie.feature1': 'প্রাকৃতিক ভাষা থেকে ডেটাসেট',
    'datagenie.feature2': 'ML প্রশিক্ষণ স্যুট',
    'datagenie.feature3': 'আপনার ডেটার সাথে কথা বলুন',
    
    // Features
    'features.title': 'কেন CodeCraft বেছে নেবেন?',
    'features.subtitle': 'ওয়েব অ্যাপ্লিকেশন তৈরি এবং ডেটা সায়েন্স করার জন্য নিখুঁত প্ল্যাটফর্ম',
    'features.nlp.title': 'প্রাকৃতিক ভাষা থেকে কোড',
    'features.nlp.desc': 'সহজ বাংলায় আপনার অ্যাপের ধারণা বর্ণনা করুন এবং তা তাৎক্ষণিক জীবন্ত হতে দেখুন।',
    'features.preview.title': 'লাইভ প্রিভিউ',
    'features.preview.desc': 'পরিবর্তন করার সাথে সাথে আপনার অ্যাপ্লিকেশন রিয়েল-টাইমে চলতে দেখুন।',
    'features.editor.title': 'কোড এডিটর',
    'features.editor.desc': 'সিনট্যাক্স হাইলাইটিং এবং IntelliSense সহ পেশাদার Monaco এডিটর।',
    
    // Settings
    'settings.title': 'সেটিংস',
    'settings.theme': 'থিম',
    'settings.language': 'ভাষা',
    'settings.light': 'হালকা',
    'settings.dark': 'অন্ধকার',
    'settings.english': 'English',
    'settings.bengali': 'বাংলা',
    
    // Footer
    'footer.description': 'প্রাকৃতিক ভাষায় ওয়েব অ্যাপ্লিকেশন তৈরি করুন এবং ডেটা সায়েন্স করুন। কোডিং প্রয়োজন নেই।',
    'footer.quickLinks': 'দ্রুত লিংক',
    'footer.features': 'বৈশিষ্ট্য',
    'footer.blog': 'ব্লগ',
    'footer.about': 'সম্পর্কে',
    'footer.settings': 'সেটিংস',
    'footer.support': 'সহায়তা',
    'footer.documentation': 'ডকুমেন্টেশন',
    'footer.community': 'কমিউনিটি',
    'footer.contact': 'যোগাযোগ',
    'footer.rights': 'সমস্ত অধিকার সংরক্ষিত।',
    
    // Blog
    'blog.title': 'CodeCraft ব্লগ',
    'blog.subtitle': 'ওয়েব ডেভেলপমেন্ট এবং ডেটা সায়েন্সের সর্বশেষ অন্তর্দৃষ্টি',
    
    // About
    'about.title': 'CodeCraft সম্পর্কে',
    'about.subtitle': 'AI-চালিত উন্নয়নের মাধ্যমে সফটওয়্যার তৈরির গণতন্ত্রীকরণ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('codecraft-language') as Language;
    if (savedLanguage && ['en', 'bn'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('codecraft-language', lang);
    
    // Update document font for Bengali
    if (lang === 'bn') {
      document.documentElement.style.fontFamily = "'Hind Siliguri', sans-serif";
    } else {
      document.documentElement.style.fontFamily = "";
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}