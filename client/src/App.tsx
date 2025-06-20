import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient.ts";
import { Toaster } from "./components/ui/toaster.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { LanguageProvider } from "./contexts/LanguageContext.tsx";
import Landing from "./pages/landing.tsx";
import Home from "./pages/home.tsx";
import Chat from "./pages/chat.tsx";
import Projects from "./pages/projects.tsx";
import DataGenie from "./pages/datagenie.tsx";
import Settings from "./pages/settings.tsx";
import Blog from "./pages/blog.tsx";
import About from "./pages/about.tsx";
import NotFound from "./pages/not-found.tsx";
import idelandingpage from "./pages/idelandingpage.tsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/generator" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/projects" component={Projects} />
      <Route path="/datagenie" component={DataGenie} />
      <Route path="/settings" component={Settings} />
      <Route path="/blog" component={Blog} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
      <Route path="/ide-landing-page" component={idelandingpage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="codecraft-theme">
        <LanguageProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
