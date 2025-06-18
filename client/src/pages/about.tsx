import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Code, 
  Brain, 
  Zap, 
  Users, 
  Award, 
  BookOpen, 
  Github, 
  Linkedin, 
  Mail,
  ExternalLink,
  Target,
  Lightbulb,
  Rocket
} from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Prompt-Driven Code Generation",
      description: "Describe your app in simple terms and get complete project structures with files like src/App.tsx and package.json."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Interactive Code Editing",
      description: "View and edit generated code in Monaco Editor with real-time syntax highlighting and ESLint validation."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Live Previews",
      description: "See your app come to life instantly using WebContainer technology that runs projects in the browser."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Project Management",
      description: "Save, organize, and download your projects as zip files with metadata stored securely."
    }
  ];

  const achievements = [
    { label: "Research Citations", value: "69" },
    { label: "GitHub Repositories", value: "25+" },
    { label: "Published Papers", value: "5+" },
    { label: "Years Experience", value: "4+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t('about.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/generator">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Try CodeCraft
              </Button>
            </Link>
            <Link href="/datagenie">
              <Button variant="outline" size="lg">
                Explore DataGenie
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* About CodeCraft */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">What is CodeCraft?</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground mb-12">
              <p className="text-center text-lg leading-relaxed">
                CodeCraft is an innovative no-code platform designed to empower users to create web applications 
                effortlessly through natural language prompts. Whether you're a business owner with a vision for 
                a to-do list app or a developer prototyping a complex website, CodeCraft transforms your ideas 
                into functional code with ease.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-blue-600 dark:text-blue-400">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Technology Stack */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-center mb-6">Built with Cutting-Edge Technologies</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['React', 'TypeScript', 'Tailwind CSS', 'Groq API', 'llama-3.3-70b-versatile', 'WebContainer', 'Monaco Editor', 'Express', 'Node.js'].map((tech) => (
                  <Badge key={tech} variant="outline" className="px-4 py-2 text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Mahatir */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet the Visionary</h2>
              <p className="text-xl text-muted-foreground">
                Mahatir Ahmed Tusher - Lead Developer & Innovator
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Profile Card */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">MT</span>
                  </div>
                  <CardTitle className="text-2xl">Mahatir Ahmed Tusher</CardTitle>
                  <CardDescription className="text-lg">
                    Lead Developer & AI Researcher
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="sm">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button variant="outline" size="sm">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                  
                  {/* Achievements */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{achievement.value}</div>
                        <div className="text-sm text-muted-foreground">{achievement.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Biography */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Background & Expertise
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mahatir Ahmed Tusher is the visionary lead developer behind CodeCraft, bringing a wealth of 
                    expertise in machine learning, deep learning, and full-stack development. A student at VIT-AP 
                    University, he is a passionate innovator with a knack for solving complex problems through technology.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Research & Publications
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    His research, cited by 69 scholars, spans applications like water quality monitoring and 
                    handwriting style synthesis using deep learning. He has co-authored impactful publications, 
                    including "A Harmonic Approach to Handwriting Style Synthesis Using Deep Learning" (June 2024).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Technical Skills
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Proficient in machine learning, deep learning, and natural language processing, Mahatir leverages 
                    frameworks like TensorFlow and PyTorch to build intelligent systems. His full-stack development 
                    experience includes React, Node.js, and TypeScript.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Role in CodeCraft
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    As the lead developer, Mahatir architected CodeCraft's seamless integration of the Groq API 
                    for code generation, ensuring high-quality, production-ready output. He designed the platform's 
                    backend with Express and TypeScript, incorporating WebContainer for in-browser previews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Vision</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle>Mission</CardTitle>
                  <CardDescription className="text-base">
                    To democratize software creation by making app development accessible to everyone, 
                    regardless of their coding expertise. We believe ideas should never be limited by 
                    technical barriers.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Future</CardTitle>
                  <CardDescription className="text-base">
                    Mahatir envisions CodeCraft as a bridge between ideas and execution, empowering users 
                    worldwide to create without coding expertise. Plans include advanced AI features and 
                    broader framework support.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Join Us on This Journey</h3>
              <p className="text-lg text-muted-foreground mb-6">
                At CodeCraft, Mahatir Ahmed Tusher and our team are redefining how the world builds 
                software—one prompt at a time. Experience the future of development today.
              </p>
              <Link href="/generator">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Building Now
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}