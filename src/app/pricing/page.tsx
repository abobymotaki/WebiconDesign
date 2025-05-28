
"use client";

import type { NextPage } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Package, Palette, Code, Search, Users, HelpCircle, ListChecks } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, onSnapshot, query, orderBy, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to get a Lucide icon component by name
const getIcon = (iconName: string | undefined): React.ElementType => {
  switch (iconName?.toLowerCase()) {
    case 'code': return Code;
    case 'palette': return Palette;
    case 'search': return Search;
    case 'users': return Users;
    case 'helpcircle': return HelpCircle;
    case 'listchecks': return ListChecks;
    default: return Package; // Default icon
  }
};

interface PricingCategory {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  // For now, projects are static per category, this would be dynamic in a full implementation
  exampleProjects: Array<{ name: string; price: string; features: string[] }>;
}

const PricingPage: NextPage = () => {
  const [categories, setCategories] = useState<PricingCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Static example projects - these would eventually be linked to categories or managed by providers
  const staticProjectExamples = {
    default: [
        { name: 'Standard Service Package', price: 'Contact Us', features: ['Feature A', 'Feature B', 'Dedicated Support'] },
        { name: 'Premium Service Package', price: 'Contact Us', features: ['All Standard Features', 'Advanced Feature C', 'Priority Support'] },
    ],
    "Web Development": [
      { name: 'Landing Page Development', price: 'Starts at $500', features: ['Responsive Design', 'Basic SEO', 'Contact Form'] },
      { name: 'Small Business Website (5-10 Pages)', price: 'Starts at $1200', features: ['CMS Integration', 'Blog Setup', 'Social Media Links'] },
      { name: 'E-commerce Store Setup', price: 'Starts at $2500', features: ['Product Listings', 'Payment Gateway', 'Inventory Management'] },
    ],
    "Design & Branding": [
      { name: 'Logo Design', price: 'Starts at $300', features: ['Multiple Concepts', 'Vector Files', 'Brand Style Guide'] },
      { name: 'UI/UX Design (Per Screen/Flow)', price: 'Starts at $150/screen', features: ['Wireframes', 'Prototypes', 'User Testing Insights'] },
    ],
    "Consulting & Strategy": [
       { name: 'Digital Strategy Session (1hr)', price: '$150', features: ['Goal Setting', 'Market Analysis', 'Actionable Insights'] },
    ]
  };

  useEffect(() => {
    setIsLoading(true);
    const categoriesQuery = query(collection(db, 'pricingCategories'), orderBy('name'));
    
    const unsubscribe = onSnapshot(categoriesQuery, (querySnapshot) => {
      const fetchedCategories = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        // Determine which set of example projects to use
        const examplesKey = data.name && staticProjectExamples[data.name as keyof typeof staticProjectExamples] ? data.name : 'default';
        return {
          id: doc.id,
          name: data.name || 'Unnamed Category',
          description: data.description || 'No description available.',
          iconName: data.iconName,
          exampleProjects: staticProjectExamples[examplesKey as keyof typeof staticProjectExamples] || staticProjectExamples.default,
        } as PricingCategory;
      });
      setCategories(fetchedCategories);
      setIsLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching pricing categories:", err);
      setError("Failed to load pricing categories. Please try again later.");
      setIsLoading(false);
      setCategories([]); // Fallback to empty on error
    });

    return () => unsubscribe();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-xl px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Our Project-Based <span className="text-primary">Pricing</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our transparent, per-project pricing for various services offered by our team. We tailor solutions to fit your specific requirements.
          </p>
        </div>

        <div className="mb-8 md:mb-12 max-w-lg mx-auto animate-fade-in">
          <Input
            type="search"
            placeholder="Search our services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-base"
            aria-label="Search services"
          />
        </div>

        {isLoading && (
          <div className="space-y-12">
            {[1, 2].map(i => (
              <section key={`skeleton-${i}`}>
                <div className="text-center mb-8">
                  <Skeleton className="h-10 w-10 rounded-full bg-muted mx-auto mb-2" />
                  <Skeleton className="h-8 w-1/2 bg-muted mx-auto mb-2" />
                  <Skeleton className="h-5 w-3/4 bg-muted mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(j => <Skeleton key={`proj-skel-${j}`} className="h-72 rounded-lg bg-muted" />)}
                </div>
              </section>
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-10">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredCategories.length === 0 && (
           <div className="text-center py-10">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? `No services found for "${searchTerm}".` : "No service categories available at the moment."}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredCategories.length > 0 && (
          <div className="space-y-12">
            {filteredCategories.map((category, categoryIndex) => {
              const IconComponent = getIcon(category.iconName);
              return (
                <section key={category.id} className={`animate-fade-in-delay-${categoryIndex % 3}`}>
                  <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-primary/10 mb-2">
                        <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">{category.name}</h2>
                    <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{category.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {(category.exampleProjects || []).map((project, projectIndex) => (
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
                            <Link href={'/contact'}>Inquire About This Service</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center animate-fade-in">
          <p className="text-muted-foreground mb-2 text-lg">
            Don&apos;t see exactly what you need or have a custom project?
          </p>
          <Button variant="default" size="lg" asChild className="aura-pulse">
            <Link href="/contact">
              Request a Custom Quote
            </Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            We&apos;re happy to discuss custom project scopes and pricing with you.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
