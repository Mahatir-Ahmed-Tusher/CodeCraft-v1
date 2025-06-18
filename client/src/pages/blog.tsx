import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Clock, ArrowRight, Code, Brain, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const { t } = useLanguage();

  const blogPosts = [
    {
      id: 1,
      title: "Building Your First Web App with Natural Language",
      excerpt: "Learn how to create stunning web applications using CodeCraft's intuitive natural language interface. No coding experience required!",
      date: "2024-06-18",
      readTime: "5 min read",
      category: "Tutorial",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Web Development", "No-Code", "AI"]
    },
    {
      id: 2,
      title: "Data Science Made Simple with DataGenie",
      excerpt: "Discover how DataGenie transforms complex data science workflows into simple conversations. From dataset generation to ML model training.",
      date: "2024-06-15",
      readTime: "7 min read",
      category: "Data Science",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Data Science", "Machine Learning", "AI"]
    },
    {
      id: 3,
      title: "The Future of No-Code Development",
      excerpt: "Explore how AI-powered platforms like CodeCraft are democratizing software development and making coding accessible to everyone.",
      date: "2024-06-12",
      readTime: "6 min read",
      category: "Industry",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["No-Code", "Future Tech", "Innovation"]
    },
    {
      id: 4,
      title: "Best Practices for Prompt Engineering",
      excerpt: "Master the art of writing effective prompts to get the best results from CodeCraft's AI-powered code generation.",
      date: "2024-06-10",
      readTime: "8 min read",
      category: "Tips & Tricks",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Prompt Engineering", "AI", "Best Practices"]
    },
    {
      id: 5,
      title: "From Idea to Deployment: A Complete Guide",
      excerpt: "Follow a step-by-step guide from conceptualizing your web app idea to deploying it live using CodeCraft's integrated workflow.",
      date: "2024-06-08",
      readTime: "10 min read",
      category: "Guide",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["Deployment", "Web Development", "Guide"]
    },
    {
      id: 6,
      title: "Understanding WebContainer Technology",
      excerpt: "Deep dive into the technology that powers CodeCraft's live preview feature and how it runs your code in the browser.",
      date: "2024-06-05",
      readTime: "9 min read",
      category: "Technical",
      image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      tags: ["WebContainer", "Technology", "Browser"]
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tutorial':
        return <Code className="w-4 h-4" />;
      case 'Data Science':
        return <Brain className="w-4 h-4" />;
      case 'Technical':
        return <Zap className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Tutorial':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'Data Science':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'Industry':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Tips & Tricks':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'Guide':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300';
      case 'Technical':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${getCategoryColor(post.category)} flex items-center gap-1`}>
                    {getCategoryIcon(post.category)}
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button className="w-full group">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
}