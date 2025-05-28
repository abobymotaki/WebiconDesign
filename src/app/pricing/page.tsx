
"use client";

import type { NextPage } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, DollarSign, Zap } from 'lucide-react';

const pricingTiers = [
  {
    name: 'Basic Tier',
    price: '$29',
    frequency: '/month',
    description: 'Perfect for individuals and small projects to get started.',
    features: [
      'Access to basic platform features',
      'Post up to 5 projects/services',
      'Standard support',
      'Community access',
    ],
    ctaText: 'Choose Basic',
    ctaLink: '/signup',
    popular: false,
  },
  {
    name: 'Standard Tier',
    price: '$79',
    frequency: '/month',
    description: 'Ideal for growing businesses and professionals needing more.',
    features: [
      'All Basic Tier features',
      'Post up to 20 projects/services',
      'Priority support',
      'Advanced analytics access',
      'Featured listings (optional)',
    ],
    ctaText: 'Choose Standard',
    ctaLink: '/signup',
    popular: true,
  },
  {
    name: 'Premium Tier',
    price: '$149',
    frequency: '/month',
    description: 'For established businesses and power users requiring full capabilities.',
    features: [
      'All Standard Tier features',
      'Unlimited projects/services',
      'Dedicated account manager',
      'Premium API access',
      'Early access to new features',
    ],
    ctaText: 'Choose Premium',
    ctaLink: '/signup',
    popular: false,
  },
];

const PricingPage: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-xl px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <DollarSign className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Our Flexible <span className="text-primary">Pricing Plans</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a plan that fits your needs. All plans come with our core platform benefits and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.name}
              className={`flex flex-col hover:shadow-xl transition-shadow duration-300 animate-fade-in-delay-${index % 3} 
                          ${tier.popular ? 'border-primary border-2 relative' : 'border-border'}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md flex items-center">
                  <Zap className="h-3 w-3 mr-1" /> POPULAR
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-foreground">{tier.name}</CardTitle>
                <CardDescription className="min-h-[40px]">{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-foreground">{tier.price}</span>
                  <span className="text-lg text-muted-foreground">{tier.frequency}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button asChild className={`w-full ${tier.popular ? 'aura-pulse' : ''}`} variant={tier.popular ? 'default' : 'outline'}>
                  <Link href={tier.ctaLink}>{tier.ctaText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-2">
            Have specific requirements or need a custom plan?
          </p>
          <Button variant="link" asChild>
            <Link href="/contact" className="text-primary text-lg">
              Contact Sales
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
