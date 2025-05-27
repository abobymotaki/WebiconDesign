
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
import { LayoutDashboard, LogOut, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
            sessionStorage.setItem('isAdminAuthenticated', 'true'); // Keep sessionStorage for quick client checks if needed
          } else {
            // User is authenticated with Firebase, but not an admin in Firestore
            await signOut(auth); // Sign them out
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
        // No user logged in with Firebase Auth
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

    // Fallback check for sessionStorage in case onAuthStateChanged takes time or has issues
    // This helps prevent brief flashes of content for non-admins if they land here directly
    // and Firebase hasn't yet determined auth state.
    if (sessionStorage.getItem('isAdminAuthenticated') !== 'true' && !auth.currentUser) {
        if (!isLoading) { // only redirect if initial check is done
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
      // sessionStorage.removeItem('adminUserDetails'); 
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
    // This state should ideally not be reached for long due to redirects in useEffect
    // but acts as a fallback.
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
              <CardDescription>Manage your application from here. Welcome, {adminUser.email}!</CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
              {isLoading && router.pathname.includes('/adminpanel/admin/login') ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <LogOut className="mr-2 h-4 w-4" />}
               Admin Logout
            </Button>
          </CardHeader>
          <CardContent>
             <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300 rounded-md">
              <p className="font-bold">Admin System Notice:</p>
              <p className="text-sm">This admin panel now uses Firebase Authentication and Firestore for role verification. Ensure the admin user is correctly set up in Firebase Auth and their Firestore document has `isAdmin: true`.</p>
            </div>
            <div className="p-6 border rounded-lg bg-muted/30">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Placeholder Admin Content</h3>
              <p className="text-muted-foreground">
                This is where your admin functionalities like user management, analytics, content moderation, etc., would go.
                For now, it's a placeholder to demonstrate the login and logout flow using Firebase.
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
