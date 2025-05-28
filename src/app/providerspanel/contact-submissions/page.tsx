
"use client";

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Added Button
import { ArrowLeft, Inbox, Loader2, ShieldCheck, Mail, Edit } from 'lucide-react'; // Added Mail and Edit
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: Timestamp;
  status: string;
}

const ProviderContactSubmissionsPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);
  const [providerUser, setProviderUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists() && userDocSnap.data().isProvider === true) {
            setProviderUser(user);
            sessionStorage.setItem('isProviderAuthenticated', 'true');
            fetchSubmissions();
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

  const fetchSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const q = query(collection(db, "contactSubmissions"), orderBy("submittedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedSubmissions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactSubmission[];
      setSubmissions(fetchedSubmissions);
    } catch (error) {
      console.error("Error fetching contact submissions: ", error);
      toast({
        title: "Error Fetching Submissions",
        description: "Could not load contact inquiries. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'default'; // Primary color
      case 'in progress':
        return 'secondary'; // Secondary color
      case 'resolved':
        return 'outline'; // More subtle, like green
      default:
        return 'outline';
    }
  };


  if (isLoadingPage) {
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
      <main className="flex-grow container mx-auto max-w-screen-xl px-4 md:px-6 py-12 md:py-16">
        <div className="mb-8">
            <Link href="/providerspanel/dashboard" className="text-primary hover:underline text-sm flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Provider Dashboard
            </Link>
        </div>
        <Card className="animate-fade-in shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Inbox className="mr-3 h-8 w-8 text-primary" />
              Contact Form Submissions
            </CardTitle>
            <CardDescription>Review inquiries and messages submitted through the contact form.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSubmissions ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-10 w-10 text-primary animate-spin mr-3" />
                <p className="text-muted-foreground">Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-10">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No contact submissions found at this time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          {submission.submittedAt ? format(submission.submittedAt.toDate(), 'MMM d, yyyy HH:mm') : 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">{submission.name}</TableCell>
                        <TableCell>{submission.email}</TableCell>
                        <TableCell>{submission.subject}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(submission.status)}>{submission.status || 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button variant="outline" size="sm" disabled> {/* Action button, disabled for now */}
                                <Edit className="h-3 w-3 mr-1" /> View/Edit
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-6 text-center">
                <Button onClick={fetchSubmissions} variant="outline" disabled={isLoadingSubmissions}>
                    <Loader2 className={`mr-2 h-4 w-4 ${isLoadingSubmissions ? 'animate-spin' : 'hidden'}`} />
                    Refresh Submissions
                </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProviderContactSubmissionsPage;
