
"use client";

import type { NextPage } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Package, Palette, Code, Search } from 'lucide-react'; // Added more icons

const pricingCategories = [
  {
    name: 'Web Development Projects',
    icon: <Code className="h-10 w-10 text-primary" />,
    description: 'Custom websites, e-commerce solutions, and web applications tailored to your needs.',
    projects: [
      { name: 'Landing Page Development', price: 'Starts at $500', features: ['Responsive Design', 'Basic SEO', 'Contact Form'] },
      { name: 'Small Business Website (5-10 Pages)', price: 'Starts at $1200', features: ['CMS Integration', 'Blog Setup', 'Social Media Links'] },
      { name: 'E-commerce Store Setup', price: 'Starts at $2500', features: ['Product Listings', 'Payment Gateway', 'Inventory Management'] },
      { name: 'Custom Web Application Feature', price: 'Contact for Quote', features: ['Specific Functionality', 'Database Integration', 'API Development'] },
    ],
    ctaText: 'Discuss Your Web Project',
    ctaLink: '/contact',
  },
  {
    name: 'Design & Branding Projects',
    icon: <Palette className="h-10 w-10 text-primary" />,
    description: 'Logos, brand identity, UI/UX design, and marketing materials that make an impact.',
    projects: [
      { name: 'Logo Design', price: 'Starts at $300', features: ['Multiple Concepts', 'Vector Files', 'Brand Style Guide'] },
      { name: 'UI/UX Design (Per Screen/Flow)', price: 'Starts at $150/screen', features: ['Wireframes', 'Prototypes', 'User Testing Insights'] },
      { name: 'Social Media Graphics Pack', price: 'Starts at $250', features: ['Platform-Specific Sizes', 'Editable Templates', 'Brand Consistency'] },
      { name: 'Full Brand Identity Package', price: 'Starts at $1500', features: ['Logo', 'Color Palette', 'Typography', 'Brand Book'] },
    ],
    ctaText: 'Get a Design Quote',
    ctaLink: '/contact',
  },
  {
    name: 'Consulting & Strategy',
    icon: <Search className="h-10 w-10 text-primary" />,
    description: 'Expert advice on digital strategy, project planning, and technical consultations.',
    projects: [
      { name: 'Digital Strategy Session (1hr)', price: '$150', features: ['Goal Setting', 'Market Analysis', 'Actionable Insights'] },
      { name: 'Project Feasibility Study', price: 'Starts at $800', features: ['Technical Assessment', 'Risk Analysis', 'Roadmap'] },
      { name: 'Custom Consultation Package', price: 'Contact for Details', features: ['Ongoing Support', 'Tailored Advice', 'Workshops'] },
    ],
    ctaText: 'Book a Consultation',
    ctaLink: '/contact',
  },
];

const PricingPage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-xl px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Project-Based <span className="text-primary">Pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our flexible pricing options for various project types. We offer transparent, per-project rates to fit your specific requirements.
          </p>
        </div>

        <div className="space-y-12">
          {pricingCategories.map((category, categoryIndex) => (
            <section key={category.name} className={`animate-fade-in-delay-${categoryIndex % 3}`}>
              <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-full bg-primary/10 mb-2">
                    {category.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{category.name}</h2>
                <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {category.projects.map((project, projectIndex) => (
                  <Card
                    key={project.name}
                    className={`flex flex-col hover:shadow-xl transition-shadow duration-300 border-border animate-fade-in-delay-${(categoryIndex * 3 + projectIndex) % 3}`}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-foreground">{project.name}</CardTitle>
                      <div className="mt-2">
                        <span className="text-3xl font-extrabold text-foreground">{project.price}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-2">
                        {project.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto pt-6">
                      <Button asChild className="w-full" variant="outline">
                        <Link href={category.ctaLink || '/contact'}>{category.ctaText || 'Get Started'}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in">
          <p className="text-muted-foreground mb-2 text-lg">
            Don&apos;t see exactly what you need?
          </p>
          <Button variant="default" size="lg" asChild className="aura-pulse">
            <Link href="/contact">
              Request a Custom Quote
            </Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;re happy to discuss custom project scopes and pricing.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;

    