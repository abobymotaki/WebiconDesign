import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-background to-accent/30 dark:from-background dark:to-accent/10 py-20 md:py-32 animate-fade-in overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        {/* Subtle background pattern or shapes */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Unleash Your <span className="text-primary">Project Potential</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0">
              WebiconDesign is the premier platform connecting innovative professionals with businesses seeking top-tier talent for their projects.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="aura-pulse">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#how-it-works">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch How It Works
                </Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Join thousands of professionals and clients. No credit card required.
            </p>
          </div>
          <div className="relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Image
              src="https://placehold.co/600x400.png"
              alt="Platform interface"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl relative z-10 transform group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="digital workspace"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
