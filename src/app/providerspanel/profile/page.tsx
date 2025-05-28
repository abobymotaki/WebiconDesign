
"use client";

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProviderProfileForm, { type ProviderProfileFormValues } from '@/components/providers/ProviderProfileForm';

const ManageProviderProfilePage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [providerUser, setProviderUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<DocumentData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists() && userDocSnap.data().isProvider === true) {
            setProviderUser(user);
            setProfileData(userDocSnap.data());
            sessionStorage.setItem('isProviderAuthenticated', 'true');
          } else {
            await signOut(auth);
            sessionStorage.removeItem('isProviderAuthenticated');
            toast({ title: "Access Denied", description: "Not a provider. Redirecting...", variant: "destructive" });
            router.replace('/');
          }
        } catch (error) {
          console.error("Error verifying provider status:", error);
          await signOut(auth);
          sessionStorage.removeItem('isProviderAuthenticated');
          toast({ title: "Authentication Error", description: "Could not verify provider status. Redirecting...", variant: "destructive" });
          router.replace('/');
        }
      } else {
        sessionStorage.removeItem('isProviderAuthenticated');
        toast({ title: "Access Denied", description: "Not logged in. Redirecting...", variant: "destructive" });
        router.replace('/providerspanel/login');
      }
      setIsLoadingPage(false);
    });
    
    if (sessionStorage.getItem('isProviderAuthenticated') !== 'true' && !auth.currentUser && !isLoadingPage) {
       router.replace('/providerspanel/login');
    }

    return () => unsubscribe();
  }, [router, toast, isLoadingPage]);

  const handleProfileUpdate = async (data: ProviderProfileFormValues) => {
    if (!providerUser) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, "users", providerUser.uid);
      
      // Prepare data for Firestore, converting comma-separated skills to array
      const skillsArray = data.skills ? data.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [];
      
      const dataToSave: Partial<ProviderProfileFormValues & { skills: string[], updatedAt: any }> = {
        ...data,
        skills: skillsArray,
        updatedAt: serverTimestamp(),
      };
      
      // Remove undefined fields to avoid Firestore errors
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key as keyof typeof dataToSave] === undefined || dataToSave[key as keyof typeof dataToSave] === '') {
          delete dataToSave[key as keyof typeof dataToSave];
        }
      });


      await setDoc(userDocRef, dataToSave, { merge: true });
      toast({
        title: "Profile Updated!",
        description: "Your profile information has been saved.",
      });
      // Optionally re-fetch profile data if needed, or optimistically update state
      const updatedDocSnap = await getDoc(userDocRef);
      if (updatedDocSnap.exists()) {
        setProfileData(updatedDocSnap.data());
      }

    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Profile Update Failed",
        description: error.message || "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPage) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading Profile Management...</p>
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
        <div className="mb-8">
            <Link href="/providerspanel/dashboard" className="text-primary hover:underline text-sm flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Provider Dashboard
            </Link>
        </div>
        <Card className="animate-fade-in shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <UserCog className="mr-3 h-8 w-8 text-primary" />
              Manage Your Profile
            </CardTitle>
            <CardDescription>Keep your public-facing information up to date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <ProviderProfileForm
              currentUser={providerUser}
              currentProfileData={profileData}
              onSubmit={handleProfileUpdate}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ManageProviderProfilePage;
