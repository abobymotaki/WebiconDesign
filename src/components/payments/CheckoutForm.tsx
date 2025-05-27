
"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d", // Example color, adjust with your theme
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

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again in a moment.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card details are not available. Please ensure the form is loaded correctly.");
      setIsProcessing(false);
      return;
    }
    
    // Log for debugging, REMOVE in production if sensitive
    console.log("Attempting payment with name:", name, "email:", email);

    // -----------------------------------------------------------------------
    // IMPORTANT: Backend Integration Needed Here
    // -----------------------------------------------------------------------
    // 1. Create a PaymentIntent on your server.
    //    Your backend should receive an amount and currency, then create a
    //    PaymentIntent using the Stripe SDK (e.g., `stripe.paymentIntents.create`).
    //    It should return the `client_secret` of the PaymentIntent.
    //
    //    Example (pseudo-code for backend call):
    //    const response = await fetch('/api/create-payment-intent', {
    //      method: 'POST',
    //      headers: { 'Content-Type': 'application/json' },
    //      body: JSON.stringify({ amount: 1000, currency: 'usd' }), // Example: $10.00
    //    });
    //    const { clientSecret, error: backendError } = await response.json();
    //
    //    if (backendError) {
    //      setError(backendError.message || "Failed to create payment intent.");
    //      setIsProcessing(false);
    //      return;
    //    }
    //    if (!clientSecret) {
    //      setError("PaymentIntent client secret not received from server.");
    //      setIsProcessing(false);
    //      return;
    //    }

    // For demonstration, we'll simulate a successful client-side tokenization.
    // In a real app, you'd use the clientSecret from your backend.
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: name,
        email: email,
      },
    });


    if (stripeError) {
      setError(stripeError.message || "An unexpected error occurred.");
      toast({
        title: "Payment Failed",
        description: stripeError.message || "Please check your card details and try again.",
        variant: "destructive",
      });
    } else if (paymentMethod) {
      // Here you would typically send paymentMethod.id to your backend
      // to confirm the PaymentIntent using the clientSecret obtained earlier.
      // e.g. stripe.confirmCardPayment(clientSecret, { payment_method: paymentMethod.id })
      console.log('[PaymentMethod]', paymentMethod);
      toast({
        title: "Payment Method Created (Demo)",
        description: `Payment method ID: ${paymentMethod.id}. Backend confirmation needed.`,
      });
      // Reset form or redirect to success page after backend confirmation
      setName('');
      setEmail('');
      cardElement.clear();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="John Doe" 
          required 
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="john.doe@example.com" 
          required 
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="card-element">Card Details</Label>
        <div id="card-element" className="mt-1 p-3 border border-input rounded-md bg-background">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive" role="alert">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full aura-pulse" disabled={!stripe || isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now (Demo)
          </>
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        This is a demo payment form. Real payment processing requires backend integration.
      </p>
    </form>
  );
};

export default CheckoutForm;
