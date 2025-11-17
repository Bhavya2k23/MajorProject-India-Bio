import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Target, Users, BookOpen, Award, Heart } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Educational Resource",
      description: "Comprehensive information about India's biodiversity for students and researchers",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Conservation Awareness",
      description: "Highlighting conservation status and threats to species",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Interactive Learning",
      description: "Engaging tools like maps, quizzes, and species directories",
    },
  ];

  const team = [
    {
      role: "Project Coordinator",
      name: "Environmental Science Department",
    },
    {
      role: "Development",
      name: "Computer Science Team",
    },
    {
      role: "Content Research",
      name: "Biology & Ecology Faculty",
    },
  ];

  const objectives = [
    "Promote awareness about India's rich biodiversity",
    "Educate about conservation status and threats",
    "Provide interactive tools for biodiversity exploration",
    "Support environmental education initiatives",
    "Document species distribution across biogeographical zones",
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">About Our Project</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold max-w-3xl mx-auto leading-tight">
            India Biodiversity Explorer
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            An educational platform dedicated to exploring and understanding India's
            incredible biological diversity
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="p-8 mb-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex p-4 bg-primary rounded-full mb-4">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To create an accessible, comprehensive digital platform that educates and
              inspires people about India's biodiversity. We aim to foster environmental
              consciousness and promote conservation efforts through interactive learning
              and data visualization.
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 text-center hover-lift transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Objectives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent rounded-xl">
                <Target className="h-6 w-6 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Project Objectives</h2>
            </div>
            <ul className="space-y-3">
              {objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1 flex-shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="text-muted-foreground">{objective}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary rounded-xl">
                <Award className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Project Team</h2>
            </div>
            <div className="space-y-4">
              {team.map((member, index) => (
                <div key={index} className="p-4 bg-secondary/50 rounded-lg">
                  <div className="font-semibold">{member.role}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.name}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">
            Technology Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              React
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              TypeScript
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Tailwind CSS
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Vite
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Leaflet.js
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Chart.js
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Shadcn/ui
            </Badge>
          </div>
        </Card>

        {/* Data Sources */}
        <Card className="p-8 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-center">Data Sources & References</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Wildlife Institute of India (WII)</li>
              <li>• Ministry of Environment, Forest and Climate Change</li>
              <li>• IUCN Red List of Threatened Species</li>
              <li>• Zoological Survey of India (ZSI)</li>
              <li>• Botanical Survey of India (BSI)</li>
              <li>• National Biodiversity Authority</li>
            </ul>
            <p className="text-xs text-center text-muted-foreground pt-4">
              * This is an educational project. Species data is representative and simplified for learning purposes.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
