
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
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';

const adminLoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Min 1 for prototype, Firebase has its own rules
});

type AdminLoginFormValues = z.infer<typeof adminLoginFormSchema>;

const AdminLoginPage: NextPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already admin authenticated (via sessionStorage flag)
  useEffect(() => {
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
      router.replace('/adminpanel/admin');
    }
  }, [router]);

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().isAdmin === true) {
          sessionStorage.setItem('isAdminAuthenticated', 'true');
          // Optionally store admin user details if needed, but be mindful of PII in sessionStorage
          // sessionStorage.setItem('adminUserDetails', JSON.stringify({ uid: user.uid, email: user.email }));
          toast({
            title: "Admin Login Successful!",
            description: "Redirecting to admin panel...",
            variant: "default",
          });
          router.push('/adminpanel/admin');
        } else {
          // Logged in via Firebase Auth, but not an admin in Firestore
          await signOut(auth); // Sign out the non-admin user
          toast({
            title: "Admin Login Failed",
            description: "You are not authorized to access the admin panel.",
            variant: "destructive",
          });
          form.resetField("password");
        }
      } else {
         // Should not happen if signInWithEmailAndPassword resolves successfully
        throw new Error("User not found after login.");
      }
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred during admin login.";
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
        title: "Admin Login Failed",
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
            <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl font-bold">Admin Panel Login</CardTitle>
            <CardDescription>Access restricted. Please log in with admin credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@example.com" {...field} />
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
                      <FormLabel>Admin Password</FormLabel>
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
                      Login as Admin
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Return to {' '}
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

export default AdminLoginPage;
