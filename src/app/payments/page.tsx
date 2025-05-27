
"use client";

import type { NextPage } from 'next';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/payments/CheckoutForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Added missing import

// Ensure your Stripe publishable key is set in your .env file
// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_yourkeyhere
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const PaymentsPage: NextPage = () => {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripeLoaded(true);
    } else {
      console.error("Stripe publishable key is not set. Please check your environment variables.");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-md px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <CreditCard className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Secure <span className="text-primary">Payments</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Complete your transaction securely. Your payment information is protected.
          </p>
        </div>

        <Card className="animate-fade-in-delay-1 shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Payment Details</CardTitle>
            <CardDescription>Enter your payment information below.</CardDescription>
          </CardHeader>
          <CardContent>
            {!stripeLoaded || !stripePromise ? (
              <div className="text-center py-8">
                <p className="text-destructive">
                  Stripe is not configured correctly. Please ensure the Stripe publishable key is set in environment variables.
                </p>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-muted-foreground text-sm flex items-center justify-center gap-2 animate-fade-in-delay-2">
          <ShieldCheck className="h-5 w-5 text-green-500" />
          <span>Powered by Stripe. All transactions are secure and encrypted.</span>
        </div>
         <div className="mt-4 text-center">
            <Link href="/stripe-test" className="text-sm text-primary hover:underline">
                Test Stripe Element Rendering
            </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentsPage;
