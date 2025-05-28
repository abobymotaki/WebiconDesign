
"use client";

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LogIn, Loader2, Briefcase } from 'lucide-react';

const providerLoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type ProviderLoginFormValues = z.infer<typeof providerLoginFormSchema>;

const ProviderLoginPage: NextPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('isProviderAuthenticated') === 'true') {
      router.replace('/providerspanel/dashboard');
    }
  }, [router]);

  const form = useForm<ProviderLoginFormValues>({
    resolver: zodResolver(providerLoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: ProviderLoginFormValues) => {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().isProvider === true) {
          sessionStorage.setItem('isProviderAuthenticated', 'true');
          toast({
            title: "Provider Login Successful!",
            description: "Redirecting to provider panel...",
          });
          router.push('/providerspanel/dashboard');
        } else {
          await signOut(auth);
          toast({
            title: "Provider Login Failed",
            description: "You are not authorized as a service provider.",
            variant: "destructive",
          });
          form.resetField("password");
        }
      } else {
        throw new Error("User not found after login.");
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred during provider login.";
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = "Invalid email or password.";
            break;
          default:
            errorMessage = error.message;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast({
        title: "Provider Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      form.resetField("password");
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
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl font-bold">Provider Panel Login</CardTitle>
            <CardDescription>Access your provider dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="provider@example.com" {...field} />
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
                      <FormLabel>Provider Password</FormLabel>
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
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login as Provider
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Not a provider? Return to {' '}
              <Link href="/" className="font-medium text-primary hover:underline">
                Homepage
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderLoginPage;
