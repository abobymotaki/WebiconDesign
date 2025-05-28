
"use client";

import type { NextPage } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Added db
import { doc, getDoc } from 'firebase/firestore'; // Added getDoc
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).max(100),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(100),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage: NextPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      toast({
        title: "Login Successful!",
        description: "Welcome back.",
        variant: "default",
      });

      // Check if user is a provider and redirect
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().isProvider === true) {
          sessionStorage.setItem('isProviderAuthenticated', 'true');
          router.push('/providerspanel/dashboard'); // Redirect providers to their dashboard
        } else if (userDocSnap.exists() && userDocSnap.data().isAdmin === true) {
          sessionStorage.setItem('isAdminAuthenticated', 'true');
          router.push('/adminpanel/admin'); // Redirect admins to their dashboard
        }
        else {
          router.push('/'); // Redirect regular users to homepage
        }
      } else {
        router.push('/'); // Fallback redirect
      }

    } catch (error: any) {
      console.error("Error signing in:", error);
       const errorMessage = error.code === 'auth/invalid-credential' 
        ? "Invalid email or password. Please try again."
        : error.message || "An unexpected error occurred.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-sm px-4 md:px-6 py-12 md:py-16 flex items-center justify-center">
        <Card className="w-full max-w-md animate-fade-in shadow-xl border-primary/20">
          <CardHeader className="text-center">
            <LogIn className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Log in to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full aura-pulse" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Log In
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
