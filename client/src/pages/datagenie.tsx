import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Brain, BarChart3, Download, MessageSquare, Zap } from "lucide-react";

export default function DataGenie() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to CodeCraft
            </Button>
          </Link>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200">
            Coming Soon
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DataGenie
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            Your End-to-End AI-Powered Data Science Assistant
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-4xl mx-auto">
            An intelligent, interactive, and extensible data science assistant built with Streamlit and powered by AI. 
            Streamline your entire data science lifecycle—from data generation to machine learning and NLP.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Natural Language to Dataset</CardTitle>
              <CardDescription>
                Generate realistic synthetic datasets with simple prompts like "Generate 1000 healthcare records"
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-2">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Smart Preprocessing</CardTitle>
              <CardDescription>
                Automatically detect outliers, encode features, and clean data with AI-powered insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Visual EDA</CardTitle>
              <CardDescription>
                Create charts, heatmaps, scatter plots and data summaries in one click
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-2">
                <Brain className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>ML Training Suite</CardTitle>
              <CardDescription>
                Train models for classification, regression, clustering, and time series with detailed metrics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-2">
                <MessageSquare className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Chat with Data</CardTitle>
              <CardDescription>
                Ask questions like "What's the average revenue by region?" and get instant insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-2">
                <Download className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Export Everything</CardTitle>
              <CardDescription>
                Download processed datasets, trained models (.pkl), and visualizations (.png) easily
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">Powered by Leading Technologies</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Streamlit', 'Groq API', 'pandas', 'scikit-learn', 'seaborn', 'plotly', 'spaCy', 'Python'].map((tech) => (
              <Badge key={tech} variant="outline" className="px-4 py-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data Science Workflow?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            DataGenie is currently in development. Join our waitlist to be the first to experience 
            the future of AI-powered data science.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Join Waitlist
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to CodeCraft
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Inspired by Predicta by Ahammad Nafiz, extending its vision with AI-powered interaction
          </p>
        </div>
      </div>
    </div>
  );
}