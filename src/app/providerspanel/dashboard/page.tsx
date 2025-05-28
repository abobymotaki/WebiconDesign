
"use client";

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Added Link
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, LogOut, Briefcase, Loader2, ShieldCheck, UserCog, FileText, MessageSquare } from 'lucide-react'; // Added UserCog, FileText, MessageSquare
import { useToast } from '@/hooks/use-toast';

const ProviderDashboardPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providerUser, setProviderUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists() && userDocSnap.data().isProvider === true) {
            setProviderUser(user);
            sessionStorage.setItem('isProviderAuthenticated', 'true'); 
          } else {
            await signOut(auth); 
            sessionStorage.removeItem('isProviderAuthenticated');
            toast({
              title: "Access Denied",
              description: "You are not authorized as a provider. Redirecting...",
              variant: "destructive"
            });
            router.replace('/');
          }
        } catch (error) {
          console.error("Error verifying provider status:", error);
          await signOut(auth);
          sessionStorage.removeItem('isProviderAuthenticated');
          toast({
            title: "Authentication Error",
            description: "Could not verify provider status. Redirecting...",
            variant: "destructive"
          });
          router.replace('/');
        }
      } else {
        sessionStorage.removeItem('isProviderAuthenticated');
         toast({
            title: "Access Denied",
            description: "You must be logged in as a provider. Redirecting...",
            variant: "destructive"
          });
        router.replace('/providerspanel/login');
      }
      setIsLoading(false);
    });

    if (sessionStorage.getItem('isProviderAuthenticated') !== 'true' && !auth.currentUser) {
        if (!isLoading) { 
           router.replace('/providerspanel/login');
        }
    }

    return () => unsubscribe();
  }, [router, toast, isLoading]);

  const handleLogout = async () => {
    setIsLoading(true); 
    try {
      await signOut(auth);
      sessionStorage.removeItem('isProviderAuthenticated');
      toast({
        title: "Provider Logout",
        description: "You have been logged out from the provider panel.",
      });
      router.push('/providerspanel/login');
    } catch (error) {
      console.error("Error logging out provider:", error);
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
        <p className="text-muted-foreground">Verifying Provider Access...</p>
      </div>
    );
  }

  if (!providerUser) {
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
                Provider Dashboard
              </CardTitle>
              <CardDescription>Manage your services and profile. Welcome, {providerUser.email}!</CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout} disabled={isLoading && router.pathname.includes('/providerspanel/login')}>
              {isLoading && router.pathname.includes('/providerspanel/login') ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOut className="mr-2 h-4 w-4" />}
               Provider Logout
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300 rounded-md">
              <p className="font-bold">Provider System Notice:</p>
              <p className="text-sm">This panel uses Firebase Authentication and Firestore for role verification.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                            <UserCog className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Manage Profile</CardTitle>
                            <CardDescription>Update your public profile and skills.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/providerspanel/profile">
                                Go to Profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader className="flex flex-row items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>View Projects/Requests</CardTitle>
                            <CardDescription>See available projects or client requests.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button disabled className="w-full">
                            Coming Soon
                        </Button>
                    </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader className="flex flex-row items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Contact Submissions</CardTitle>
                            <CardDescription>Review inquiries from the contact page.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button disabled className="w-full">
                           Coming Soon
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="hover:shadow-lg transition-shadow">
                     <CardHeader className="flex flex-row items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/10">
                            <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Client Messages</CardTitle>
                            <CardDescription>View and respond to client messages.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full" disabled>
                           <Link href="/messages"> {/* Link to existing messages page, may need provider-specific filtering later */}
                                View Messages (Coming Soon)
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="p-6 border rounded-lg bg-muted/30">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Placeholder Provider Content</h3>
              <p className="text-muted-foreground">
                More provider-specific tools and features will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderDashboardPage;
