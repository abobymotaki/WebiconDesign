
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase'; // db might be used if linking payments to user profiles directly here later
// import { auth } from '@/lib/firebase'; // For future use if associating with logged-in Firebase user

// Ensure STRIPE_SECRET_KEY is set in your .env.local or Vercel environment variables
// For Vercel, set it in Project Settings -> Environment Variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not set. Stripe functionality will not work.");
}

const stripe = new Stripe(stripeSecretKey!, {
  apiVersion: '2024-06-20', // Use a recent API version
});

export async function POST(request: Request) {
  if (!stripeSecretKey) {
    return NextResponse.json({ error: { message: 'Stripe is not configured on the server.' } }, { status: 500 });
  }

  try {
    const { amount, currency = 'usd', name, email } = await request.json();

    if (!amount || amount < 50) { // Stripe has minimum charge amounts (e.g., $0.50 USD)
      return NextResponse.json({ error: { message: 'Invalid amount. Amount must be at least 50 cents.' } }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ error: { message: 'Email is required.' } }, { status: 400 });
    }

    // Optional: Create or retrieve a Stripe Customer
    let customer;
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        name: name || undefined, // Name is optional for customer creation
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: currency,
      customer: customer.id,
      payment_method_types: ['card'],
      metadata: {
        email: email,
        // Example: You could add Firebase UID if user is authenticated
        // firebaseUserId: auth.currentUser?.uid || 'anonymous_payment', 
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });

  } catch (error: any) {
    console.error('Error creating PaymentIntent:', error);
    // Return a generic error message to the client for security
    return NextResponse.json({ error: { message: 'Failed to create payment intent. Please try again.' } }, { status: 500 });
  }
}
