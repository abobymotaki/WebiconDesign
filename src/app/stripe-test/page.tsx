
"use client";

import type { NextPage } from 'next';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const StripeTestPage: NextPage = () => {
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && stripePromise) {
      setStripeConfigured(true);
    } else {
      setError("Stripe Publishable Key is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.");
      console.error("Stripe Publishable Key missing.");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-md px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Stripe <span className="text-primary">Integration Test</span>
          </h1>
          <p className="mt-3 text-md text-muted-foreground max-w-lg mx-auto">
            This page tests if the Stripe Card Element can be loaded and rendered.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Stripe Card Element Test</CardTitle>
            <CardDescription>
              If Stripe is configured correctly, a card input field should appear below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center p-4 mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg" role="alert">
                <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
                <div>
                  <span className="font-medium">Configuration Error:</span> {error}
                </div>
              </div>
            )}
            {!error && stripeConfigured && stripePromise ? (
              <>
                <div className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-700" role="alert">
                  <CheckCircle2 className="flex-shrink-0 inline w-5 h-5 mr-3" />
                  <div>
                    <span className="font-medium">Stripe Configured!</span> Publishable key found.
                  </div>
                </div>
                <Elements stripe={stripePromise}>
                  <div className="p-3 border border-input rounded-md bg-background">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </Elements>
              </>
            ) : (
              !error && <p className="text-muted-foreground">Loading Stripe...</p>
            )}
          </CardContent>
        </Card>
         <div className="mt-8 text-center">
            <a 
                href="https://stripe.com/docs/testing#cards" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
            >
                View Stripe Test Card Numbers
            </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StripeTestPage;
