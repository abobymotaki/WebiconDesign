
"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { StripeCardElement } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(2000); // Default amount in cents, e.g., $20.00

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again in a moment.");
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement) as StripeCardElement | null;

    if (!cardElement) {
      setError("Card details are not available. Please ensure the form is loaded correctly.");
      setIsProcessing(false);
      return;
    }

    if (amount < 50) {
        setError("Amount must be at least 50 cents.");
        toast({
            title: "Invalid Amount",
            description: "The minimum payment amount is $0.50.",
            variant: "destructive",
        });
        setIsProcessing(false);
        return;
    }


    try {
      // Step 1: Create a PaymentIntent on the server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount, currency: 'usd', name: name, email: email }),
      });

      const paymentIntentData = await response.json();

      if (!response.ok || paymentIntentData.error) {
        setError(paymentIntentData.error?.message || "Failed to create payment intent.");
        toast({
          title: "Payment Setup Failed",
          description: paymentIntentData.error?.message || "Could not initiate payment. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const { clientSecret } = paymentIntentData; // paymentIntentId is also available if needed

      if (!clientSecret) {
        setError("PaymentIntent client secret not received from server.");
        toast({
          title: "Payment Error",
          description: "Could not retrieve payment information from server. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Step 2: Confirm the card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "An unexpected error occurred during payment confirmation.");
        toast({
          title: "Payment Failed",
          description: stripeError.message || "Please check your card details and try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Step 3: Save transaction details to Firestore
        try {
          await addDoc(collection(db, 'payments'), {
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            email: email,
            name: name,
            status: paymentIntent.status,
            createdAt: serverTimestamp(),
            // userId: paymentIntent.metadata?.firebaseUserId || null, // Example if you stored Firebase UID in metadata
          });

          toast({
            title: "Payment Successful!",
            description: `Transaction ID: ${paymentIntent.id}. Thank you!`,
          });
          // Reset form
          setName('');
          setEmail('');
          setAmount(2000); // Reset amount to default
          cardElement.clear();

        } catch (dbError: any) {
          // Log database error for admin review, but don't necessarily fail the user UX here
          console.error("Error saving transaction to Firestore:", dbError);
          toast({
            title: "Payment Successful, Record Issue",
            description: "Your payment was successful, but there was an issue saving the transaction record. Please contact support with Transaction ID: " + paymentIntent.id,
            variant: "default", 
          });
        }
      } else {
        setError(`Payment not successful. Status: ${paymentIntent?.status}`);
        toast({
          title: "Payment Not Successful",
          description: `Payment status: ${paymentIntent?.status}. Please try again or contact support.`,
          variant: "destructive",
        });
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred during checkout.");
      toast({
        title: "Checkout Error",
        description: e.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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
        <Label htmlFor="amount">Amount (USD)</Label>
        <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground">$</span>
            <Input
            id="amount-display"
            type="number"
            value={(amount / 100).toFixed(2)}
            onChange={(e) => {
                const displayVal = parseFloat(e.target.value);
                if (!isNaN(displayVal) && displayVal >= 0.50) {
                    setAmount(Math.round(displayVal * 100));
                } else if (e.target.value === "") {
                     setAmount(0); // Or handle as error, but allow clearing
                }
            }}
            placeholder="e.g., 20.00"
            required
            className="pl-7 pr-3 py-2"
            min="0.50"
            step="0.01"
            />
        </div>
         <p className="text-xs text-muted-foreground mt-1">
          Minimum $0.50.
        </p>
      </div>
      <div>
        <Label htmlFor="card-element">Card Details</Label>
        <div id="card-element" className="mt-1 p-3 border border-input rounded-md bg-background">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive py-2 px-3 bg-destructive/10 border border-destructive/20 rounded-md" role="alert">
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
            Pay ${(amount / 100).toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

export default CheckoutForm;
