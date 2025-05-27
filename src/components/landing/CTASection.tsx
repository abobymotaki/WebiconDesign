import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-screen-md px-4 md:px-6 text-center animate-fade-in">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary-foreground opacity-80" />
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-shadow-pop">
          Ready to Elevate Your Work?
        </h2>
        <p className="mt-6 text-lg md:text-xl max-w-xl mx-auto opacity-90">
          Join WebiconDesign today and connect with a vibrant community of freelancers and businesses.
          Your next big opportunity is just a click away.
        </p>
        <div className="mt-10">
          <Button
            size="lg"
            variant="secondary" 
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 aura-pulse shadow-lg transform hover:scale-105 transition-transform duration-200"
            asChild
          >
            <Link href="/signup">
              Sign Up Now - It&apos;s Free!
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-sm opacity-70">
          Start for free, no obligations.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
