import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Code, 
  Zap, 
  Eye, 
  Download, 
  MessageSquare, 
  Rocket, 
  CheckCircle, 
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Star,
  Users,
  Globe,
  Smartphone,
  Database,
  Layers
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Natural Language to Code",
      description: "Describe your app idea in plain English and watch it come to life instantly."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Live Preview",
      description: "See your application running in real-time as you make changes."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Modern Stack",
      description: "Generated apps use React, TypeScript, Tailwind CSS, and modern best practices."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export & Deploy",
      description: "Download your code as a ZIP file or deploy directly to the web."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "AI-powered generation creates complete applications in seconds."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Full-Stack Ready",
      description: "Generate both frontend React apps and backend Node.js APIs."
    }
  ];

  const useCases = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Landing Pages",
      description: "Create stunning marketing websites and portfolios",
      examples: ["Business websites", "Personal portfolios", "Product showcases"]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Web Applications",
      description: "Build interactive tools and productivity apps",
      examples: ["Todo managers", "Calculators", "Form builders"]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Dashboard & Analytics",
      description: "Generate data visualization and admin panels",
      examples: ["Analytics dashboards", "Admin interfaces", "Charts & graphs"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content: "CodeCraft helped me prototype ideas 10x faster. No more waiting for developers!",
      rating: 5
    },
    {
      name: "Alex Rodriguez",
      role: "Startup Founder",
      content: "Built our entire MVP in a weekend. The generated code is production-ready.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Designer",
      content: "Finally, I can bring my designs to life without learning to code.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold">CodeCraft</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <Link href="/projects">
              <Button variant="ghost">My Projects</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            AI-Powered • No-Code • Open Source
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Build Web Apps with 
            <br />
            Natural Language
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your ideas into fully functional web applications using simple conversation. 
            No coding experience required - just describe what you want to build.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/generator">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
            
            <Link href="/chat">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <MessageSquare className="w-5 h-5 mr-2" />
                Chat with CodeCraft
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-center">
            <div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">Apps Created</div>
            </div>
            <div>
              <div className="text-2xl font-bold">5K+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build Amazing Apps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to deployment in minutes, not months
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Can You Build?
            </h2>
            <p className="text-xl text-muted-foreground">
              From simple tools to complex applications
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                <p className="text-muted-foreground mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="flex items-center justify-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {example}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what people are saying about CodeCraft
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Your Next App?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators who are building faster with AI
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/generator">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Start Building Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/chat">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Try Chat Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">CodeCraft</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Building the future of no-code development with AI
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/generator">Code Generator</Link></li>
                <li><Link href="/chat">AI Chat</Link></li>
                <li><Link href="/projects">My Projects</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features">Features</a></li>
                <li><a href="#use-cases">Use Cases</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="p-2">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CodeCraft. All rights reserved. Built with AI and love.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}