
"use client";

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, LogOut, ShieldCheck, Loader2, TrendingUp, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const AdminPanelPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists() && userDocSnap.data().isAdmin === true) {
            setAdminUser(user);
            sessionStorage.setItem('isAdminAuthenticated', 'true'); 
          } else {
            await signOut(auth); 
            sessionStorage.removeItem('isAdminAuthenticated');
            toast({
              title: "Access Denied",
              description: "You are not authorized to view this page. Redirecting...",
              variant: "destructive"
            });
            router.replace('/');
          }
        } catch (error) {
          console.error("Error verifying admin status:", error);
          await signOut(auth);
          sessionStorage.removeItem('isAdminAuthenticated');
          toast({
            title: "Authentication Error",
            description: "Could not verify admin status. Redirecting...",
            variant: "destructive"
          });
          router.replace('/');
        }
      } else {
        sessionStorage.removeItem('isAdminAuthenticated');
         toast({
            title: "Access Denied",
            description: "You must be logged in as an admin to view this page. Redirecting...",
            variant: "destructive"
          });
        router.replace('/adminpanel/admin/login');
      }
      setIsLoading(false);
    });

    if (sessionStorage.getItem('isAdminAuthenticated') !== 'true' && !auth.currentUser) {
        if (!isLoading) { 
           router.replace('/adminpanel/admin/login');
        }
    }

    return () => unsubscribe();
  }, [router, toast, isLoading]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      sessionStorage.removeItem('isAdminAuthenticated');
      toast({
        title: "Admin Logout",
        description: "You have been logged out from the admin panel.",
      });
      router.push('/adminpanel/admin/login');
    } catch (error) {
      console.error("Error logging out admin:", error);
      toast({
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!adminUser) {
    return (
       <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <ShieldCheck className="h-16 w-16 text-destructive mb-4" />
        <p className="text-destructive">Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-lg px-4 md:px-6 py-12 md:py-16">
        <Card className="animate-fade-in shadow-xl border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center">
                <LayoutDashboard className="mr-3 h-8 w-8 text-primary" />
                Admin Control Panel
              </CardTitle>
              <CardDescription>Manage your application. Welcome, {adminUser.email}!</CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout} disabled={isLoading && router.pathname.includes('/adminpanel/admin/login')}>
              {isLoading && router.pathname.includes('/adminpanel/admin/login') ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOut className="mr-2 h-4 w-4" />}
               Admin Logout
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300 rounded-md">
              <p className="font-bold">Admin System Notice:</p>
              <p className="text-sm">This admin panel uses Firebase Authentication and Firestore for role verification.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                            <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Analytics Dashboard</CardTitle>
                            <CardDescription>View platform analytics and user metrics.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/adminpanel/admin/analytics">
                                Go to Analytics
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader className="flex flex-row items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage users, roles, and permissions.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button disabled className="w-full">
                            Coming Soon
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="p-6 border rounded-lg bg-muted/30">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Placeholder Admin Content</h3>
              <p className="text-muted-foreground">
                More admin functionalities like content moderation, settings, etc., will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanelPage;
