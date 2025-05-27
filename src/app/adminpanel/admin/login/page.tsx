
"use client";

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  password: z.string().min(1, { message: "Password is required." }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginFormSchema>;

const ADMIN_EMAIL = "takiakiba3@gmail.com";
const ADMIN_PASSWORD = "adminTaki,1234";

const AdminLoginPage: NextPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already admin authenticated
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      toast({
        title: "Admin Login Successful!",
        description: "Redirecting to admin panel...",
        variant: "default",
      });
      router.push('/adminpanel/admin');
    } else {
      toast({
        title: "Admin Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      form.resetField("password");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-sm px-4 md:px-6 py-12 md:py-16 flex items-center justify-center">
        <Card className="w-full max-w-md animate-fade-in shadow-xl border-primary/20">
          <CardHeader className="text-center">
            <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl font-bold">Admin Panel Login</CardTitle>
            <CardDescription>Access restricted to authorized personnel.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-300 rounded-md">
              <p className="font-bold">Security Notice:</p>
              <p className="text-sm">This is a prototype admin login with hardcoded credentials and is NOT secure for production use.</p>
            </div>
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
