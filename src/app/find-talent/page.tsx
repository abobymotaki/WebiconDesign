
"use client";

import type { NextPage } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, DollarSign, MapPin, Star, Loader2, Search, ShieldAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


interface Professional {
  id: string;
  name: string;
  avatar: string;
  dataAiHint: string;
  role: string;
  bio: string;
  skills: string[];
  rate: string;
  location: string;
  rating: number;
  // Add other fields that might come from Firestore, ensure they match the 'talents' collection structure
}

const placeholderProfessionalsOnError: Professional[] = [
 {
    id: '1',
    name: 'Alice Wonderland (Error Fallback)',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    role: 'Senior UI/UX Designer',
    bio: 'Passionate designer with 7+ years of experience creating intuitive and engaging user experiences for web and mobile. (Error data)',
    skills: ['UI Design', 'UX Research', 'Prototyping', 'Figma', 'Adobe XD'],
    rate: '$75/hr',
    location: 'New York, USA',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Bob The Builder (Error Fallback)',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    role: 'Full-Stack Web Developer',
    bio: 'Versatile developer specializing in React, Node.js, and modern cloud architectures. Loves solving complex problems. (Error data)',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL', 'Next.js'],
    rate: '$90/hr',
    location: 'London, UK',
    rating: 4.8,
  },
];


const FindProfessionalsPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchProfessionals();
      } else {
        toast({
          title: "Access Denied",
          description: "You need to be logged in to view this page. Redirecting...",
          variant: "destructive",
        });
        router.replace('/'); // Redirect to landing page if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router, toast]);

  const fetchProfessionals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch users marked as 'isProvider' from the 'users' collection
      // Or, if you have a separate 'talents' or 'providers' collection that contains their profile details:
      const providersQuery = query(collection(db, 'users'), where('isProvider', '==', true));
      const providerSnapshot = await getDocs(providersQuery);
      
      const professionalsList = providerSnapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnap.data();
        return {
          id: docSnap.id, // This is the user's UID
          name: data.name || 'N/A', // Assuming 'name' field exists
          avatar: data.avatarUrl || `https://placehold.co/100x100.png`, // Assuming 'avatarUrl'
          dataAiHint: data.dataAiHint || `${data.name ? data.name.split(' ')[0].toLowerCase() : 'person'} portrait`,
          role: data.role || 'Service Provider', // Assuming 'role' field
          bio: data.bio || 'No bio available.', // Assuming 'bio' field
          skills: data.skills || [], // Assuming 'skills' array
          rate: data.rate || 'N/A', // Assuming 'rate'
          location: data.location || 'Remote', // Assuming 'location'
          rating: data.rating || 0, // Assuming 'rating'
          ...data, // Spread other potential fields
        } as Professional;
      });
      
      if (professionalsList.length === 0) {
         setProfessionals(placeholderProfessionalsOnError); 
         setError("No professionals found at the moment. Displaying placeholder data.");
      } else {
        setProfessionals(professionalsList);
      }
    } catch (err) {
      console.error("Error fetching professionals:", err);
      setError('Failed to load professionals. Displaying placeholder data.');
      setProfessionals(placeholderProfessionalsOnError);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser && isLoading) { // Show loading while auth state is being determined
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }
  
  // If not authenticated and no longer loading auth, redirection should have happened.
  // This is a fallback.
  if (!currentUser && !isLoading) {
     return (
       <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <p className="text-destructive">Access Denied. Redirecting...</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-xl px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
           <Search className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Discover <span className="text-primary">Skilled Professionals</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated list of professionals ready to bring your projects to life.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Loading professionals...</p>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && professionals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionals.map((professional, index) => (
              <Card 
                key={professional.id} 
                className={`hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-delay-${index % 3}`}
              >
                <CardHeader className="items-center text-center pb-4">
                  <Avatar className="w-24 h-24 mb-4 border-2 border-primary/20 shadow-md">
                    {/* Ensure professional.avatar is a valid URL */}
                    <Image src={professional.avatar || 'https://placehold.co/100x100.png'} alt={professional.name} width={100} height={100} className="rounded-full" data-ai-hint={professional.dataAiHint || "person"} />
                    <AvatarFallback>{professional.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl font-semibold text-foreground">{professional.name}</CardTitle>
                  <CardDescription className="text-primary font-medium flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> {professional.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm mb-4 px-2">{professional.bio}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {(professional.skills || []).slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                    {(professional.skills || []).length > 4 && <Badge variant="outline" className="text-xs">+{professional.skills.length - 4} more</Badge>}
                  </div>
                  <div className="flex justify-around items-center text-sm text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-primary/80" />
                      <span>{professional.rate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary/80" />
                      <span>{professional.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span>{professional.rating}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-center pt-4">
                  {/* Link to a dynamic profile page based on user/provider ID */}
                  <Button asChild className="w-full md:w-auto" disabled>
                    <Link href={`/profile/${professional.id}`}>View Profile (Coming Soon)</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
         {professionals.length === 0 && !isLoading && !error && ( // Condition when fetch is done, no error, but no professionals
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">No professionals found matching the criteria.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FindProfessionalsPage;
