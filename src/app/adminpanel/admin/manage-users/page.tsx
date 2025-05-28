
"use client";

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, ShieldCheck, Loader2, Users, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm, { type CreateUserFormValues } from '@/components/admin/CreateUserForm';

const ManageUsersPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [formKey, setFormKey] = useState(Date.now()); // Used to force re-render CreateUserForm

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
            toast({ title: "Access Denied", description: "Not an admin. Redirecting...", variant: "destructive" });
            router.replace('/');
          }
        } catch (error) {
          console.error("Error verifying admin status:", error);
          await signOut(auth);
          sessionStorage.removeItem('isAdminAuthenticated');
          toast({ title: "Authentication Error", description: "Could not verify admin status. Redirecting...", variant: "destructive" });
          router.replace('/');
        }
      } else {
        sessionStorage.removeItem('isAdminAuthenticated');
        toast({ title: "Access Denied", description: "Not logged in. Redirecting...", variant: "destructive" });
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

  const handleCreateUser = async (data: CreateUserFormValues) => {
    setIsSubmitting(true);
    try {
      // Note: This approach of creating users client-side with admin's auth state
      // has limitations, especially if you want to avoid the admin being signed-out/in.
      // A Firebase Admin SDK on a backend function is the robust way.
      // For this prototype, we are proceeding client-side.
      // To avoid interference with admin's auth state, ideally one would use a secondary Firebase app instance or Admin SDK.
      // Here, we use the existing `auth` instance. Firebase typically handles this gracefully,
      // but `createUserWithEmailAndPassword` might briefly sign in the new user then sign out.
      // The crucial part is setting Firestore data *before* any potential auth state change.
      
      // Create temporary auth instance for new user creation if possible, or accept that admin's current session *might* be affected.
      // For simplicity here, we use the main `auth` object.
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        uid: newUser.uid,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin || false,
        isProvider: data.isProvider || false, // Save isProvider status
        createdAt: serverTimestamp(),
      });

      // IMPORTANT: If the admin created the user, they are likely still logged in as admin.
      // If createUserWithEmailAndPassword changes the auth state, we need to ensure the admin panel remains accessible.
      // The useEffect in this page handles re-verification of admin status.

      toast({
        title: "User Created Successfully!",
        description: `Account for ${data.email} has been created.`,
      });
      setFormKey(Date.now()); // Change key to re-render and reset CreateUserForm
    } catch (error: any) {
      console.error("Error creating user:", error);
      let errorMessage = "Failed to create user.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast({
        title: "User Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFormKey(Date.now());
  };


  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Verifying Admin Access & Loading User Management...</p>
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
      <main className="flex-grow container mx-auto max-w-screen-md px-4 md:px-6 py-12 md:py-16">
        <div className="mb-8">
            <Link href="/adminpanel/admin" className="text-primary hover:underline text-sm flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin Panel
            </Link>
        </div>
        <Card className="animate-fade-in shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Users className="mr-3 h-8 w-8 text-primary" />
              Manage Users
            </CardTitle>
            <CardDescription>Create new user accounts for the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <CreateUserForm key={formKey} onSubmit={handleCreateUser} isSubmitting={isSubmitting} onFormReset={resetForm} />
            {/* Placeholder for listing users in the future */}
            {/* <div className="mt-8 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4">Existing Users</h3>
              <p className="text-muted-foreground">User listing will appear here.</p>
            </div> */}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ManageUsersPage;
